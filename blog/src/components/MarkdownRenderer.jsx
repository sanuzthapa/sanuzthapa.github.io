import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

function CodeBlock({ inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeText = String(children).replace(/\n$/, '');

  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-300 font-mono text-xs border border-slate-700/60" {...props}>
        {children}
      </code>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-5 rounded-lg overflow-hidden border border-slate-800 bg-[#0d1322]">
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#111827] border-b border-slate-800 text-xs font-mono text-slate-400">
        <span className="text-cyan-400/90">{match ? match[1] : 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs md:text-sm font-mono text-slate-200 leading-relaxed bg-[#080c14]">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

