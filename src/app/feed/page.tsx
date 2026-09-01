'use client';

import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, EyeOff, Heart, ImagePlus, LockKeyhole, MessageCircle, Send, Share2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { useCampusStore } from '@/store/campusStore';

const confessions = [
  { number: 'NO. 847', text: 'To the person who leaves tiny poems inside library books—you made exam week feel a little less lonely.', mood: 'soft hours', reactions: 284, color: 'bg-fuchsia-300' },
  { number: 'NO. 846', text: 'I joined the robotics club for the résumé. I stayed because they became the first people here who felt like home.', mood: 'plot twist', reactions: 419, color: 'bg-lime-300' },
  { number: 'NO. 845', text: 'The campus cat has attended more of my 8 AM lectures than half the class. Give him the degree.', mood: 'no lies detected', reactions: 672, color: 'bg-cyan-300' },
];

const posts = [
  { author: 'Sarah Jenkins', role: 'Student Council', avatar: 'SJ', time: '2h ago', content: 'The new AI Innovation Lab opens next week. The first night is student-only: music, demos, food, and absolutely no boring speeches.', summary: 'New lab opening · student preview · next week', likes: 124, comments: 18, image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=85', accent: 'lime' },
  { author: 'Maya & the Film Society', role: 'Campus Creators', avatar: 'MF', time: '4h ago', content: 'We turned the east wall into an open-air cinema last night. Campus, you understood the assignment.', summary: 'Film Society recap · 600 students showed up', likes: 608, comments: 73, image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=85', accent: 'pink' },
  { author: 'Prof. Alan Turing', role: 'Computer Science', avatar: 'AT', time: '5h ago', content: 'CS301 project deadline extended by 48 hours. Use the time well—and yes, sleep counts as using it well.', summary: 'CS301 · deadline moved by 48 hours', likes: 342, comments: 45, image: null, accent: 'cyan' },
];

const accents = {
  lime: { text: 'text-lime-300', bg: 'bg-lime-300', border: 'hover:border-lime-300/30' },
  pink: { text: 'text-fuchsia-300', bg: 'bg-fuchsia-300', border: 'hover:border-fuchsia-300/30' },
  cyan: { text: 'text-cyan-300', bg: 'bg-cyan-300', border: 'hover:border-cyan-300/30' },
};

export default function FeedPage() {
  const [composerMode, setComposerMode] = useState<'post' | 'confess'>('post');
  const [draft, setDraft] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const campusConfessions = useCampusStore(state => state.confessions);
  const campusPosts = useCampusStore(state => state.posts);
  const createPost = useCampusStore(state => state.createPost);

  const publish = async () => {
    if (draft.trim().length < 8) { toast.error('Write at least a few words first.'); return; }
    try {
      await createPost(draft.trim(), composerMode === 'confess', composerMode === 'post' ? media || undefined : undefined);
      toast.success(composerMode === 'confess' ? 'Confession sent to the anonymous safety review.' : 'Your update is live.');
      setDraft('');
      setMedia(null);
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Post could not be synced.'); }
  };

  return (
    <DashboardLayout>
      <section className="relative min-h-[560px] overflow-hidden rounded-[2.5rem] border border-white/10">
        <Image src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=2000&q=90" alt="Students connecting at a lively campus gathering" fill priority sizes="(max-width: 768px) 100vw, 85vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08070d] via-[#08070d]/85 to-[#08070d]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08070d] via-transparent to-black/20" />

        <div className="relative z-10 flex min-h-[560px] flex-col justify-between p-7 sm:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.28em] text-cyan-300"><TrendingUp className="h-4 w-4" /> Campus frequency · live</div>
            <div className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs font-bold backdrop-blur-xl"><span className="mr-2 text-lime-300">●</span>2,418 students here now</div>
          </div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-4 font-serif text-2xl italic text-white/65">News travels fast. Feelings travel faster.</p>
            <h1 className="max-w-5xl text-5xl font-black leading-[0.86] tracking-[-0.075em] sm:text-7xl lg:text-[6.5rem]">CAMPUS SAID<br /><span className="text-cyan-300">WHAT?</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">The announcements, inside jokes, honest questions and anonymous truths making campus feel like campus.</p>
          </motion.div>
          <div className="flex flex-wrap gap-3">
            <a href="#compose" className="flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-cyan-300">Join the conversation <ArrowDown className="h-4 w-4" /></a>
            <a href="#confessions" className="flex items-center gap-3 rounded-full border border-white/15 bg-black/30 px-5 py-3 text-sm font-black backdrop-blur-xl transition hover:bg-fuchsia-300 hover:text-black"><EyeOff className="h-4 w-4" />Read confessions</a>
          </div>
        </div>

        <div className="absolute bottom-10 right-10 hidden w-72 rotate-2 rounded-[2rem] bg-fuchsia-300 p-6 text-black shadow-2xl xl:block">
          <p className="text-[10px] font-black uppercase tracking-[0.22em]">Confession of the hour</p>
          <p className="mt-4 font-serif text-xl italic leading-snug">“I chose this university for the course. I think I&apos;m staying for the people.”</p>
          <div className="mt-5 flex items-center justify-between text-xs font-bold"><span>Anonymous · 12m</span><span>♥ 183</span></div>
        </div>
      </section>

      <section id="compose" className="py-16 sm:py-24">
        <div className="grid overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.035] lg:grid-cols-[.75fr_1.25fr]">
          <div className="flex flex-col justify-between border-b border-white/10 bg-lime-300 p-8 text-black lg:border-b-0 lg:border-r lg:p-10">
            <div><Sparkles className="h-7 w-7" /><p className="mt-7 text-xs font-black uppercase tracking-[0.25em]">Your turn</p><h2 className="mt-3 text-4xl font-black leading-[0.9] tracking-[-0.06em] sm:text-5xl">ADD SOMETHING TO THE STORY.</h2></div>
            <p className="mt-8 text-sm font-medium text-black/60">CampusAI labels topics and checks for harmful content—your voice stays yours.</p>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mb-7 flex w-fit rounded-full border border-white/10 bg-black/20 p-1">
              <button type="button" onClick={() => setComposerMode('post')} className={`rounded-full px-5 py-2.5 text-xs font-black transition ${composerMode === 'post' ? 'bg-white text-black' : 'text-white/45 hover:text-white'}`}>Post with my name</button>
              <button type="button" onClick={() => setComposerMode('confess')} className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black transition ${composerMode === 'confess' ? 'bg-fuchsia-300 text-black' : 'text-white/45 hover:text-white'}`}><EyeOff className="h-3.5 w-3.5" />Confess anonymously</button>
            </div>
            <textarea value={draft} onChange={event => setDraft(event.target.value)} aria-label={composerMode === 'post' ? 'Create a campus post' : 'Write an anonymous confession'} placeholder={composerMode === 'post' ? 'What should campus know?' : 'Say it here. Your identity will not appear...'} className="min-h-40 w-full resize-none bg-transparent text-2xl font-bold tracking-[-0.025em] text-white outline-none placeholder:text-white/20 sm:text-3xl" />
            <div className="mt-5 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4 text-xs text-white/40">
                {composerMode === 'post' ? <><label className="flex cursor-pointer items-center gap-2 hover:text-white"><ImagePlus className="h-4 w-4" />{media ? media.name : 'Add media'}<input type="file" accept="image/*" className="sr-only" onChange={event => setMedia(event.target.files?.[0] || null)} /></label><span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-lime-300" />AI topic detection</span></> : <><span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-fuchsia-300" />Name hidden</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-lime-300" />Safety review</span></>}
              </div>
              <button type="button" onClick={publish} className={`flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black text-black transition hover:bg-white ${composerMode === 'post' ? 'bg-lime-300' : 'bg-fuchsia-300'}`}>{composerMode === 'post' ? 'Post it' : 'Send anonymously'}<Send className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </section>

      <section id="confessions" className="pb-20">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div><p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-fuchsia-300">No names · real feelings</p><h2 className="text-5xl font-black tracking-[-0.065em] sm:text-7xl">STUDENT <span className="font-serif italic font-normal text-white/45">confessions.</span></h2></div>
          <div className="flex items-center gap-2 text-xs text-white/45"><ShieldCheck className="h-4 w-4 text-lime-300" />AI-moderated, community-safe</div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {campusConfessions.map((confession, index) => (
            <motion.article key={confession.number} initial={{ opacity: 0, y: 30, rotate: index - 1 }} whileInView={{ opacity: 1, y: 0, rotate: index - 1 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className={`${confession.color} flex min-h-[330px] flex-col justify-between rounded-[2rem] p-7 text-black transition hover:-translate-y-2`}>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]"><span>{confession.number}</span><span className="rounded-full border border-black/15 px-3 py-1.5">{confession.status === 'pending' ? 'Safety review pending' : confession.mood}</span></div>
              <p className="py-10 font-serif text-2xl italic leading-snug sm:text-3xl">“{confession.text}”</p>
              <div className="flex items-center justify-between text-xs font-black"><span>ANONYMOUS</span><button type="button" className="flex items-center gap-2"><Heart className="h-4 w-4" />{confession.reactions}</button></div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="mb-12"><p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-lime-300">What&apos;s moving campus</p><h2 className="text-5xl font-black tracking-[-0.065em] sm:text-7xl">THE <span className="font-serif italic font-normal text-white/45">stream.</span></h2></div>
        <div className="space-y-7">
          {campusPosts.map((post, index) => {
            const style = accents[post.accent as keyof typeof accents];
            return (
              <motion.article key={post.author} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: index * 0.08 }} className={`group grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] transition ${style.border} ${post.image ? 'lg:grid-cols-[.8fr_1.2fr]' : ''}`}>
                {post.image ? <div className="relative min-h-[320px] overflow-hidden"><Image src={post.image} alt="Campus post" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /></div> : null}
                <div className="flex flex-col justify-between p-7 sm:p-10">
                  <div>
                    <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><div className={`${style.bg} flex h-12 w-12 items-center justify-center rounded-full font-black text-black`}>{post.avatar}</div><div><h3 className="font-black">{post.author}</h3><p className="text-xs text-white/40">{post.role} · {post.time}</p></div></div><button type="button" aria-label="Share post" className="text-white/35 transition hover:text-white"><Share2 className="h-5 w-5" /></button></div>
                    <div className={`mt-7 flex items-start gap-2 border-l-2 pl-4 text-xs font-bold text-white/50 ${post.accent === 'lime' ? 'border-lime-300' : post.accent === 'pink' ? 'border-fuchsia-300' : 'border-cyan-300'}`}><Sparkles className={`h-4 w-4 shrink-0 ${style.text}`} />AI IN 5 SECONDS · {post.summary}</div>
                    <p className="mt-7 text-2xl font-bold leading-snug tracking-[-0.025em] sm:text-3xl">{post.content}</p>
                  </div>
                  <div className="mt-9 flex items-center gap-7 border-t border-white/10 pt-5 text-sm text-white/40"><button type="button" className="flex items-center gap-2 transition hover:text-fuchsia-300"><Heart className="h-5 w-5" />{post.likes}</button><button type="button" className="flex items-center gap-2 transition hover:text-cyan-300"><MessageCircle className="h-5 w-5" />{post.comments}</button><button type="button" className={`ml-auto flex items-center gap-2 font-black ${style.text}`}>Open thread <ArrowUpRight className="h-4 w-4" /></button></div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </DashboardLayout>
  );
}
