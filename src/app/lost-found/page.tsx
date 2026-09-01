'use client';

import Image from 'next/image';
import { useRef, useState, type FormEvent, type PointerEvent } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Camera, Check, Crosshair, Eye, Fingerprint, MapPin, Radar, ScanLine, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { useCampusStore } from '@/store/campusStore';

const cases = [
  { id: 'CASE 0248', item: 'Black NorthFace Backpack', status: 'Lost', location: 'Library · 2nd floor', time: '2h ago', match: 93, color: 'lime', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85' },
  { id: 'CASE 0246', item: 'Apple AirPods Pro', status: 'Found', location: 'Central Cafeteria', time: '5h ago', match: 88, color: 'pink', image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1000&q=85' },
  { id: 'CASE 0239', item: 'HydroFlask Bottle', status: 'Lost', location: 'West Gymnasium', time: 'Yesterday', match: 45, color: 'cyan', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85' },
];

const investigation = [
  { step: '01', label: 'VISUAL FINGERPRINT', title: 'One photo becomes a thousand clues.', copy: 'Our vision model reads shape, texture, colour, wear marks and tiny identifiers that ordinary search misses.', icon: Fingerprint, detail: '1,284 visual signals extracted', color: 'text-lime-300' },
  { step: '02', label: 'CAMPUS TRACE', title: 'Every sighting joins the evidence board.', copy: 'Time, location and community reports connect into a live probability trail across campus.', icon: Radar, detail: '7 nearby reports cross-checked', color: 'text-fuchsia-300' },
  { step: '03', label: 'HUMAN VERIFIED', title: 'AI proposes. People prove.', copy: 'Private verification questions protect the item before owner and finder are safely connected.', icon: ShieldCheck, detail: 'Identity protected end-to-end', color: 'text-cyan-300' },
];

const caseColors = {
  lime: { badge: 'bg-lime-300 text-black', text: 'text-lime-300', border: 'hover:border-lime-300/40' },
  pink: { badge: 'bg-fuchsia-300 text-black', text: 'text-fuchsia-300', border: 'hover:border-fuchsia-300/40' },
  cyan: { badge: 'bg-cyan-300 text-black', text: 'text-cyan-300', border: 'hover:border-cyan-300/40' },
};

export default function LostFoundPage() {
  const heroRef = useRef<HTMLElement>(null);
  const investigationRef = useRef<HTMLElement>(null);
  const pointerX = useMotionValue(320);
  const pointerY = useMotionValue(220);
  const smoothX = useSpring(pointerX, { stiffness: 170, damping: 24, mass: 0.4 });
  const smoothY = useSpring(pointerY, { stiffness: 170, damping: 24, mass: 0.4 });
  const { scrollYProgress } = useScroll({ target: investigationRef, offset: ['start 75%', 'end 60%'] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const campusCases = useCampusStore(state => state.cases);
  const createCase = useCampusStore(state => state.createCase);
  const requestClaim = useCampusStore(state => state.requestClaim);
  const [reportMode, setReportMode] = useState<'Lost' | 'Found' | null>(null);

  const trackPointer = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(event.clientX - rect.left);
    pointerY.set(event.clientY - rect.top);
  };

  const handleReport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const image = form.get('image');
    try {
      await createCase({ item: String(form.get('item')), status: reportMode || 'Lost', location: String(form.get('location')), description: String(form.get('description')), image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85' }, image instanceof File && image.size ? image : undefined);
      setReportMode(null);
      toast.success('Case opened. Private matching has started.');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Case could not be synced.'); }
  };

  return (
    <DashboardLayout>
      <section ref={heroRef} onPointerMove={trackPointer} className="relative min-h-[590px] cursor-crosshair overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0b0a10]">
        <Image src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2000&q=90" alt="A collaborative university investigation workspace" fill priority sizes="(max-width: 768px) 100vw, 85vw" className="object-cover opacity-35 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08070d] via-[#08070d]/90 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <motion.div aria-hidden="true" className="pointer-events-none absolute hidden h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(190,242,100,.18),rgba(190,242,100,.04)_35%,transparent_70%)] mix-blend-screen md:block" style={{ left: smoothX, top: smoothY }} />

        <div className="relative z-10 flex min-h-[590px] flex-col justify-between p-7 sm:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.28em] text-lime-300"><ScanLine className="h-4 w-4" /> Campus intelligence · live</div>
            <div className="flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-xs font-bold text-lime-200"><span className="h-2 w-2 animate-pulse rounded-full bg-lime-300" />48 cameras connected</div>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-4 font-serif text-2xl italic text-white/60">Every object leaves a trail.</p>
            <h1 className="max-w-5xl text-5xl font-black leading-[0.86] tracking-[-0.075em] sm:text-7xl lg:text-[6.4rem]">NOTHING STAYS<br /><span className="text-lime-300">MISSING FOR LONG.</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">Upload one clue. CampusAI scans visual fingerprints, location patterns and community sightings to reconstruct the story.</p>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setReportMode('Lost')} className="flex items-center gap-3 rounded-full bg-lime-300 px-5 py-3 text-sm font-black text-black transition hover:bg-white"><Search className="h-4 w-4" />Start a search</button>
            <button type="button" onClick={() => setReportMode('Found')} className="flex items-center gap-3 rounded-full border border-white/15 bg-black/30 px-5 py-3 text-sm font-black backdrop-blur-xl transition hover:bg-white hover:text-black"><Camera className="h-4 w-4" />I found something</button>
            <a href="#investigation" className="ml-auto hidden items-center gap-2 text-xs font-black uppercase tracking-widest text-white/45 hover:text-white sm:flex">See how AI solves it <ArrowDown className="h-4 w-4" /></a>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9, rotate: 4 }} animate={{ opacity: 1, scale: 1, rotate: 2 }} transition={{ delay: 0.45, duration: 0.6 }} className="absolute bottom-10 right-10 hidden w-72 overflow-hidden rounded-3xl border border-white/20 bg-black/60 p-3 backdrop-blur-2xl xl:block">
          <div className="relative h-40 overflow-hidden rounded-2xl">
            <Image src={cases[0].image} alt="AI scan of black backpack" fill sizes="288px" className="object-cover" />
            <div className="absolute inset-0 bg-lime-300/10" />
            <div className="absolute inset-x-0 top-1/2 h-px animate-pulse bg-lime-300 shadow-[0_0_18px_#bef264]" />
            <Crosshair className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-lime-300" />
          </div>
          <div className="flex items-center justify-between px-2 pb-1 pt-3"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Best visual match</p><p className="mt-1 text-sm font-black">Black commuter pack</p></div><strong className="text-2xl text-lime-300">93%</strong></div>
        </motion.div>
      </section>

      <section ref={investigationRef} id="investigation" className="relative py-20 sm:py-28">
        <div className="mb-16 max-w-4xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-fuchsia-300">Inside the investigation</p>
          <h2 className="text-5xl font-black leading-[0.9] tracking-[-0.065em] sm:text-7xl">HOW AI <span className="font-serif italic font-normal text-white/45">cracks the case.</span></h2>
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="absolute left-6 top-0 h-full w-px bg-white/10 md:left-1/2" />
          <motion.div className="absolute left-6 top-0 h-full w-px origin-top bg-gradient-to-b from-lime-300 via-fuchsia-300 to-cyan-300 md:left-1/2" style={{ scaleY: lineScale }} />
          {investigation.map((clue, index) => {
            const Icon = clue.icon;
            const right = index % 2 === 1;
            return (
              <motion.article key={clue.step} initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-120px' }} transition={{ duration: 0.55 }} className={`relative mb-16 pl-16 md:flex md:w-1/2 md:pl-0 ${right ? 'md:ml-auto md:pl-14' : 'md:justify-end md:pr-14 md:text-right'}`}>
                <div className={`absolute left-[0.7rem] top-1 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[#0d0b13] md:left-auto ${right ? 'md:-left-6' : 'md:-right-6'}`}><Icon className={`h-5 w-5 ${clue.color}`} /></div>
                <div className="max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/20 sm:p-9">
                  <div className={`mb-7 flex items-center gap-3 ${right ? '' : 'md:justify-end'}`}><span className="font-serif text-4xl italic text-white/20">{clue.step}</span><span className={`text-[10px] font-black tracking-[0.22em] ${clue.color}`}>{clue.label}</span></div>
                  <h3 className="text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl">{clue.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/50 sm:text-base">{clue.copy}</p>
                  <div className={`mt-7 flex items-center gap-2 text-xs font-bold text-white/70 ${right ? '' : 'md:justify-end'}`}><Check className={`h-4 w-4 ${clue.color}`} />{clue.detail}</div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="pb-20">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div><p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-cyan-300">Evidence board · updated now</p><h2 className="text-5xl font-black tracking-[-0.065em] sm:text-7xl">OPEN <span className="font-serif italic font-normal text-white/45">cases.</span></h2></div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-white/50"><Eye className="h-4 w-4" />Community-visible clues only</div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {campusCases.map((item, index) => {
            const color = (['lime', 'pink', 'cyan'] as const)[index % 3];
            const styles = caseColors[color];
            const caseImage = item.image.includes('1586769852044') ? 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85' : item.image;
            return (
              <motion.article key={item.id} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className={`group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] transition ${styles.border}`}>
                <div className="relative h-64 overflow-hidden">
                  <Image src={caseImage} alt={item.item} fill sizes="(max-width: 1024px) 100vw, 30vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b13] via-transparent to-black/10" />
                  <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] font-black tracking-widest backdrop-blur-xl">{item.id}</span>
                  <span className={`absolute bottom-5 right-5 rounded-full px-3 py-1.5 text-xs font-black ${styles.badge}`}>{item.match}% SIGNAL</span>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between"><span className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.text}`}>{item.status}</span><span className="text-xs text-white/35">{item.time}</span></div>
                  <h3 className="text-2xl font-black tracking-[-0.04em]">{item.item}</h3>
                  <p className="mt-3 flex items-center gap-2 text-sm text-white/45"><MapPin className={`h-4 w-4 ${styles.text}`} />{item.location}</p>
                  <button type="button" onClick={() => { void requestClaim(item.id).then(() => toast.success('Private ownership verification started.')).catch(error => toast.error(error instanceof Error ? error.message : 'Claim could not be synced.')); }} className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black text-black transition hover:bg-lime-300 ${item.claimRequested ? 'bg-lime-300' : 'bg-white'}`}>{item.claimRequested ? 'Verification pending' : 'Inspect case'} <ArrowUpRight className="h-4 w-4" /></button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="relative mb-8 overflow-hidden rounded-[2.5rem] bg-cyan-300 p-8 text-black sm:p-12">
        <Sparkles className="mb-6 h-8 w-8" />
        <p className="text-xs font-black uppercase tracking-[0.28em]">The smartest clue is the first one</p>
        <div className="mt-4 flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><h2 className="max-w-4xl text-4xl font-black leading-[0.92] tracking-[-0.06em] sm:text-6xl">SHOW US WHAT&apos;S MISSING. WE&apos;LL START CONNECTING THE DOTS.</h2><button type="button" onClick={() => setReportMode('Lost')} className="flex shrink-0 items-center justify-center gap-3 rounded-full bg-black px-6 py-4 text-sm font-black text-white">Open a new case <ArrowUpRight className="h-4 w-4" /></button></div>
      </section>
      {reportMode ? <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4 backdrop-blur-lg"><form onSubmit={handleReport} className="w-full max-w-lg rounded-[2rem] border border-white/15 bg-[#0d0b13] p-7"><div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-widest text-lime-300">Privacy-protected report</p><h2 className="mt-2 text-3xl font-black">Report {reportMode.toLowerCase()} item</h2></div><button type="button" onClick={() => setReportMode(null)} className="text-white/50">Close</button></div><p className="mt-4 text-xs leading-relaxed text-white/40">Exact identifying details stay private and become verification questions for a potential owner.</p><div className="mt-6 grid gap-4">{[['item','Item name'],['location','Last known location'],['description','Private identifying details']].map(([name,label]) => <label key={name}><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40">{label}</span>{name === 'description' ? <textarea required name={name} className="min-h-24 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-lime-300/50" /> : <input required name={name} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-lime-300/50" />}</label>)}</div><label className="mt-4 block"><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40">Evidence photo · optional · max 5 MB</span><input name="image" type="file" accept="image/*" className="w-full rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-xs text-white/55 file:mr-3 file:rounded-full file:border-0 file:bg-lime-300 file:px-3 file:py-1.5 file:font-black file:text-black" /></label><button type="submit" className="mt-6 w-full rounded-full bg-lime-300 py-3 text-sm font-black text-black">Begin secure matching</button></form></div> : null}
    </DashboardLayout>
  );
}
