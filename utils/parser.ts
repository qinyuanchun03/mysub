
import { ProtocolType, NodeConfig } from '../types';

/**
 * 安全的 Base64 解码，处理填充和 URL 安全字符
 */
const safeAtob = (str: string): string => {
  try {
    // 处理 URL 安全的 Base64
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // 补齐填充符
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    return atob(base64);
  } catch (e) {
    console.error('Base64 解码失败:', e);
    return '';
  }
};

export const parseNodeLink = (link: string): NodeConfig | null => {
  try {
    const trimmedLink = link.trim();
    if (trimmedLink.startsWith('vmess://')) {
      const base64Content = trimmedLink.replace('vmess://', '');
      const decoded = safeAtob(base64Content);
      if (!decoded) return null;
      
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
        alterId: json.aid || 0,
        remarks: json.ps || 'New VMess'
      };
    }

    if (trimmedLink.startsWith('vless://') || trimmedLink.startsWith('trojan://')) {
      const protocol = trimmedLink.startsWith('vless://') ? ProtocolType.VLESS : ProtocolType.TROJAN;
      const url = new URL(trimmedLink);
      const uuid = url.username;
      const host = url.hostname;
      const port = url.port;
      const searchParams = new URLSearchParams(url.search);
      const remarks = decodeURIComponent(url.hash.replace('#', '')) || 'New Node';

      return {
        protocol,
        uuid,
        host,
        port,
        path: searchParams.get('path') || '/',
        sni: searchParams.get('sni') || host,
        type: searchParams.get('type') || 'ws',
        security: searchParams.get('security') || 'tls',
        remarks
      };
    }
  } catch (error) {
    console.error('解析节点失败:', error);
  }
  return null;
};

export const generateSubscriptionUrl = (
  workerUrl: string,
  config: NodeConfig,
  options: { proxyip?: boolean; scv?: boolean }
): string => {
  try {
    const base = workerUrl.endsWith('/') ? workerUrl.slice(0, -1) : workerUrl;
    // 确保 URL 格式正确
    const baseUrl = base.startsWith('http') ? base : `https://${base}`;
    const url = new URL(`${baseUrl}/sub`);
    
    if (config.protocol === ProtocolType.TROJAN) {
      url.searchParams.set('password', config.uuid);
    } else {
      url.searchParams.set('uuid', config.uuid);
    }

    url.searchParams.set('host', config.host);
    url.searchParams.set('path', config.path);
    url.searchParams.set('sni', config.sni);
    url.searchParams.set('type', config.type);
    
    if (config.protocol === ProtocolType.VMESS) {
      url.searchParams.set('alterid', String(config.alterId || 0));
      url.searchParams.set('security', config.security || 'auto');
    }

    if (options.proxyip) url.searchParams.set('proxyip', 'true');
    if (options.scv) url.searchParams.set('scv', 'true');

    return url.toString();
  } catch (e) {
    console.error('生成链接失败:', e);
    return '';
  }
};
