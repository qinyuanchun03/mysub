
import React, { useState } from 'react';
import { Copy, Check, QrCode, ExternalLink, ShieldAlert } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ResultSectionProps {
  subUrl: string;
}

export const ResultSection: React.FC<ResultSectionProps> = ({ subUrl }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = () => {
    if (!subUrl) return;
    navigator.clipboard.writeText(subUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!subUrl) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">生成的订阅链接</h3>
          <div className="flex gap-2">
             <button
              onClick={() => setShowQR(!showQR)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
              title="显示二维码"
            >
              <QrCode size={20} />
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? '已复制' : '复制链接'}
            </button>
          </div>
        </div>

        <div className="relative group">
          <div className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm break-all mono text-slate-600 select-all pr-10">
            {subUrl}
          </div>
        </div>

        {showQR && (
          <div className="mt-6 flex flex-col items-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <QRCodeSVG value={subUrl} size={200} level="H" includeMargin className="bg-white p-2 rounded-lg" />
            <p className="mt-4 text-xs text-slate-400">扫码导入您的客户端</p>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4">
        <div className="shrink-0">
          <ShieldAlert className="text-amber-500" size={24} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-900">安全提示</h4>
          <p className="text-xs text-amber-800/80 leading-relaxed">
            生成订阅时，您的节点信息将包含在生成的 URL 中。如果您使用第三方托管的 SubConverter，
            后端可能会获取您的节点配置。请确保您信任订阅转换服务或使用自建服务。
          </p>
          <div className="pt-2 flex gap-4">
            <a href="https://github.com/cmliu/WorkerVless2sub" target="_blank" className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1">
              查看源码 <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
