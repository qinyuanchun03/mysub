
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
        address: json.add || '',
        host: json.host || json.add || '',
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

      // The 'path' in the link might contain proxyip=...
      // We extract the base path and later pass proxyip separately if found
      let rawPath = searchParams.get('path') || '/';
      
      return {
        protocol,
        uuid: url.username,
        address: url.hostname,
        host: searchParams.get('host') || url.hostname,
        port: port,
        path: rawPath,
        sni: searchParams.get('sni') || searchParams.get('peer') || searchParams.get('host') || url.hostname,
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
    
    // Quick Key mode: The path-based approach is best for cmliu's script to bypass Nginx
    if (opts.quickKey) {
      const qUrl = new URL(`${baseUrl.replace(/\/$/, '')}/${opts.quickKey}`);
      if (opts.target && opts.target !== 'mixed') {
        qUrl.searchParams.set('target', opts.target);
      }
      return qUrl.toString();
    }

    if (!config) return '';

    // If no Quick Key, we use /sub but we MUST provide the token if the script expects it
    // Most users use their KEY as the token
    const url = new URL(`${baseUrl}/sub`);

    // 1. Authentication
    if (config.protocol === ProtocolType.TROJAN) {
      url.searchParams.set('password', config.uuid);
    } else {
      url.searchParams.set('uuid', config.uuid);
    }

    // 2. Core Transmission
    url.searchParams.set('address', config.address);
    url.searchParams.set('host', config.host);
    url.searchParams.set('port', config.port.toString());
    url.searchParams.set('path', config.path);
    url.searchParams.set('type', config.type || 'ws');
    url.searchParams.set('security', config.security || 'tls');
    url.searchParams.set('sni', config.sni || config.host);

    if (config.protocol === ProtocolType.VLESS) {
      url.searchParams.set('encryption', 'none');
    }

    // 3. Advanced Parameters (cmliu script expects these at top level)
    if (opts.proxyip) {
      url.searchParams.set('proxyip', opts.proxyip);
    } else if (config.path.includes('proxyip=')) {
        // Extract proxyip from path if user didn't specify one but it's in the node link
        const match = config.path.match(/proxyip=([^&]+)/);
        if (match) url.searchParams.set('proxyip', match[1]);
    }

    if (opts.ed0rtt) {
      url.searchParams.set('ed', '2560');
    }

    // 4. Client target
    if (opts.target && opts.target !== 'mixed') {
      url.searchParams.set('target', opts.target);
    }

    return url.toString();
  } catch (e) {
    console.error('Subscription Generation Error:', e);
    return '';
  }
};
