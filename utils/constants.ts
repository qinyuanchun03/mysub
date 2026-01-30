
export const DEFAULT_TEST_UUID = '05f5b83d-1d6f-4bc9-3f17-7cb5d8ecbb4a';

export const SAMPLE_NODE_LINK = `vless://05f5b83d-1d6f-4bc9-3f17-7cb5d8ecbb9b@198.41.223.173:443?encryption=none&security=tls&sni=cm.takaosakuma.dpdns.org&insecure=1&allowInsecure=1&type=ws&host=cm.takaosakuma.dpdns.org&path=%2F#CF官方优选-测试`;

export const APP_CONFIG = {
  VERSION: '1.0.1',
  GITHUB_URL: 'https://github.com/cmliu/WorkerVless2sub',
  DEFAULT_WORKER_DOMAIN: typeof window !== 'undefined' ? window.location.host : '',
};
