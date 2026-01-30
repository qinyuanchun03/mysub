
import { ProtocolType, NodeConfig } from '../types';

export const parseNodeLink = (link: string): NodeConfig | null => {
  try {
    const trimmedLink = link.trim();
    if (trimmedLink.startsWith('vmess://')) {
      const base64Content = trimmedLink.replace('vmess://', '');
      const decoded = atob(base64Content.replace(/-/g, '+').replace(/_/g, '/'));
      const json = JSON.parse(decoded);
      return {
        protocol: ProtocolType.VMESS,
        uuid: json.id,
        host: json.add || '',
        port: json.port || 443,
        path: json.path || '/',
        sni: json.sni || json.host || json.add || '',
        type: json.net || 'ws',
        security: json.tls === 'tls' ? 'tls' : 'none',
        remarks: json.ps || 'VMess Node'
      };
    }

    if (trimmedLink.startsWith('vless://') || trimmedLink.startsWith('trojan://')) {
      const protocol = trimmedLink.startsWith('vless://') ? ProtocolType.VLESS : ProtocolType.TROJAN;
      const url = new URL(trimmedLink);
      const searchParams = new URLSearchParams(url.search);
      
      let port = url.port;
      if (!port) {
        port = (protocol === ProtocolType.TROJAN || searchParams.get('security') === 'tls') ? '443' : '80';
      }

      return {
        protocol,
        uuid: url.username,
        host: url.hostname,
        port: port,
        path: searchParams.get('path') || '/',
        sni: searchParams.get('sni') || searchParams.get('peer') || url.hostname,
        type: searchParams.get('type') || 'ws',
        security: searchParams.get('security') || 'tls',
        remarks: decodeURIComponent(url.hash.replace('#', '')) || 'Node'
      };
    }
  } catch (e) {
    console.error('Node Parse Error:', e);
  }
  return null;
};

export interface AdvancedOptions {
  proxyip?: string;
  ed0rtt?: boolean;
  fragment?: 'Shadowrocket' | 'Happ' | null;
  ech?: boolean;
  target?: string;
  quickKey?: string;
}

export const generateSubscriptionUrl = (
  workerUrl: string,
  config: NodeConfig | null,
  opts: AdvancedOptions
): string => {
  try {
    const baseUrl = workerUrl.startsWith('http') ? workerUrl : `https://${workerUrl}`;
    
    // 快速密钥模式：直接返回域名+路径 (cmliu 脚本内部 KEY 逻辑)
    if (opts.quickKey) {
      const qUrl = new URL(`${baseUrl.replace(/\/$/, '')}/${opts.quickKey}`);
      // 密钥模式下同样支持 target 参数
      if (opts.target && opts.target !== 'mixed') {
        qUrl.searchParams.set('target', opts.target);
      }
      return qUrl.toString();
    }

    if (!config) return '';

    const url = new URL(`${baseUrl}/sub`);

    // 1. 核心认证 (cmliu 脚本根据协议识别 uuid 或 password)
    if (config.protocol === ProtocolType.TROJAN) {
      url.searchParams.set('password', config.uuid);
    } else {
      url.searchParams.set('uuid', config.uuid);
    }

    // 2. 基础传输层参数 (显式传递，这是解决 -1 的关键)
    url.searchParams.set('host', config.host);
    url.searchParams.set('port', config.port.toString());
    url.searchParams.set('path', config.path || '/');
    url.searchParams.set('type', config.type || 'ws');
    url.searchParams.set('security', config.security || 'tls');
    url.searchParams.set('sni', config.sni || config.host);

    // 3. 特殊协议补全
    if (config.protocol === ProtocolType.VLESS) {
      url.searchParams.set('encryption', 'none');
    }

    // 4. cmliu 专用顶级扩展参数 (不嵌套在 path 里)
    if (opts.proxyip) {
      url.searchParams.set('proxyip', opts.proxyip);
    }
    if (opts.ed0rtt) {
      url.searchParams.set('ed', '2560');
    }

    // 5. 客户端/适配参数
    if (opts.fragment === 'Shadowrocket') {
      url.searchParams.set('fragment', '1,40-60,30-50,tlshello');
    } else if (opts.fragment === 'Happ') {
      url.searchParams.set('fragment', '3,1,tlshello');
    }

    if (opts.ech) {
      url.searchParams.set('ech', 'https://doh.cmliussss.net/CMLiussss');
    }

    if (opts.target && opts.target !== 'mixed') {
      url.searchParams.set('target', opts.target);
    }

    return url.toString();
  } catch (e) {
    console.error('Subscription Generation Error:', e);
    return '';
  }
};
