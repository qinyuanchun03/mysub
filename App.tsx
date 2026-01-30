
import React, { useState, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { ResultSection } from './components/ResultSection';
import { NginxDecoy } from './components/NginxDecoy';
import { parseNodeLink, generateSubscriptionUrl } from './utils/parser';
import { Github, Globe, Layers, Zap, Info, EyeOff, FlaskConical } from 'lucide-react';

const App: React.FC = () => {
  const [showGenerator, setShowGenerator] = useState(false);
  const [nodeLink, setNodeLink] = useState('');
  const [workerUrl, setWorkerUrl] = useState('');
  const [subUrl, setSubUrl] = useState('');
  const [options, setOptions] = useState({ proxyip: false, scv: false });

  const TEST_UUID = 'de043003-8839-4467-bc32-132d752f012a';
  const SAMPLE_LINK = `vless://${TEST_UUID}@1.1.1.1:443?encryption=none&security=tls&type=ws&host=cloudflare.com&path=%2F#测试节点-012a`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWorkerUrl(window.location.host);
    }
  }, []);

  const handleGenerate = () => {
    if (!nodeLink.trim()) {
      alert('请输入节点链接');
      return;
    }

    const config = parseNodeLink(nodeLink);
    if (!config) {
      alert('解析失败：请检查节点链接格式');
      return;
    }

    const generated = generateSubscriptionUrl(workerUrl, config, options);
    if (!generated) {
      alert('生成失败');
      return;
    }
    setSubUrl(generated);
  };

  const loadSample = () => {
    setNodeLink(SAMPLE_LINK);
  };

  // 如果不显示生成器，则显示 Nginx 伪装页
  if (!showGenerator) {
    return <NginxDecoy onUnlock={() => setShowGenerator(true)} />;
  }

  return (
    <div className="min-h-screen pb-20 px-4 animate-in fade-in duration-700">
      {/* 导航栏 */}
      <div className="max-w-4xl mx-auto pt-12 pb-8 flex items-center justify-between border-b border-slate-200 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Layers className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">CloudNode SubGen</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">高级订阅生成工具</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={loadSample}
             className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors font-medium text-xs"
             title="加载测试数据"
           >
             <FlaskConical size={14} />
             加载测试 UUID
           </button>
           <button 
             onClick={() => setShowGenerator(false)}
             className="text-slate-400 hover:text-slate-600 transition-colors p-2"
             title="进入伪装模式"
           >
             <EyeOff size={20} />
           </button>
           <a href="https://github.com/cmliu/WorkerVless2sub" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
            <Github size={20} />
          </a>
        </div>
      </div>

      <main className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 左侧说明 */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 leading-tight">
              订阅管理<br />
              <span className="text-blue-600">高效且安全</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              将您的私有节点快速转换为标准订阅格式。支持优选 IP、自动配置 SNI 和路径，适配各主流客户端。
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Zap size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">全平台适配</h4>
                <p className="text-xs text-slate-400">适配 Clash, Shadowrocket, V2RayN 等</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Globe size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">内置优选</h4>
                <p className="text-xs text-slate-400">可选集成 Cloudflare 优选反代 IP</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3 items-start">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-blue-700 leading-normal">
              本工具纯前端运行，解析逻辑基于开源项目，我们不会记录您的任何节点信息。
            </p>
          </div>
        </div>

        {/* 右侧操作区 */}
        <div className="lg:col-span-8 space-y-8">
          <InputSection 
            nodeLink={nodeLink}
            workerUrl={workerUrl}
            onNodeLinkChange={setNodeLink}
            onWorkerUrlChange={setWorkerUrl}
            options={options}
            setOptions={setOptions}
          />

          <button
            onClick={handleGenerate}
            disabled={!nodeLink}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/10 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            立即生成订阅链接
          </button>

          <ResultSection subUrl={subUrl} />
        </div>
      </main>

      <footer className="max-w-4xl mx-auto mt-24 text-center text-slate-400 text-xs">
        <p>© 2024 CloudNode SubGen Pro. 使用 React 19 & Tailwind CSS 构建.</p>
        <p className="mt-2 text-slate-300">特别感谢开源社区对网络自由的贡献</p>
      </footer>
    </div>
  );
};

export default App;
