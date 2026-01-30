
import React from 'react';
import { Link2, Server, Settings2, Cpu, ShieldCheck, Zap, Key } from 'lucide-react';
import { AdvancedOptions } from '../utils/parser';

interface InputSectionProps {
  nodeLink: string;
  workerUrl: string;
  onNodeLinkChange: (val: string) => void;
  onWorkerUrlChange: (val: string) => void;
  options: AdvancedOptions;
  setOptions: React.Dispatch<React.SetStateAction<AdvancedOptions>>;
}

export const InputSection: React.FC<InputSectionProps> = ({
  nodeLink,
  workerUrl,
  onNodeLinkChange,
  onWorkerUrlChange,
  options,
  setOptions
}) => {
  return (
    <div className="space-y-6">
      {/* 核心配置 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <Server size={16} className="text-indigo-500" /> Worker 绑定域名
          </label>
          <input
            type="text"
            value={workerUrl}
            onChange={(e) => onWorkerUrlChange(e.target.value)}
            placeholder="例如: sub.yourdomain.com"
            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all mono"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Link2 size={16} className="text-blue-500" /> 节点链接 (自定义)
            </label>
            <textarea
              value={nodeLink}
              disabled={!!options.quickKey}
              onChange={(e) => onNodeLinkChange(e.target.value)}
              placeholder={options.quickKey ? "已启用密钥模式" : "粘贴您的节点链接..."}
              className={`w-full h-24 p-3 text-sm border rounded-xl transition-all mono ${
                options.quickKey 
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Key size={16} className="text-amber-500" /> 快速密钥 (环境变量 KEY)
            </label>
            <div className="relative h-24">
              <input
                type="text"
                value={options.quickKey || ''}
                onChange={(e) => setOptions(prev => ({ ...prev, quickKey: e.target.value }))}
                placeholder="例如: CMLiussss"
                className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all mono"
              />
              <p className="mt-2 text-[10px] text-slate-400 leading-tight">
                填写此项将忽略上方节点，生成类似 <span className="text-amber-600">/密钥</span> 的直连订阅。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 高级选项面板 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
          <Settings2 size={18} className="text-emerald-500" />
          <h3 className="font-bold text-slate-800">脚本特性增强</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">订阅目标平台</label>
            <select 
              value={options.target || 'mixed'}
              onChange={(e) => setOptions(prev => ({ ...prev, target: e.target.value }))}
              className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            >
              <option value="mixed">Mixed (通用全协议)</option>
              <option value="clash">Clash / Mihomo</option>
              <option value="singbox">Sing-box</option>
              <option value="surge">Surge</option>
              <option value="quanx">Quantumult X</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">优选反代 IP (可选)</label>
            <input 
              type="text"
              placeholder="例如: icook.tw"
              value={options.proxyip || ''}
              onChange={(e) => setOptions(prev => ({ ...prev, proxyip: e.target.value }))}
              className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={options.ed0rtt}
              onChange={(e) => setOptions(prev => ({ ...prev, ed0rtt: e.target.checked }))}
              className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                <Zap size={14} className="text-amber-500" /> 启用 0-RTT
              </span>
              <span className="text-[10px] text-slate-400">ed=2560</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={options.ech}
              onChange={(e) => setOptions(prev => ({ ...prev, ech: e.target.checked }))}
              className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-500" /> 启用 ECH
              </span>
              <span className="text-[10px] text-slate-400">加密客户端问候</span>
            </div>
          </label>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-50">
           <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Cpu size={14} /> TLS 分片 (Fragment)
           </label>
           <div className="flex gap-3">
             {['None', 'Shadowrocket', 'Happ'].map((f) => (
               <button
                 key={f}
                 onClick={() => setOptions(prev => ({ ...prev, fragment: f === 'None' ? null : f as any }))}
                 className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
                   (options.fragment || 'None') === f 
                   ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' 
                   : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                 }`}
               >
                 {f}
               </button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};
