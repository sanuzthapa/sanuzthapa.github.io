import React, { useState } from 'react';
import { Terminal, Copy, Check, FileText, CheckCircle2 } from 'lucide-react';

export default function RunLocallyWidget({ runInstructions = {}, envTemplate = '', verifyCommand = '' }) {
  const runtimes = Object.keys(runInstructions || {});
  const [activeRuntime, setActiveRuntime] = useState(runtimes[0] || 'uv');
  const [copiedKey, setCopiedKey] = useState(null);

  // Fallback if activeRuntime is not present in runInstructions
  const currentRuntime = runInstructions[activeRuntime] ? activeRuntime : runtimes[0];
  const activeCode = currentRuntime ? runInstructions[currentRuntime] : '';

  const handleCopy = (key, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text.trim());
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <div className="my-8 rounded-xl border border-slate-800 bg-[#0d1322] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 bg-[#111827] px-4 py-3 gap-2">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>How to Run Locally</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
        </div>
      </div>

      {/* Runtime Tabs */}
      {runtimes.length > 0 && (
        <div className="flex border-b border-slate-800 bg-[#0b0f19]/70 px-4 pt-2 gap-2 overflow-x-auto">
          {runtimes.map((runtime) => {
            const isActive = runtime === currentRuntime;
            return (
              <button
                key={runtime}
                onClick={() => setActiveRuntime(runtime)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-t-lg transition-all border-t border-x ${
                  isActive
                    ? 'bg-[#0d1322] text-cyan-300 border-slate-700 -mb-[1px]'
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span className="uppercase tracking-wider">{runtime}</span>
                {runtime === 'uv' && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-sans">
                    fastest
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Execution Commands */}
      {activeCode && (
        <div className="relative group p-4 bg-[#0d1322]">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>Terminal Instructions ({currentRuntime?.toUpperCase()})</span>
            <button
              onClick={() => handleCopy(`cmd-${currentRuntime}`, activeCode)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Copy commands"
            >
              {copiedKey === `cmd-${currentRuntime}` ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Commands</span>
                </>
              )}
            </button>
          </div>
          <pre className="font-mono text-xs md:text-sm text-slate-200 overflow-x-auto leading-relaxed bg-[#080c14] p-3 rounded-lg border border-slate-800/80">
            <code>{activeCode.trim()}</code>
          </pre>
        </div>
      )}

      {/* Environment Template Section */}
      {envTemplate && (
        <div className="border-t border-slate-800/80 p-4 bg-[#090d16]">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <div className="flex items-center space-x-1.5 text-amber-300/90">
              <FileText className="w-3.5 h-3.5" />
              <span className="font-semibold">Environment Variables (.env)</span>
            </div>
            <button
              onClick={() => handleCopy('env', envTemplate)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Copy .env template"
            >
              {copiedKey === 'env' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy .env</span>
                </>
              )}
            </button>
          </div>
          <pre className="font-mono text-xs text-amber-200/90 overflow-x-auto leading-relaxed bg-[#06080e] p-3 rounded-lg border border-amber-500/10">
            <code>{envTemplate.trim()}</code>
          </pre>
        </div>
      )}

      {/* Verification Command Section */}
      {verifyCommand && (
        <div className="border-t border-slate-800/80 p-4 bg-[#0b0f19]">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-semibold">Verify Health / Status</span>
            </div>
            <button
              onClick={() => handleCopy('verify', verifyCommand)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Copy verification command"
            >
              {copiedKey === 'verify' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Command</span>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center space-x-2 bg-[#080c14] px-3 py-2.5 rounded-lg border border-slate-800 font-mono text-xs md:text-sm text-emerald-300 overflow-x-auto">
            <span className="text-slate-500 select-none">$</span>
            <code className="text-emerald-300 select-all">{verifyCommand.trim()}</code>
          </div>
        </div>
      )}
    </div>
  );
}

