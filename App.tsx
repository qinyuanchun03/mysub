
import React, { useState, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { ResultSection } from './components/ResultSection';
import { NginxDecoy } from './components/NginxDecoy';
import { parseNodeLink, generateSubscriptionUrl, AdvancedOptions } from './utils/parser';
import { SAMPLE_NODE_LINK, APP_CONFIG } from './utils/constants';
import { Github, Globe, Layers, Zap, Info, EyeOff, FlaskConical, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';

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
    target: 'mixed',
    quickKey: ''
  });

  useEffect(() => {
    const currentHost = window.location.host;
    setWorkerUrl(currentHost);

    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    // 允许简写的 8-4-4-12 格式
    const fullUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (uuidRegex.test(path) || fullUuidRegex.test(path)) {
      setShowGenerator(true);
      // 核心修复：添加 encryption=none 和显式端口
      const defaultNode = `vless://${path}@${window.location.hostname}:443?encryption=none&security=tls&type=ws&host=${window.location.hostname}&path=%2F#Cloudflare-Pages-Node`;
      setNodeLink(defaultNode);
    } 
  }, []);

  const handleGenerate = () => {
    if (options.quickKey) {
      const generated = generateSubscriptionUrl(workerUrl, null, options);
      setSubUrl(generated);
      return;
    }

    if (!nodeLink.trim()) {
      alert('请粘贴节点链接');
      return;
    }

    const config = parseNodeLink(nodeLink);
    if (!config) {
      alert('解析失败：请检查链接格式。目前支持 VLESS/VMess/Trojan');
      return;
    }

    const generated = generateSubscriptionUrl(workerUrl, config, options);
    if (!generated) {
      alert('生成失败');
      return;
    }
    setSubUrl(generated);
  };

  const isReady = options.quickKey || (nodeLink.includes('://') && workerUrl);

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
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Worker Sub-Converter Tool</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => { setOptions(prev => ({...prev, quickKey: ''})); setNodeLink(SAMPLE_NODE_LINK); }}
             className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-xs shadow-sm"
           >
             <FlaskConical size={14} className="text-amber-500" /> 默认测试节点
           </button>
           <button 
             onClick={() => setShowGenerator(false)}
             className="bg-white text-slate-400 hover:text-slate-900 transition-all p-2.5 rounded-xl border border-slate-200 shadow-sm"
             title="锁定界面"
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
                <Sparkles size={10} /> 修复节点 -1 错误
               </div>
               <h2 className="text-3xl font-black leading-tight">参数对齐<br/>后端脚本接口</h2>
               <p className="text-slate-400 text-sm leading-relaxed font-medium">
                 生成的 URL 已包含显式 <span className="text-white">port</span>, <span className="text-white">host</span> 和 <span className="text-white">encryption</span> 参数，确保真连接测试通过。
               </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 blur-[80px] rounded-full"></div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">环境状态</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">后端接口响应</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={10} /> 正常
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">参数完整性</span>
                {isReady ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                    <Zap size={10} /> 已就绪
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                    <AlertCircle size={10} /> 等待输入
                  </span>
                )}
              </div>
            </div>
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
            className={`group relative w-full py-5 rounded-2xl font-black text-lg shadow-2xl transition-all overflow-hidden ${
              isReady 
              ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-400/20 active:scale-[0.98]' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {options.quickKey ? '使用 KEY 生成直连订阅' : '生成兼容性订阅链接'}
              <Zap size={20} className={isReady ? "group-hover:animate-pulse" : ""} />
            </span>
            {isReady && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>}
          </button>

          <ResultSection subUrl={subUrl} />
        </div>
      </main>
    </div>
  );
};

export default App;
