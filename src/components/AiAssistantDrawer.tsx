'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Wand2, RefreshCw, Copy, Check } from 'lucide-react';

interface AiAssistantDrawerProps {
  currentContent: string;
  onApplySuggestion: (text: string) => void;
}

export function AiAssistantDrawer({ currentContent, onApplySuggestion }: AiAssistantDrawerProps) {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'expand' | 'polish' | 'brainstorm'>('expand');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt || currentContent.slice(-300),
          mode,
          context: currentContent.slice(-1000),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <Bot className="w-4 h-4 text-indigo-400" /> AI Creative Co-Pilot
        </h3>
        <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/60 px-2 py-0.5 rounded-full font-semibold">
          Pro Writing Suite
        </span>
      </div>

      <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setMode('expand')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
            mode === 'expand' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Continue Prose
        </button>
        <button
          onClick={() => setMode('polish')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
            mode === 'polish' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Polish & Enhance
        </button>
        <button
          onClick={() => setMode('brainstorm')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
            mode === 'brainstorm' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Plot Ideas
        </button>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">
          {mode === 'expand' ? 'Prompt or Scene Starter' : mode === 'polish' ? 'Text to Polish' : 'Plot Subject / Challenge'}
        </label>
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={mode === 'expand' ? 'e.g. Describe the entrance to the lower vault...' : 'Enter text or leave blank to use current editor selection...'}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow"
      >
        {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
        {loading ? 'Generating AI Suggestion...' : 'Generate AI Output'}
      </button>

      {result && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-400">
            <span>AI Suggestion Result</span>
            <div className="flex items-center gap-2">
              <button onClick={handleCopy} className="text-slate-400 hover:text-slate-200 flex items-center gap-1">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
            {result}
          </div>
          <button
            onClick={() => onApplySuggestion(result)}
            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition"
          >
            Insert into Chapter Content
          </button>
        </div>
      )}
    </div>
  );
}
