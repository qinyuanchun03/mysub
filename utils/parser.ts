
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
      
      // 处理 URL.port 为空的情况（URL 对象在默认端口时可能返回空字符串）
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
        sni: searchParams.get('sni') || url.hostname,
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
}

export const generateSubscriptionUrl = (
  workerUrl: string,
  config: NodeConfig,
  opts: AdvancedOptions
): string => {
  try {
    const baseUrl = workerUrl.startsWith('http') ? workerUrl : `https://${workerUrl}`;
    const url = new URL(`${baseUrl}/sub`);

    // 1. 基础鉴权参数
    if (config.protocol === ProtocolType.TROJAN) {
      url.searchParams.set('password', config.uuid);
    } else {
      url.searchParams.set('uuid', config.uuid);
    }

    // 2. 核心传输参数 (必须显式包含，否则后端 cmliu 脚本会返回 -1)
    url.searchParams.set('host', config.host);
    url.searchParams.set('port', config.port.toString());
    url.searchParams.set('security', config.security || 'tls');
    url.searchParams.set('sni', config.sni || config.host);
    url.searchParams.set('type', config.type || 'ws');

    // 3. 路径及增强参数拼接
    let finalPath = config.path || '/';
    const pathParams = new URLSearchParams();
    
    if (opts.proxyip) {
      pathParams.set('proxyip', opts.proxyip);
    }
    if (opts.ed0rtt) {
      pathParams.set('ed', '2560');
    }

    const extraParamsStr = pathParams.toString();
    if (extraParamsStr) {
      finalPath += (finalPath.includes('?') ? '&' : '?') + extraParamsStr;
    }
    
    url.searchParams.set('path', finalPath);

    // 4. 高级特性
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
