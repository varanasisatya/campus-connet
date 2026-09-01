'use client';

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Copy, Maximize2, Minimize2, Plus, Send, Sparkles, User, X } from 'lucide-react';
import { askCampusAI, type CampusChatMessage } from '@/utils/ai-helpers';

type Message = CampusChatMessage & { id: number };
const suggestions = ['What is happening on campus today?', 'Find me a quiet study spot', 'Help me find my lost backpack'];

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', content: 'Hey! I’m CampusAI. I can help you plan your day, discover events, trace a lost item, or make sense of what’s happening around campus.\n\nWhat can I help with?' },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [assistantMode, setAssistantMode] = useState<'unknown' | 'model' | 'campus-demo'>('unknown');
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, isTyping]);
  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

  const sendMessage = async (content: string) => {
    const cleanMessage = content.trim();
    if (!cleanMessage || isTyping) return;
    const userMessage: Message = { id: Date.now(), role: 'user', content: cleanMessage };
    const conversation = messages.map(({ role, content: messageContent }) => ({ role, content: messageContent }));
    setMessages(previous => [...previous, userMessage]);
    setInput('');
    setIsTyping(true);
    try {
      const response = await askCampusAI(cleanMessage, conversation);
      setAssistantMode(response.mode);
      setMessages(previous => [...previous, { id: Date.now() + 1, role: 'assistant', content: response.content }]);
    } catch {
      setMessages(previous => [...previous, { id: Date.now() + 1, role: 'assistant', content: 'I hit a connection problem. Try that once more, or ask me about events, lost items, study spaces, food, or directions.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (event: FormEvent) => { event.preventDefault(); void sendMessage(input); };
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage(input); }
  };
  const startNewChat = () => {
    setMessages([{ id: Date.now(), role: 'assistant', content: 'Fresh chat, fresh start. What are we figuring out on campus?' }]);
    setInput('');
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open CampusAI assistant"
        className={`fixed bottom-24 right-4 z-[90] flex items-center gap-3 rounded-full border border-lime-300/30 bg-[#0d0b13] px-4 py-3 text-white shadow-[0_0_35px_rgba(190,242,100,.22)] transition md:bottom-6 md:right-6 ${isOpen ? 'pointer-events-none scale-90 opacity-0' : 'opacity-100'}`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-300 text-black"><Sparkles className="h-5 w-5" /></span>
        <span className="hidden pr-1 text-left sm:block"><strong className="block text-sm">Ask CampusAI</strong><span className="block text-[10px] text-white/45">Source-aware campus copilot</span></span>
      </motion.button>

      <AnimatePresence>
        {isOpen ? (
          <motion.section
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            aria-label="CampusAI chat"
            className={`fixed z-[100] flex overflow-hidden border border-white/15 bg-[#0b0a10] shadow-[0_30px_100px_rgba(0,0,0,.65)] ${isExpanded ? 'inset-3 rounded-[2rem] md:inset-y-6 md:left-auto md:right-6 md:w-[min(720px,calc(100vw-12rem))]' : 'bottom-24 right-3 h-[min(650px,calc(100vh-7rem))] w-[calc(100vw-1.5rem)] rounded-[2rem] sm:w-[440px] md:bottom-6 md:right-6 md:h-[min(650px,calc(100vh-3rem))]'}`}
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <header className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300 text-black"><Bot className="h-5 w-5" /><span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#0b0a10] bg-emerald-400" /></span>
                  <div><h2 className="text-sm font-black">CampusAI</h2><p className="text-[10px] font-medium text-white/40">{assistantMode === 'model' ? 'OpenAI model · campus grounded' : assistantMode === 'campus-demo' ? 'Guided campus demo · add API key for live AI' : 'Your source-aware campus copilot'}</p></div>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={startNewChat} aria-label="Start new chat" className="flex h-9 w-9 items-center justify-center rounded-xl text-white/45 transition hover:bg-white/10 hover:text-white"><Plus className="h-4 w-4" /></button>
                  <button type="button" onClick={() => setIsExpanded(value => !value)} aria-label={isExpanded ? 'Collapse chat' : 'Expand chat'} className="hidden h-9 w-9 items-center justify-center rounded-xl text-white/45 transition hover:bg-white/10 hover:text-white sm:flex">{isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}</button>
                  <button type="button" onClick={() => setIsOpen(false)} aria-label="Close CampusAI" className="flex h-9 w-9 items-center justify-center rounded-xl text-white/45 transition hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
                </div>
              </header>

              <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-5" aria-live="polite">
                {messages.map(message => (
                  <article key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${message.role === 'user' ? 'bg-white/10 text-white' : 'bg-lime-300 text-black'}`}>{message.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}</span>
                    <div className={`group max-w-[82%] ${message.role === 'user' ? 'text-right' : ''}`}>
                      <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">{message.role === 'user' ? 'You' : 'CampusAI'}</p>
                      <div className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-left text-sm leading-relaxed ${message.role === 'user' ? 'rounded-tr-sm bg-cyan-300 font-medium text-black' : 'rounded-tl-sm border border-white/10 bg-white/[0.055] text-white/80'}`}>{message.content}</div>
                      {message.role === 'assistant' ? <button type="button" onClick={() => void navigator.clipboard.writeText(message.content)} className="mt-2 flex items-center gap-1.5 text-[10px] text-white/25 opacity-0 transition hover:text-white group-hover:opacity-100"><Copy className="h-3 w-3" />Copy</button> : null}
                    </div>
                  </article>
                ))}
                {messages.length === 1 ? (
                  <div className="grid gap-2 pt-1">
                    {suggestions.map(suggestion => <button key={suggestion} type="button" onClick={() => void sendMessage(suggestion)} className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-left text-xs font-medium text-white/60 transition hover:border-lime-300/30 hover:bg-lime-300/5 hover:text-white">{suggestion}<span className="float-right text-lime-300">↗</span></button>)}
                  </div>
                ) : null}
                {isTyping ? (
                  <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-300 text-black"><Sparkles className="h-4 w-4" /></span><div className="flex gap-1 rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.055] px-4 py-3">{[0, 1, 2].map(dot => <motion.span key={dot} animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }} transition={{ repeat: Infinity, duration: 0.75, delay: dot * 0.12 }} className="h-1.5 w-1.5 rounded-full bg-lime-300" />)}</div></div>
                ) : null}
                <div ref={messageEndRef} />
              </div>

              <footer className="border-t border-white/10 bg-[#0d0b13] p-3 sm:p-4">
                <form onSubmit={handleSubmit} className="relative rounded-2xl border border-white/15 bg-white/[0.045] transition focus-within:border-lime-300/40 focus-within:bg-white/[0.065]">
                  <textarea ref={inputRef} value={input} onChange={event => setInput(event.target.value)} onKeyDown={handleKeyDown} rows={1} placeholder="Message CampusAI..." aria-label="Message CampusAI" className="max-h-28 min-h-14 w-full resize-none bg-transparent py-4 pl-4 pr-14 text-sm text-white outline-none placeholder:text-white/30" />
                  <button type="submit" disabled={!input.trim() || isTyping} aria-label="Send message" className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300 text-black transition hover:bg-white disabled:opacity-30"><Send className="h-4 w-4" /></button>
                </form>
                <p className="mt-2 text-center text-[9px] text-white/25">CampusAI can make mistakes. Verify important campus information.</p>
              </footer>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}
