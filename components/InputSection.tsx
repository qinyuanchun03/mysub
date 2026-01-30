
import React from 'react';
import { Link2, Server, Settings2 } from 'lucide-react';

interface InputSectionProps {
  nodeLink: string;
  workerUrl: string;
  onNodeLinkChange: (val: string) => void;
  onWorkerUrlChange: (val: string) => void;
  options: { proxyip: boolean; scv: boolean };
  setOptions: React.Dispatch<React.SetStateAction<{ proxyip: boolean; scv: boolean }>>;
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
    <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Link2 size={18} className="text-blue-500" />
          节点链接
        </label>
        <textarea
          value={nodeLink}
          onChange={(e) => onNodeLinkChange(e.target.value)}
          placeholder="vless://de043003-8839-4467-bc32-132d752f012a@..."
          className="w-full h-32 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none mono"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Server size={18} className="text-indigo-500" />
          Worker 域名
        </label>
        <input
          type="text"
          value={workerUrl}
          onChange={(e) => onWorkerUrlChange(e.target.value)}
          placeholder="例如: sub.yourworker.workers.dev"
          className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all mono"
        />
        <p className="text-xs text-slate-400">您的 Cloudflare Worker 部署地址，不填默认为当前域名</p>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
          <Settings2 size={18} className="text-emerald-500" />
          生成选项
        </label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={options.proxyip}
              onChange={(e) => setOptions(prev => ({ ...prev, proxyip: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">使用优选 ProxyIP</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={options.scv}
              onChange={(e) => setOptions(prev => ({ ...prev, scv: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">允许不安全连接 (SCV)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
