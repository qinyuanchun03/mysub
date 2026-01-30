
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
        host: json.host || json.add || '',
        port: json.port,
        path: json.path || '/',
        sni: json.sni || json.host || json.add || '',
        type: json.net || 'ws',
        security: json.scy || 'auto',
        remarks: json.ps || 'VMess Node'
      };
    }

    if (trimmedLink.startsWith('vless://') || trimmedLink.startsWith('trojan://')) {
      const protocol = trimmedLink.startsWith('vless://') ? ProtocolType.VLESS : ProtocolType.TROJAN;
      const url = new URL(trimmedLink);
      const searchParams = new URLSearchParams(url.search);
      return {
        protocol,
        uuid: url.username,
        host: url.hostname,
        port: url.port,
        path: searchParams.get('path') || '/',
        sni: searchParams.get('sni') || url.hostname,
        type: searchParams.get('type') || 'ws',
        security: searchParams.get('security') || 'tls',
        remarks: decodeURIComponent(url.hash.replace('#', '')) || 'Node'
      };
    }
  } catch (e) {
    console.error('Parse Error', e);
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

    // 基础鉴权参数
    if (config.protocol === ProtocolType.TROJAN) {
      url.searchParams.set('password', config.uuid);
    } else {
      url.searchParams.set('uuid', config.uuid);
    }

    // 路径拼接逻辑 (参考脚本: 路径 + 反代参数 + 0-RTT)
    let finalPath = config.path;
    if (opts.proxyip) {
      const sep = finalPath.endsWith('/') ? '' : '/';
      finalPath += `${sep}proxyip=${opts.proxyip}`;
    }
    if (opts.ed0rtt) {
      const sep = finalPath.includes('?') ? '&' : '?';
      finalPath += `${sep}ed=2560`;
    }
    
    url.searchParams.set('host', config.host);
    url.searchParams.set('path', finalPath);
    url.searchParams.set('sni', config.sni || config.host);
    url.searchParams.set('type', config.type);

    // 高级特性
    if (opts.fragment === 'Shadowrocket') {
      url.searchParams.set('fragment', '1,40-60,30-50,tlshello');
    } else if (opts.fragment === 'Happ') {
      url.searchParams.set('fragment', '3,1,tlshello');
    }

    if (opts.ech) {
      // 脚本默认 ECH DNS
      url.searchParams.set('ech', 'https://doh.cmliussss.net/CMLiussss');
    }

    if (opts.target && opts.target !== 'mixed') {
      url.searchParams.set('target', opts.target);
    }

    return url.toString();
  } catch (e) {
    return '';
  }
};
