'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, BookOpen, Check, CheckCheck, ChevronDown, Crown, GraduationCap, ShieldCheck, Sparkles, X, type LucideProps } from 'lucide-react';
import { useCampusStore, type CampusRole } from '@/store/campusStore';
import { useUserStore } from '@/store/userStore';

type RoleProfile = {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  glow: string;
  icon: ComponentType<LucideProps>;
};

const roleProfiles: Record<CampusRole, RoleProfile> = {
  student: { eyebrow: 'STUDENT', title: 'Campus Explorer', description: 'Discover, connect and make your mark.', accent: 'bg-lime-300', glow: 'shadow-[0_0_28px_rgba(190,242,100,.22)]', icon: GraduationCap },
  faculty: { eyebrow: 'FACULTY', title: 'Academic Guide', description: 'Teach, announce and lead the room.', accent: 'bg-cyan-300', glow: 'shadow-[0_0_28px_rgba(103,232,249,.2)]', icon: BookOpen },
  moderator: { eyebrow: 'MODERATOR', title: 'Community Guardian', description: 'Keep every campus space safe.', accent: 'bg-fuchsia-300', glow: 'shadow-[0_0_28px_rgba(240,171,252,.2)]', icon: ShieldCheck },
  admin: { eyebrow: 'ADMIN', title: 'Campus Director', description: 'See the system behind the story.', accent: 'bg-orange-300', glow: 'shadow-[0_0_28px_rgba(253,186,116,.2)]', icon: Crown },
};

