
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
  quickKey?: string;
}

export const generateSubscriptionUrl = (
  workerUrl: string,
  config: NodeConfig | null,
  opts: AdvancedOptions
): string => {
  try {
    const baseUrl = workerUrl.startsWith('http') ? workerUrl : `https://${workerUrl}`;
    
    // 如果提供了 Quick Key，则生成直连路径
    if (opts.quickKey) {
      return `${baseUrl.replace(/\/$/, '')}/${opts.quickKey}`;
    }

    if (!config) return '';

    const url = new URL(`${baseUrl}/sub`);

    // 1. 基础鉴权参数 (显式传递，防止 -1)
    if (config.protocol === ProtocolType.TROJAN) {
      url.searchParams.set('password', config.uuid);
    } else {
      url.searchParams.set('uuid', config.uuid);
    }

    // 2. 核心传输参数 (cmliu 脚本生成的订阅若包含 -1，通常是因为这些参数缺失)
    url.searchParams.set('host', config.host);
    url.searchParams.set('port', config.port.toString());
    url.searchParams.set('security', config.security || 'tls');
    url.searchParams.set('sni', config.sni || config.host);
    url.searchParams.set('type', config.type || 'ws');

    // 3. 路径增强逻辑
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

    // 4. 客户端适配参数
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
