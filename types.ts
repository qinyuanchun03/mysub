
export enum ProtocolType {
  VLESS = 'vless',
  VMESS = 'vmess',
  TROJAN = 'trojan'
}

export interface NodeConfig {
  protocol: ProtocolType;
  uuid: string;
  host: string;
  port: number | string;
  path: string;
  sni: string;
  type: string;
  alpn?: string;
  security?: string;
  alterId?: number;
  remarks?: string;
}

export interface SubscriptionParams {
  baseUrl: string;
  nodeLink: string;
  useProxyIP: boolean;
  allowInsecure: boolean;
  customFileName: string;
}
