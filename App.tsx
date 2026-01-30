
import React, { useState, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { ResultSection } from './components/ResultSection';
import { NginxDecoy } from './components/NginxDecoy';
import { parseNodeLink, generateSubscriptionUrl, AdvancedOptions } from './utils/parser';
import { SAMPLE_NODE_LINK, APP_CONFIG } from './utils/constants';
import { Github, Globe, Layers, Zap, Info, EyeOff, FlaskConical, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [showGenerator, setShowGenerator] = useState(false);
  const [nodeLink, setNodeLink] = useState('');
  const [workerUrl, setWorkerUrl] = useState('');
  const [subUrl, setSubUrl] = useState('');
  const [options, setOptions] = useState<AdvancedOptions>({ 
    proxyip: '', 
    ed0rtt: false, 
    fragment: null, 
    ech: false,
    target: 'mixed'
  });

  useEffect(() => {
    const currentHost = window.location.host;
    setWorkerUrl(currentHost);

    // 检测路径是否为 UUID
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (uuidRegex.test(path)) {
      setShowGenerator(true);
      // 根据路径中的 UUID 生成默认节点链接
      const defaultNode = `vless://${path}@${window.location.hostname}:443?encryption=none&security=tls&type=ws&host=${window.location.hostname}&path=%2F#Auto-Generated`;
      setNodeLink(defaultNode);
    }
  }, []);

  const handleGenerate = () => {
    if (!nodeLink.trim()) {
      alert('请粘贴节点链接');
      return;
    }

    const config = parseNodeLink(nodeLink);
    if (!config) {
      alert('解析失败：暂不支持此链接格式');
      return;
    }

    const generated = generateSubscriptionUrl(workerUrl, config, options);
    if (!generated) {
      alert('生成失败');
      return;
    }
    setSubUrl(generated);
  };

  if (!showGenerator) {
    return <NginxDecoy onUnlock={() => setShowGenerator(true)} />;
  }

  return (
    <div className="min-h-screen pb-20 px-4 bg-slate-50/50 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto pt-10 pb-8 flex items-center justify-between border-b border-slate-200 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200 rotate-3">
            <Layers className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">SUBGEN <span className="text-blue-600 italic">PRO</span></h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">CMLIU Script Edition</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setNodeLink(SAMPLE_NODE_LINK)}
             className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-xs shadow-sm"
           >
             <FlaskConical size={14} className="text-amber-500" /> 加载测试 UUID
           </button>
           <button 
             onClick={() => setShowGenerator(false)}
             className="bg-white text-slate-400 hover:text-slate-900 transition-all p-2.5 rounded-xl border border-slate-200 shadow-sm"
             title="进入伪装"
           >
             <EyeOff size={18} />
           </button>
           <a href={APP_CONFIG.GITHUB_URL} target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg hover:scale-105 transition-all">
            <Github size={18} />
          </a>
        </div>
      </div>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] text-white shadow-2xl shadow-slate-300 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles size={10} /> 引擎已就绪
               </div>
               <h2 className="text-3xl font-black leading-tight">基于开源逻辑<br/>重新定义生成</h2>
               <p className="text-slate-400 text-sm leading-relaxed font-medium">
                 本系统深度整合了 <span className="text-white">cmliu</span> 脚本的全部核心参数，确保生成的订阅链接与您的 Worker 环境完美兼容。
               </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 blur-[80px] rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <Zap size={20} className="text-blue-500" />
              <h4 className="text-xs font-black text-slate-800 uppercase">极速解析</h4>
              <p className="text-[10px] text-slate-400 leading-normal">毫秒级处理节点链接与 UUID 校验。</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <Globe size={20} className="text-emerald-500" />
              <h4 className="text-xs font-black text-slate-800 uppercase">优选 IP</h4>
              <p className="text-[10px] text-slate-400 leading-normal">集成 Cloudflare 优选 IP 路径算法。</p>
            </div>
          </div>

          <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex gap-3">
            <Info className="text-indigo-500 shrink-0" size={18} />
            <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
              本工具为纯静态前端，数据仅在本地浏览器处理，不经过任何中转服务器，保障隐私安全。
            </p>
          </div>
        </div>

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
            className="group relative w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl shadow-slate-400/20 hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              生成 cmliu 专用订阅
              <Zap size={20} className="group-hover:animate-pulse" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>

          <ResultSection subUrl={subUrl} />
        </div>
      </main>

      <footer className="max-w-5xl mx-auto mt-20 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        <p>© 2024 CLOUDNODE SUBGEN PRO. POWERED BY REACT 19.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-blue-600 transition-colors">隐私政策</a>
          <a href="#" className="hover:text-blue-600 transition-colors">使用文档</a>
          <a href="#" className="hover:text-blue-600 transition-colors">联系作者</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
