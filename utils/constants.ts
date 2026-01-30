
export const DEFAULT_TEST_UUID = '05f5b83d-1d6f-4bc9-3f17-7cb5d8ecbb4a';

export const SAMPLE_NODE_LINK = `vless://${DEFAULT_TEST_UUID}@1.1.1.1:443?encryption=none&security=tls&type=ws&host=cloudflare.com&path=%2F#测试节点-bb4a`;

export const APP_CONFIG = {
  VERSION: '1.0.0',
  GITHUB_URL: 'https://github.com/cmliu/WorkerVless2sub',
  DEFAULT_WORKER_DOMAIN: typeof window !== 'undefined' ? window.location.host : '',
};