function RoleCharacter({ role, compact = false }: { role: CampusRole; compact?: boolean }) {
  const profile = roleProfiles[role];
  const RoleIcon = profile.icon;
  const palette = {
    student: { background: '#bef264', shirt: '#17131f', detail: '#22d3ee' },
    faculty: { background: '#67e8f9', shirt: '#172554', detail: '#f0abfc' },
    moderator: { background: '#f0abfc', shirt: '#2e1065', detail: '#bef264' },
    admin: { background: '#fdba74', shirt: '#431407', detail: '#67e8f9' },
  }[role];

  return (
    <span className={`relative block shrink-0 overflow-hidden border border-black/10 ${compact ? 'h-8 w-8 rounded-xl' : 'h-16 w-16 rounded-[1.35rem]'} ${profile.glow}`} style={{ backgroundColor: palette.background }} aria-hidden="true">
      <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full">
        <circle cx="40" cy="31" r="15" fill="#f3c7a6" />
        <path d="M24 31c0-13 7-20 17-20 9 0 16 7 16 17-5-5-10-8-17-8-6 0-11 4-16 11Z" fill="#19131d" />
        <circle cx="35" cy="32" r="1.4" fill="#19131d" />
        <circle cx="46" cy="32" r="1.4" fill="#19131d" />
        <path d="M36 39c3 2 6 2 9 0" fill="none" stroke="#9b5f4b" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 80c1-21 10-33 23-33s22 12 23 33H17Z" fill={palette.shirt} />
        <path d="M26 55c8 6 20 6 28 0" fill="none" stroke={palette.detail} strokeWidth="3" strokeLinecap="round" />
        {role === 'student' ? <path d="M20 62c-5 1-8 5-8 12v6h8V62Zm40 0c5 1 8 5 8 12v6h-8V62Z" fill="#19131d" opacity=".8" /> : null}
      </svg>
      <span className={`absolute flex items-center justify-center rounded-full bg-black text-white ${compact ? '-bottom-0.5 -right-0.5 h-4 w-4' : 'bottom-1 right-1 h-6 w-6'}`}><RoleIcon className={compact ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'} /></span>
    </span>
  );
}

export function CampusToolbar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { role, setRole, notifications, markAllRead, backendStatus } = useCampusStore();
  const authenticatedRole = useUserStore(state => state.user?.role);
  const unread = notifications.filter(item => !item.read).length;
  const activeProfile = roleProfiles[role];

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!toolbarRef.current?.contains(event.target as Node)) {
        setRoleOpen(false);
        setNotificationsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setRoleOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const chooseRole = (nextRole: CampusRole) => {
    setRole(nextRole);
    setRoleOpen(false);
  };

  return (
    <div ref={toolbarRef} className="fixed right-4 top-4 z-[70] flex items-center gap-2 md:right-6 md:top-6">
      <button
        type="button"
        onClick={() => { setRoleOpen(value => !value); setNotificationsOpen(false); }}
        aria-haspopup="dialog"
        aria-expanded={roleOpen}
        aria-label={`Current campus role: ${activeProfile.eyebrow}. Change role`}
        className={`group flex h-12 items-center gap-2 rounded-[1.25rem] border px-2 pr-3 text-left backdrop-blur-2xl transition-all duration-300 ${roleOpen ? 'border-lime-300/50 bg-[#15121b] shadow-[0_14px_45px_rgba(0,0,0,.45)]' : 'border-white/10 bg-[#0d0b13]/90 hover:-translate-y-0.5 hover:border-white/25'}`}
      >
        <RoleCharacter role={role} compact />
        <span className="hidden min-w-24 sm:block">
          <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-white/35">Viewing as</span>
          <strong className="mt-0.5 block text-xs font-black text-white">{activeProfile.title}</strong>
          <span className={`mt-1 block text-[8px] font-black uppercase tracking-widest ${backendStatus === 'live' ? 'text-cyan-300' : backendStatus === 'error' ? 'text-rose-300' : 'text-white/30'}`}>{backendStatus === 'live' ? 'Cloud live' : backendStatus === 'connecting' ? 'Syncing' : backendStatus === 'error' ? 'Sync issue' : 'Guest demo'}</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-white/45 transition duration-300 ${roleOpen ? 'rotate-180 text-lime-300' : 'group-hover:text-white'}`} />
      </button>
      <button type="button" onClick={() => { setNotificationsOpen(value => !value); setRoleOpen(false); }} aria-label="Open notifications" className="relative flex h-12 w-12 items-center justify-center rounded-[1.25rem] border border-white/10 bg-[#0d0b13]/90 text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-lime-300/40">
        <Bell className="h-4 w-4" />
        {unread ? <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-300 px-1 text-[9px] font-black text-black">{unread}</span> : null}
      </button>

      <AnimatePresence>
        {roleOpen ? (
          <motion.section
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Switch campus role"
            className="absolute right-0 top-14 w-[min(430px,calc(100vw-2rem))] overflow-hidden rounded-[2rem] border border-white/15 bg-[#0d0b13] shadow-[0_28px_90px_rgba(0,0,0,.65)]"
          >
            <div className="relative overflow-hidden border-b border-white/10 px-5 py-5">
              <div className="absolute -right-14 -top-20 h-48 w-48 rounded-full bg-lime-300/15 blur-3xl" />
              <div className="relative flex items-start justify-between gap-6">
                <div><p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.24em] text-lime-300"><Sparkles className="h-3 w-3" />Identity switch</p><h2 className="mt-2 max-w-xs text-3xl font-black leading-[0.92] tracking-[-0.05em]">WHO&apos;S CAMPUS<br /><span className="font-serif italic font-normal text-white/45">are we seeing?</span></h2></div>
                <button type="button" onClick={() => setRoleOpen(false)} aria-label="Close role switcher" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/45 transition hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="grid gap-2 p-3 sm:grid-cols-2" role="list">
              {(Object.keys(roleProfiles) as CampusRole[]).map(optionRole => {
                const profile = roleProfiles[optionRole];
                const selected = role === optionRole;
                return (
                  <motion.button
                    key={optionRole}
                    type="button"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => chooseRole(optionRole)}
                    aria-pressed={selected}
                    className={`relative overflow-hidden rounded-[1.5rem] border p-4 text-left transition ${selected ? 'border-lime-300/45 bg-lime-300/[0.08]' : 'border-white/8 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.055]'}`}
                  >
                    {selected ? <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-lime-300 text-black"><Check className="h-3.5 w-3.5" /></span> : null}
                    <RoleCharacter role={optionRole} />
                    <span className="mt-4 block text-[9px] font-black tracking-[0.22em] text-white/35">{profile.eyebrow}</span>
                    <strong className="mt-1 block text-base font-black tracking-[-0.025em] text-white">{profile.title}</strong>
                    <span className="mt-1.5 block max-w-[14rem] text-[11px] leading-relaxed text-white/40">{profile.description}</span>
                    <span className={`absolute bottom-0 left-0 h-1 w-full ${profile.accent} ${selected ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                  </motion.button>
                );
              })}
            </div>
            <footer className="flex items-center gap-3 border-t border-white/10 bg-white/[0.02] px-5 py-3.5"><ShieldCheck className="h-4 w-4 shrink-0 text-lime-300" /><p className="text-[10px] leading-relaxed text-white/35">The view changes instantly. Protected permissions never do.</p></footer>
          </motion.section>
        ) : null}

        {notificationsOpen ? (
          <motion.section initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} aria-label="Notifications" className="absolute right-0 top-14 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/15 bg-[#0d0b13] shadow-2xl">
            <header className="flex items-center justify-between border-b border-white/10 p-4"><div><h2 className="font-black">Notifications</h2><p className="text-[10px] text-white/40">Only alerts you choose to receive</p></div><button type="button" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"><X className="h-4 w-4" /></button></header>
            <div className="max-h-80 overflow-y-auto p-2">
              {notifications.map(item => <article key={item.id} className={`rounded-2xl p-3 ${item.read ? 'opacity-45' : 'bg-white/[0.055]'}`}><div className="flex items-start gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.type === 'safety' ? 'bg-rose-400' : item.type === 'case' ? 'bg-cyan-300' : 'bg-lime-300'}`} /><div><h3 className="text-xs font-black">{item.title}</h3><p className="mt-1 text-xs leading-relaxed text-white/45">{item.detail}</p><span className="mt-2 block text-[9px] text-white/25">{item.time}</span></div></div></article>)}
            </div>
            <footer className="flex items-center justify-between border-t border-white/10 p-3"><button type="button" onClick={() => void markAllRead()} className="flex items-center gap-2 text-[10px] font-bold text-white/50 hover:text-white"><CheckCheck className="h-3.5 w-3.5" />Mark all read</button>{authenticatedRole === 'admin' || authenticatedRole === 'moderator' ? <Link href="/admin" className="text-[10px] font-black text-lime-300">Open command center →</Link> : null}</footer>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
