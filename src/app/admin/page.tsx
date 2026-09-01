'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { useCampusStore } from '@/store/campusStore';
import { AlertTriangle, Check, ClipboardCheck, Eye, ShieldCheck, Users, X } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export default function AdminPage() {
  const { events, cases, posts, moderation, resolveModeration } = useCampusStore();
  const user = useUserStore(state => state.user);
  const authLoading = useUserStore(state => state.loading);
  const pending = moderation.filter(item => item.status === 'pending');

  if (authLoading) return <DashboardLayout><section className="flex min-h-[75vh] items-center justify-center text-sm font-black uppercase tracking-widest text-white/40">Checking university access…</section></DashboardLayout>;
  if (user?.role !== 'admin' && user?.role !== 'moderator') {
    return <DashboardLayout><section className="flex min-h-[75vh] items-center justify-center"><div className="max-w-xl text-center"><ShieldCheck className="mx-auto h-12 w-12 text-rose-300" /><h1 className="mt-6 text-5xl font-black tracking-[-.06em]">RESTRICTED AREA.</h1><p className="mt-4 text-white/50">The command center is available only to authorized moderators and university administrators.</p></div></section></DashboardLayout>;
  }

  const metrics = [
    { label: 'Active students', value: '8.4k', icon: Users, color: 'bg-lime-300' },
    { label: 'Approved events', value: events.filter(event => event.approval === 'approved').length, icon: Check, color: 'bg-cyan-300' },
    { label: 'Open cases', value: cases.filter(item => item.status !== 'Resolved').length, icon: Eye, color: 'bg-fuchsia-300' },
    { label: 'Review queue', value: pending.length, icon: AlertTriangle, color: 'bg-orange-300' },
  ];

  return (
    <DashboardLayout>
      <section className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[.07] to-transparent p-8 sm:p-12">
        <p className="text-xs font-black uppercase tracking-[.3em] text-lime-300">University operations · audit enabled</p>
        <h1 className="mt-5 text-5xl font-black leading-[.88] tracking-[-.07em] sm:text-7xl">COMMAND<br /><span className="font-serif italic font-normal text-white/45">center.</span></h1>
        <p className="mt-6 max-w-2xl text-white/50">A single accountable view for safety, event approvals, community moderation and campus service health.</p>
      </section>

      <section className="grid gap-4 py-8 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(metric => { const Icon = metric.icon; return <article key={metric.label} className="rounded-3xl border border-white/10 bg-white/[.035] p-6"><span className={`${metric.color} flex h-10 w-10 items-center justify-center rounded-xl text-black`}><Icon className="h-5 w-5" /></span><strong className="mt-7 block text-4xl font-black">{metric.value}</strong><span className="text-xs text-white/40">{metric.label}</span></article>; })}
      </section>

      <section className="grid gap-7 pb-10 xl:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[.035] p-6 sm:p-8">
          <div className="mb-7 flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.25em] text-fuchsia-300">Human review required</p><h2 className="mt-2 text-3xl font-black">Moderation queue</h2></div><span className="rounded-full bg-fuchsia-300 px-3 py-1 text-xs font-black text-black">{pending.length} pending</span></div>
          <div className="space-y-3">
            {pending.length ? pending.map(item => <article key={item.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center"><div><span className="text-[9px] font-black uppercase tracking-widest text-white/30">{item.kind}</span><h3 className="mt-1 font-black">{item.label}</h3><p className="mt-1 text-xs text-white/40">{item.reason}</p></div><div className="flex gap-2"><button type="button" onClick={() => resolveModeration(item.id, 'rejected')} className="flex h-10 items-center gap-2 rounded-full border border-rose-300/20 px-4 text-xs font-bold text-rose-300"><X className="h-3.5 w-3.5" />Reject</button><button type="button" onClick={() => resolveModeration(item.id, 'approved')} className="flex h-10 items-center gap-2 rounded-full bg-lime-300 px-4 text-xs font-black text-black"><Check className="h-3.5 w-3.5" />Approve</button></div></article>) : <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-white/35">Queue clear. Every action remains in the audit trail.</div>}
          </div>
        </div>
        <div className="rounded-[2rem] bg-lime-300 p-7 text-black sm:p-8"><ClipboardCheck className="h-8 w-8" /><p className="mt-8 text-[10px] font-black uppercase tracking-[.25em]">Operational pulse</p><h2 className="mt-3 text-4xl font-black tracking-[-.05em]">SYSTEMS HEALTHY.</h2><dl className="mt-8 space-y-4 text-sm"><div className="flex justify-between border-b border-black/15 pb-3"><dt>Community posts</dt><dd className="font-black">{posts.length} live</dd></div><div className="flex justify-between border-b border-black/15 pb-3"><dt>Lost-item resolution</dt><dd className="font-black">68%</dd></div><div className="flex justify-between border-b border-black/15 pb-3"><dt>AI response confidence</dt><dd className="font-black">92%</dd></div><div className="flex justify-between"><dt>Last policy sync</dt><dd className="font-black">8 min ago</dd></div></dl></div>
      </section>
    </DashboardLayout>
  );
}
