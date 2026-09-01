'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, CalendarDays, MapPin, Search, Sparkles, Users } from 'lucide-react';

const moments = [
  { time: '09:00', eyebrow: 'Start here', title: 'Coffee, code & new faces', copy: 'The Innovation Hub is already buzzing. 42 builders are checking in for the AI Hackathon.', accent: 'lime', icon: Users, meta: '98% your vibe' },
  { time: '12:30', eyebrow: 'Next chapter', title: 'The quad comes alive', copy: 'Music, food pop-ups and the annual culture showcase take over the heart of campus.', accent: 'pink', icon: CalendarDays, meta: '1.2k going' },
  { time: '15:00', eyebrow: 'Plot twist', title: 'Your backpack has a match', copy: 'A black backpack matching your search was found near the Student Center help desk.', accent: 'blue', icon: Search, meta: 'New match' },
  { time: '18:30', eyebrow: 'Golden hour', title: 'Ideas after dark', copy: 'End the day with rooftop conversations, student films and a skyline worth staying for.', accent: 'orange', icon: BookOpen, meta: '12 seats left' },
];

const accentClasses = {
  lime: 'bg-lime-300 text-black shadow-[0_0_40px_rgba(190,242,100,.25)]',
  pink: 'bg-fuchsia-400 text-black shadow-[0_0_40px_rgba(232,121,249,.25)]',
  blue: 'bg-cyan-300 text-black shadow-[0_0_40px_rgba(103,232,249,.25)]',
  orange: 'bg-orange-300 text-black shadow-[0_0_40px_rgba(253,186,116,.25)]',
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <section className="relative min-h-[520px] overflow-hidden rounded-[2.5rem] border border-white/10">
        <Image src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=90" alt="Students walking through a grand university campus" fill priority sizes="(max-width: 768px) 100vw, 80vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08070d] via-[#08070d]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08070d] via-transparent to-black/20" />

        <div className="relative z-10 flex min-h-[520px] max-w-3xl flex-col justify-between p-7 sm:p-12">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-lime-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-lime-300" />
            Tuesday · Your campus is awake
          </div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-3 font-serif text-2xl italic text-white/70">Welcome back, explorer.</p>
            <h1 className="max-w-2xl text-5xl font-black leading-[0.88] tracking-[-0.075em] sm:text-7xl lg:text-8xl">
              TODAY HAS A<span className="block text-lime-300">STORY TO TELL.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">Not another dashboard. This is your living campus—mapped from first coffee to the last big idea.</p>
          </motion.div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="#journey" className="group flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-lime-300">Follow today&apos;s trail <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" /></Link>
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-3 text-sm backdrop-blur-xl"><MapPin className="h-4 w-4 text-fuchsia-300" />North Campus · 24°C</div>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 hidden rotate-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl lg:block">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Campus pulse</p>
          <p className="mt-1 text-3xl font-black">8.4k <span className="text-sm text-lime-300">online</span></p>
        </div>
      </section>

      <section id="journey" className="relative py-20">
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-fuchsia-300">Your campus, one unfolding day</p>
            <h2 className="text-4xl font-black tracking-[-0.05em] sm:text-6xl">FOLLOW THE <span className="font-serif italic font-normal text-white/60">energy.</span></h2>
          </div>
          <div className="flex gap-6 text-right"><div><strong className="block text-2xl">124</strong><span className="text-xs text-white/45">moments live</span></div><div><strong className="block text-2xl text-cyan-300">+24%</strong><span className="text-xs text-white/45">campus energy</span></div></div>
        </div>
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-lime-300 via-fuchsia-400 to-orange-300 sm:left-1/2" />
          {moments.map((moment, index) => {
            const Icon = moment.icon;
            const isRight = index % 2 === 1;
            return (
              <motion.article key={moment.time} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: 0.08 * index }} className={`relative mb-10 pl-16 sm:flex sm:w-1/2 sm:pl-0 ${isRight ? 'sm:ml-auto sm:justify-start sm:pl-12' : 'sm:justify-end sm:pr-12 sm:text-right'}`}>
                <div className={`absolute left-[0.7rem] top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full sm:left-auto ${isRight ? 'sm:-left-5' : 'sm:-right-5'} ${accentClasses[moment.accent as keyof typeof accentClasses]}`}><Icon className="h-4 w-4" /></div>
                <div className="story-card group max-w-md rounded-[1.8rem] p-6 transition duration-300 hover:-translate-y-1">
                  <div className={`mb-5 flex items-center gap-3 ${!isRight ? 'sm:justify-end' : ''}`}><span className="text-xs font-black tracking-[0.2em] text-white/40">{moment.time}</span><span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/60">{moment.eyebrow}</span></div>
                  <h3 className="text-2xl font-black tracking-[-0.04em] sm:text-3xl">{moment.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{moment.copy}</p>
                  <div className={`mt-5 flex items-center gap-2 text-xs font-bold ${!isRight ? 'sm:justify-end' : ''}`}><Sparkles className="h-3.5 w-3.5 text-lime-300" />{moment.meta}</div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="relative mb-8 overflow-hidden rounded-[2.5rem] bg-lime-300 p-8 text-black sm:p-12">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[40px] border-black/10" />
        <p className="text-xs font-black uppercase tracking-[0.3em]">AI found your next move</p>
        <div className="relative mt-4 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <h2 className="max-w-3xl text-4xl font-black leading-[0.92] tracking-[-0.06em] sm:text-6xl">THE HACKATHON IS A 98% MATCH. COINCIDENCE? WE THINK NOT.</h2>
          <Link href="/events" className="flex shrink-0 items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-black text-white">See the event <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </DashboardLayout>
  );
}
