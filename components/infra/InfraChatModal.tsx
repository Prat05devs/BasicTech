import React, { useEffect, useRef, useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';

type Role = 'user' | 'assistant';
interface Msg {
  role: Role;
  content: string;
  model?: string;
}

const MODELS = [
  { id: 'gpt-4o', label: 'GPT-4o (OpenAI)' },
  { id: 'claude-3.7-sonnet', label: 'Claude 3.7 Sonnet (Anthropic)' },
  { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Google)' },
  { id: 'grok-2', label: 'Grok 2 (xAI)' },
  { id: 'llama-3.1-70b-local', label: 'Llama 3.1 70B (local)' },
];

const REPLIES = [
  "This is a preview of the UNIUN Inference gateway. Real routing is being wired up — for now, responses are simulated locally so you can see the shape of the API.",
  "In production, this prompt would be routed to your selected provider via the OpenAI-compatible endpoint, with unified auth, streaming, billing, and usage tracking handled by the gateway.",
  "UNIUN abstracts the provider — swap between GPT, Claude, Gemini, Grok, or a self-hosted model without changing a line of client code.",
  "Every request is logged and priced through a single billing pipeline. You get one dashboard for cost, tokens, and latency across every model you use.",
  "The same endpoint will transparently serve cloud providers and our local GPU cluster as we bring hybrid inference online in Phase 3.",
];

export interface InfraChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfraChatModal: React.FC<InfraChatModalProps> = ({ isOpen, onClose }) => {
  const [model, setModel] = useState<string>(MODELS[0].id);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !streaming) onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // Focus the input a tick after mount for accessibility.
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      clearTimeout(t);
    };
  }, [isOpen, onClose, streaming]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const send = () => {
    const text = input.trim();
    if (!text || streaming) return;
    const userMsg: Msg = { role: 'user', content: text };
    const reply = REPLIES[Math.floor(messages.length / 2) % REPLIES.length];
    setMessages((prev) => [...prev, userMsg, { role: 'assistant', content: '', model }]);
    setInput('');
    setStreaming(true);

    const step = Math.max(1, Math.floor(reply.length / 90));
    let i = 0;
    const tick = () => {
      i = Math.min(reply.length, i + step);
      setMessages((prev) => {
        const next = prev.slice();
        next[next.length - 1] = { role: 'assistant', content: reply.slice(0, i), model };
        return next;
      });
      if (i < reply.length) {
        setTimeout(tick, 25);
      } else {
        setStreaming(false);
      }
    };
    setTimeout(tick, 220);
  };

  const modelLabel = MODELS.find((m) => m.id === model)?.label ?? model;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="UNIUN Inference preview chat"
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => { if (!streaming) onClose(); }}
        aria-hidden="true"
      />
      <div className="relative w-full sm:max-w-2xl bg-white sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[92vh] sm:h-[620px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 tracking-tight truncate">UNIUN Inference — Preview</div>
              <div className="text-xs text-slate-500 truncate">Mocked responses. Real routing lands with early access.</div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <label htmlFor="uniun-model" className="sr-only">Model</label>
            <select
              id="uniun-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={streaming}
              className="text-xs border border-slate-200 rounded-full px-3 py-1.5 bg-white text-slate-700 max-w-[10rem] truncate focus:outline-none focus:border-brand-blue disabled:opacity-60"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <button
              type="button"
              aria-label="Close chat"
              onClick={onClose}
              disabled={streaming}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-40"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-slate-50">
          {messages.length === 0 && (
            <div className="text-center text-sm text-slate-500 mt-16 max-w-sm mx-auto font-light">
              Ask anything. We'll stream back a mocked reply so you can see the shape of the gateway — one endpoint, any provider.
              <div className="mt-3 text-xs text-slate-400">Currently routed to <span className="font-medium text-slate-600">{modelLabel}</span>.</div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex flex-col items-start'}>
              {m.role === 'assistant' && m.model && (
                <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 ml-1">
                  {MODELS.find((mm) => mm.id === m.model)?.label ?? m.model}
                </div>
              )}
              <div
                className={
                  m.role === 'user'
                    ? 'max-w-[85%] bg-slate-900 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md leading-relaxed'
                    : 'max-w-[85%] bg-white border border-slate-200 text-slate-800 text-sm px-4 py-2.5 rounded-2xl rounded-bl-md leading-relaxed shadow-sm'
                }
              >
                {m.content || <span className="text-slate-400">…</span>}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex items-center gap-2 border-t border-slate-200 p-3 bg-white"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the UNIUN gateway…"
            aria-label="Message"
            className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-full focus:outline-none focus:border-brand-blue"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            aria-label="Send message"
            className="bg-slate-900 text-white p-2.5 rounded-full disabled:opacity-40 hover:bg-slate-800 transition-colors flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default InfraChatModal;
