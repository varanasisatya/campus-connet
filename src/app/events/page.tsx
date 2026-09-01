'use client';

import Image from 'next/image';
import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, CalendarDays, Clock3, MapPin, Search, Sparkles, Users } from 'lucide-react';
import { useCampusStore } from '@/store/campusStore';

const events = [
  {
    number: '01',
    title: 'Build what campus needs next.',
    name: 'AI Hackathon 2026',
    date: 'JUN 20',
    time: '09:00 AM',
    location: 'Innovation Hall',
    attendees: '342 minds',
    match: '98% match',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=85',
    color: 'lime',
    tags: ['AI', 'Code', 'Build'],
  },
  {
    number: '02',
    title: 'Big ideas deserve a bigger room.',
    name: 'Startup Summit',
    date: 'JUL 10',
    time: '10:00 AM',
    location: 'Main Auditorium',
    attendees: '512 dreamers',
    match: '85% match',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=85',
    color: 'pink',
    tags: ['Ideas', 'Pitch', 'People'],
  },
  {
    number: '03',
    title: 'Make machines feel less impossible.',
    name: 'Robotics Workshop',
    date: 'AUG 05',
    time: '02:00 PM',
    location: 'Engineering Lab 3',
    attendees: '89 makers',
    match: '72% match',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1400&q=85',
    color: 'cyan',
    tags: ['Robots', 'Hardware', 'Play'],
  },
];

const colorStyles = {
  lime: { badge: 'bg-lime-300 text-black', line: 'bg-lime-300', text: 'text-lime-300', glow: 'shadow-[0_0_45px_rgba(190,242,100,.16)]' },
  pink: { badge: 'bg-fuchsia-400 text-black', line: 'bg-fuchsia-400', text: 'text-fuchsia-300', glow: 'shadow-[0_0_45px_rgba(232,121,249,.16)]' },
  cyan: { badge: 'bg-cyan-300 text-black', line: 'bg-cyan-300', text: 'text-cyan-300', glow: 'shadow-[0_0_45px_rgba(103,232,249,.16)]' },
};

export default function EventsPage() {
  const campusEvents = useCampusStore(state => state.events);
  const toggleRsvp = useCampusStore(state => state.toggleRsvp);
  const createEvent = useCampusStore(state => state.createEvent);
  const [showCreate, setShowCreate] = useState(false);

  const handleRsvp = async (id: string) => {
    try {
      const result = await toggleRsvp(id);
      toast.success(result === 'waitlist' ? 'You joined the waitlist.' : result === 'rsvp' ? 'Your RSVP is confirmed.' : 'Your reservation was removed.');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Cloud sync failed.'); }
  };
  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const image = form.get('image');
    try {
      await createEvent({ name: String(form.get('name')), title: String(form.get('description')), date: String(form.get('date')).toUpperCase(), time: String(form.get('time')), location: String(form.get('location')), capacity: Number(form.get('capacity')) || 100, match: 70, tags: ['Student-led'], image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=85' }, image instanceof File && image.size ? image : undefined);
      setShowCreate(false);
      toast.success('Event submitted for university approval.');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Event could not be synced.'); }
  };
  return (
    <DashboardLayout>
      <section className="relative min-h-[560px] overflow-hidden rounded-[2.5rem] border border-white/10">
        <Image
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2000&q=90"
          alt="Students enjoying a vibrant campus event"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 85vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08070d] via-[#08070d]/80 to-[#08070d]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08070d] via-transparent to-black/20" />

        <div className="relative z-10 flex min-h-[560px] flex-col justify-between p-7 sm:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.28em] text-fuchsia-300">
              <Sparkles className="h-4 w-4" /> Campus after class
            </div>
            <button type="button" className="flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2.5 text-xs font-bold backdrop-blur-xl transition hover:bg-white hover:text-black">
              <Search className="h-4 w-4" /> Find your scene
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-4 font-serif text-2xl italic text-white/65">Your calendar could never.</p>
            <h1 className="max-w-5xl text-5xl font-black leading-[0.86] tracking-[-0.075em] sm:text-7xl lg:text-[6.5rem]">
              FIND YOUR PEOPLE.<br /><span className="text-fuchsia-300">MAKE A CORE MEMORY.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">Three rooms. Hundreds of ideas. One campus that refuses to be boring. We used AI to put your best matches first.</p>
          </motion.div>

          <a href="#lineup" className="flex w-fit items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-fuchsia-300">
            Explore the lineup <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section id="lineup" className="py-16 sm:py-24">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-lime-300">Curated for your orbit</p>
            <h2 className="text-5xl font-black tracking-[-0.065em] sm:text-7xl">THE <span className="font-serif italic font-normal text-white/50">lineup.</span></h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['For you', 'Tech', 'Culture', 'Social', 'Workshops'].map((filter, index) => (
              <button key={filter} type="button" className={`rounded-full px-4 py-2 text-xs font-bold transition ${index === 0 ? 'bg-lime-300 text-black' : 'border border-white/10 text-white/50 hover:border-white/30 hover:text-white'}`}>{filter}</button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {campusEvents.map((event, index) => {
            const color = (['lime', 'pink', 'cyan'] as const)[index % 3];
            const styles = colorStyles[color];
            return (
              <motion.article
                key={event.name}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.08 }}
                className={`group relative grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] lg:grid-cols-[.95fr_1.05fr] ${styles.glow}`}
              >
                <div className={`relative min-h-[310px] overflow-hidden ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <Image src={event.image} alt={event.name} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
                  <span className="absolute left-6 top-6 font-serif text-5xl italic text-white/80">{String(index + 1).padStart(2, '0')}</span>
                  <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                    {event.tags.map((tag) => <span key={tag} className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-lg">{tag}</span>)}
                  </div>
                </div>

                <div className={`relative flex min-h-[310px] flex-col justify-between p-7 sm:p-10 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className={`absolute left-0 top-0 h-1 w-full ${styles.line}`} />
                  <div>
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                      <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${styles.badge}`}><Sparkles className="mr-1 inline h-3 w-3" />{event.match}% match</span>
                      <span className={`text-3xl font-black tracking-[-0.05em] ${styles.text}`}>{event.date}</span>
                    </div>
                    <p className="font-serif text-xl italic text-white/45">{event.title}</p>
                    <h3 className="mt-2 text-4xl font-black tracking-[-0.055em] sm:text-5xl">{event.name}</h3>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-white/40">{event.verified ? '✓ University verified' : '◷ Approval pending'}</p>
                  </div>

                  <div className="mt-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                    <div className="grid gap-3 text-sm text-white/55 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                      <span className="flex items-center gap-2"><Clock3 className={`h-4 w-4 ${styles.text}`} />{event.time}</span>
                      <span className="flex items-center gap-2"><MapPin className={`h-4 w-4 ${styles.text}`} />{event.location}</span>
                      <span className="flex items-center gap-2"><Users className={`h-4 w-4 ${styles.text}`} />{event.attendees}/{event.capacity}</span>
                    </div>
                    <button type="button" onClick={() => handleRsvp(event.id)} className={`group/button flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black text-black transition hover:bg-lime-300 ${event.rsvped ? 'bg-lime-300' : event.waitlisted ? 'bg-orange-300' : 'bg-white'}`}>
                      {event.rsvped ? 'Going ✓' : event.waitlisted ? 'Waitlisted' : 'Save my spot'} <ArrowUpRight className="h-4 w-4 transition group-hover/button:rotate-45" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="mb-8 grid overflow-hidden rounded-[2.5rem] bg-fuchsia-300 text-black lg:grid-cols-[1fr_auto]">
        <div className="p-8 sm:p-12">
          <CalendarDays className="mb-5 h-8 w-8" />
          <p className="text-xs font-black uppercase tracking-[0.28em]">Can&apos;t find your thing?</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[0.92] tracking-[-0.06em] sm:text-6xl">MAYBE YOUR EVENT IS THE ONE CAMPUS IS WAITING FOR.</h2>
        </div>
        <button type="button" onClick={() => setShowCreate(true)} className="m-6 flex min-h-28 items-center justify-center gap-3 rounded-[2rem] bg-black px-8 text-lg font-black text-white transition hover:scale-[1.02] lg:w-64">Create an event <ArrowUpRight className="h-5 w-5" /></button>
      </section>
      {showCreate ? <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4 backdrop-blur-lg"><form onSubmit={handleCreate} className="w-full max-w-lg rounded-[2rem] border border-white/15 bg-[#0d0b13] p-7"><div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-widest text-fuchsia-300">University approval workflow</p><h2 className="mt-2 text-3xl font-black">Create an event</h2></div><button type="button" onClick={() => setShowCreate(false)} className="text-white/50">Close</button></div><div className="mt-7 grid gap-3 sm:grid-cols-2">{[['name','Event name'],['description','Short description'],['date','Date (e.g. SEP 12)'],['time','Time'],['location','Location'],['capacity','Capacity']].map(([name,label]) => <label key={name} className={name === 'description' ? 'sm:col-span-2' : ''}><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40">{label}</span><input required name={name} type={name === 'capacity' ? 'number' : 'text'} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-fuchsia-300/50" /></label>)}</div><label className="mt-4 block"><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40">Event image · optional · max 5 MB</span><input name="image" type="file" accept="image/*" className="w-full rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-xs text-white/55 file:mr-3 file:rounded-full file:border-0 file:bg-fuchsia-300 file:px-3 file:py-1.5 file:font-black file:text-black" /></label><button type="submit" className="mt-6 w-full rounded-full bg-fuchsia-300 py-3 text-sm font-black text-black">Submit for approval</button></form></div> : null}
    </DashboardLayout>
  );
}
