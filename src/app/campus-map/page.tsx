'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Accessibility, ArrowRight, Building2, Check, ChevronDown, ChevronRight, Clock3, Footprints, LocateFixed, MapPin, Navigation, RefreshCw, Route as RouteIcon, ShieldCheck, Sparkles } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

type BuildingId = 'main-gate' | 'admin' | 'library' | 'student-center' | 'cafeteria' | 'residence' | 'humanities' | 'auditorium' | 'innovation' | 'engineering' | 'science' | 'sports';

type CampusBuilding = {
  id: BuildingId;
  label: string;
  mapLabel: string;
  code: string;
  category: string;
  x: number;
  y: number;
  color: string;
};

type CampusEdge = {
  from: BuildingId;
  to: BuildingId;
  minutes: number;
  meters: number;
  accessible: boolean;
  via: string;
};

const buildings: CampusBuilding[] = [
  { id: 'main-gate', label: 'Main Campus Gate', mapLabel: 'Main Gate', code: 'ENTRY', category: 'Entrance', x: 105, y: 575, color: '#fdba74' },
  { id: 'admin', label: 'Administration Block', mapLabel: 'Admin', code: 'BLOCK A', category: 'Services', x: 230, y: 470, color: '#f0abfc' },
  { id: 'library', label: 'Central Library', mapLabel: 'Library', code: 'BLOCK B', category: 'Academic', x: 390, y: 430, color: '#bef264' },
  { id: 'student-center', label: 'Student Center', mapLabel: 'Student Hub', code: 'COMMONS', category: 'Community', x: 545, y: 485, color: '#67e8f9' },
  { id: 'cafeteria', label: 'Central Cafeteria', mapLabel: 'Cafeteria', code: 'FOOD', category: 'Dining', x: 700, y: 525, color: '#fdba74' },
  { id: 'residence', label: 'Student Residence', mapLabel: 'Residence', code: 'HOSTEL', category: 'Residence', x: 885, y: 565, color: '#f0abfc' },
  { id: 'humanities', label: 'Humanities Block', mapLabel: 'Humanities', code: 'BLOCK C', category: 'Academic', x: 280, y: 265, color: '#f0abfc' },
  { id: 'auditorium', label: 'Main Auditorium', mapLabel: 'Auditorium', code: 'HALL 01', category: 'Events', x: 470, y: 270, color: '#fdba74' },
  { id: 'innovation', label: 'Innovation Hall', mapLabel: 'Innovation', code: 'BLOCK D', category: 'Academic', x: 655, y: 305, color: '#bef264' },
  { id: 'engineering', label: 'Engineering Complex', mapLabel: 'Engineering', code: 'BLOCK E', category: 'Academic', x: 850, y: 330, color: '#67e8f9' },
  { id: 'science', label: 'Science & Research Center', mapLabel: 'Science', code: 'BLOCK F', category: 'Research', x: 790, y: 125, color: '#67e8f9' },
  { id: 'sports', label: 'Sports Complex', mapLabel: 'Sports', code: 'ARENA', category: 'Recreation', x: 520, y: 105, color: '#bef264' },
];

const campusEdges: CampusEdge[] = [
  { from: 'main-gate', to: 'admin', minutes: 2, meters: 140, accessible: true, via: 'Founders Walk' },
  { from: 'admin', to: 'library', minutes: 3, meters: 190, accessible: true, via: 'Knowledge Avenue' },
  { from: 'admin', to: 'humanities', minutes: 4, meters: 250, accessible: true, via: 'West Garden Path' },
  { from: 'library', to: 'humanities', minutes: 3, meters: 175, accessible: false, via: 'Library Steps' },
  { from: 'library', to: 'student-center', minutes: 2, meters: 125, accessible: true, via: 'Central Walk' },
  { from: 'humanities', to: 'auditorium', minutes: 3, meters: 185, accessible: true, via: 'Arts Promenade' },
  { from: 'auditorium', to: 'student-center', minutes: 3, meters: 170, accessible: true, via: 'Forum Walk' },
  { from: 'auditorium', to: 'innovation', minutes: 3, meters: 180, accessible: true, via: 'Ideas Lane' },
  { from: 'auditorium', to: 'sports', minutes: 4, meters: 235, accessible: true, via: 'North Greenway' },
  { from: 'student-center', to: 'cafeteria', minutes: 3, meters: 165, accessible: true, via: 'Commons Lane' },
  { from: 'student-center', to: 'innovation', minutes: 3, meters: 190, accessible: false, via: 'Innovation Steps' },
  { from: 'cafeteria', to: 'residence', minutes: 4, meters: 245, accessible: true, via: 'Residence Walk' },
  { from: 'cafeteria', to: 'engineering', minutes: 4, meters: 260, accessible: true, via: 'East Campus Road' },
  { from: 'innovation', to: 'engineering', minutes: 4, meters: 225, accessible: true, via: 'Creators Boulevard' },
  { from: 'innovation', to: 'science', minutes: 5, meters: 285, accessible: true, via: 'Research Rise' },
  { from: 'innovation', to: 'sports', minutes: 5, meters: 300, accessible: true, via: 'North Loop' },
  { from: 'engineering', to: 'science', minutes: 3, meters: 180, accessible: true, via: 'Laboratory Walk' },
  { from: 'engineering', to: 'residence', minutes: 5, meters: 310, accessible: true, via: 'East Residence Road' },
  { from: 'sports', to: 'science', minutes: 5, meters: 320, accessible: true, via: 'Athletics Greenway' },
];

const buildingById = Object.fromEntries(buildings.map(building => [building.id, building])) as Record<BuildingId, CampusBuilding>;

function findRoute(start: BuildingId, destination: BuildingId, accessibleOnly: boolean) {
  if (start === destination) return { ids: [start], edges: [] as CampusEdge[] };

  const distances = new Map<BuildingId, number>(buildings.map(building => [building.id, Number.POSITIVE_INFINITY]));
  const previous = new Map<BuildingId, { node: BuildingId; edge: CampusEdge }>();
  const unvisited = new Set<BuildingId>(buildings.map(building => building.id));
  distances.set(start, 0);

  while (unvisited.size) {
    const current = Array.from(unvisited).reduce<BuildingId | null>((closest, id) => {
      if (!closest) return id;
      return (distances.get(id) ?? Infinity) < (distances.get(closest) ?? Infinity) ? id : closest;
    }, null);

    if (!current || !Number.isFinite(distances.get(current))) break;
    unvisited.delete(current);
    if (current === destination) break;

    campusEdges.forEach(edge => {
      if (accessibleOnly && !edge.accessible) return;
      if (edge.from !== current && edge.to !== current) return;
      const neighbour = edge.from === current ? edge.to : edge.from;
      if (!unvisited.has(neighbour)) return;
      const nextDistance = (distances.get(current) ?? Infinity) + edge.minutes;
      if (nextDistance < (distances.get(neighbour) ?? Infinity)) {
        distances.set(neighbour, nextDistance);
        previous.set(neighbour, { node: current, edge });
      }
    });
  }

  if (!previous.has(destination)) return { ids: [start], edges: [] as CampusEdge[] };

  const ids: BuildingId[] = [destination];
  const routeEdges: CampusEdge[] = [];
  let cursor = destination;
  while (cursor !== start) {
    const step = previous.get(cursor);
    if (!step) break;
    ids.unshift(step.node);
    routeEdges.unshift(step.edge);
    cursor = step.node;
  }

  return { ids, edges: routeEdges };
}

function BuildingPicker({ label, value, onChange, accent }: { label: string; value: BuildingId; onChange: (value: BuildingId) => void; accent: string }) {
  return (
    <label className="group relative block min-w-0 flex-1 rounded-[1.35rem] border border-white/10 bg-white/[0.045] px-4 py-3 transition focus-within:border-lime-300/45 focus-within:bg-white/[0.07]">
      <span className={`mb-1 flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.22em] ${accent}`}><MapPin className="h-3 w-3" />{label}</span>
      <select value={value} onChange={event => onChange(event.target.value as BuildingId)} className="w-full appearance-none bg-transparent pr-7 text-sm font-black text-white outline-none">
        {buildings.map(building => <option key={building.id} value={building.id} className="bg-[#0d0b13]">{building.label}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 text-white/35 transition group-focus-within:rotate-180" />
    </label>
  );
}

export default function CampusMapPage() {
  const [start, setStart] = useState<BuildingId>('main-gate');
  const [destination, setDestination] = useState<BuildingId>('innovation');
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [guiding, setGuiding] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const route = useMemo(() => findRoute(start, destination, accessibleOnly), [start, destination, accessibleOnly]);
  const minutes = route.edges.reduce((total, edge) => total + edge.minutes, 0);
  const meters = route.edges.reduce((total, edge) => total + edge.meters, 0);
  const routePoints = route.ids.map(id => `${buildingById[id].x},${buildingById[id].y}`).join(' ');
  const liveBuilding = route.ids[Math.min(activeStep, route.ids.length - 1)] ?? start;

  const resetGuidance = () => {
    setGuiding(false);
    setActiveStep(0);
  };

  const changeStart = (value: BuildingId) => {
    setStart(value);
    if (value === destination) setDestination(start);
    resetGuidance();
  };

  const changeDestination = (value: BuildingId) => {
    if (value !== start) setDestination(value);
    resetGuidance();
  };

  const swapRoute = () => {
    setStart(destination);
    setDestination(start);
    resetGuidance();
  };

  return (
    <DashboardLayout>
      <div className="pt-16 sm:pt-14">
        <section className="relative overflow-hidden rounded-[2.5rem] bg-[#efeee8] px-6 py-10 text-black sm:px-10 sm:py-14 lg:px-14">
          <div className="absolute -right-16 -top-28 h-80 w-80 rounded-full bg-lime-300 blur-[1px]" />
          <div className="absolute bottom-0 right-24 h-40 w-40 rounded-full bg-fuchsia-300/70 blur-3xl" />
          <div className="relative max-w-5xl">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]"><LocateFixed className="h-4 w-4" />Campus wayfinding · prototype map</p>
            <h1 className="mt-6 text-5xl font-black leading-[0.86] tracking-[-0.07em] sm:text-7xl lg:text-[6.8rem]">FROM HERE<br />TO <span className="font-serif italic font-normal text-black/40">there.</span></h1>
            <p className="mt-7 max-w-2xl text-base font-medium leading-relaxed text-black/55 sm:text-lg">Pick any two campus buildings. We&apos;ll connect the blocks, avoid inaccessible shortcuts when needed, and turn the walk into a clear story.</p>
          </div>
          <div className="relative mt-10 flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-[0.16em]">
            <span className="rounded-full bg-black px-4 py-2 text-white">12 mapped buildings</span>
            <span className="rounded-full border border-black/15 px-4 py-2">19 connected paths</span>
            <span className="rounded-full border border-black/15 px-4 py-2">Accessible routing</span>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(330px,.5fr)]">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0d0b13] shadow-[0_30px_100px_rgba(0,0,0,.32)]">
            <header className="border-b border-white/10 p-4 sm:p-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <BuildingPicker label="Starting point" value={start} onChange={changeStart} accent="text-cyan-300" />
                <button type="button" onClick={swapRoute} aria-label="Swap starting point and destination" className="mx-auto flex h-11 w-11 shrink-0 rotate-90 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:rotate-180 hover:border-lime-300/40 hover:text-lime-300 lg:rotate-0"><RefreshCw className="h-4 w-4" /></button>
                <BuildingPicker label="Destination" value={destination} onChange={changeDestination} accent="text-lime-300" />
              </div>
            </header>

            <div className="relative min-h-[520px] overflow-hidden bg-[#111017] sm:min-h-[640px]">
              <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-white/55 backdrop-blur-xl">Click a building to reroute</span>
                <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-lime-300 backdrop-blur-xl">Live path</span>
              </div>
              <svg viewBox="0 0 1000 660" role="img" aria-label={`Campus route from ${buildingById[start].label} to ${buildingById[destination].label}`} className="absolute inset-0 h-full w-full">
                <defs>
                  <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,.035)" strokeWidth="1" /></pattern>
                  <filter id="route-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  <linearGradient id="route-gradient" x1="0" x2="1"><stop stopColor="#67e8f9" /><stop offset="1" stopColor="#bef264" /></linearGradient>
                </defs>
                <rect width="1000" height="660" fill="url(#map-grid)" />
                <path d="M60 365C180 320 260 365 350 330s160-95 265-80 168 78 325 25" fill="none" stroke="#bef264" strokeOpacity=".055" strokeWidth="90" strokeLinecap="round" />
                <path d="M120 620C300 540 470 590 650 540s220-20 330 25" fill="none" stroke="#67e8f9" strokeOpacity=".045" strokeWidth="55" strokeLinecap="round" />

                {campusEdges.map(edge => {
                  const from = buildingById[edge.from];
                  const to = buildingById[edge.to];
                  return <line key={`${edge.from}-${edge.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={edge.accessible ? '#35333d' : '#2b2932'} strokeWidth="9" strokeLinecap="round" strokeDasharray={edge.accessible ? undefined : '8 10'} />;
                })}

                {route.ids.length > 1 ? (
                  <>
                    <polyline points={routePoints} fill="none" stroke="#bef264" strokeOpacity=".18" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" filter="url(#route-glow)" />
                    <motion.polyline points={routePoints} fill="none" stroke="url(#route-gradient)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="16 13" animate={{ strokeDashoffset: [0, -58] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} />
                  </>
                ) : null}

                {buildings.map(building => {
                  const isStart = building.id === start;
                  const isDestination = building.id === destination;
                  const isOnRoute = route.ids.includes(building.id);
                  const isLive = building.id === liveBuilding && guiding;
                  return (
                    <g key={building.id} transform={`translate(${building.x - 57} ${building.y - 34})`} role="button" tabIndex={0} aria-label={`Route to ${building.label}`} onClick={() => changeDestination(building.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') changeDestination(building.id); }} className="cursor-pointer outline-none">
                      {isLive ? <motion.circle cx="57" cy="34" r="44" fill="none" stroke="#67e8f9" strokeWidth="3" initial={{ opacity: 1, scale: 0.65 }} animate={{ opacity: 0, scale: 1.35 }} transition={{ repeat: Infinity, duration: 1.4 }} /> : null}
                      <rect width="114" height="68" rx="17" fill={isStart || isDestination ? building.color : isOnRoute ? '#24222a' : '#1a181f'} stroke={isStart || isDestination ? '#ffffff' : isOnRoute ? building.color : '#39363f'} strokeOpacity={isStart || isDestination ? '.8' : '.55'} strokeWidth={isStart || isDestination ? '3' : '1.5'} />
                      <path d="M13 16h88M20 11h74" stroke={isStart || isDestination ? '#000' : building.color} strokeOpacity=".28" strokeWidth="3" strokeLinecap="round" />
                      <text x="13" y="35" fill={isStart || isDestination ? '#0b0a10' : '#f7f7f4'} fontSize="12" fontWeight="900">{building.mapLabel}</text>
                      <text x="13" y="51" fill={isStart || isDestination ? '#0b0a10' : '#ffffff'} fillOpacity={isStart || isDestination ? '.55' : '.35'} fontSize="8" fontWeight="800" letterSpacing="1.4">{building.code}</text>
                      {isStart ? <circle cx="101" cy="13" r="8" fill="#67e8f9" stroke="#0b0a10" strokeWidth="3" /> : null}
                      {isDestination ? <circle cx="101" cy="13" r="8" fill="#bef264" stroke="#0b0a10" strokeWidth="3" /> : null}
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-5 left-5 right-5 flex flex-col justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-black/65 p-4 backdrop-blur-2xl sm:flex-row sm:items-center">
                <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300 text-black"><Navigation className="h-5 w-5" /></span><div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">Fastest route ready</p><p className="mt-0.5 text-sm font-black">{buildingById[start].mapLabel} <ArrowRight className="mx-1 inline h-3.5 w-3.5 text-lime-300" /> {buildingById[destination].mapLabel}</p></div></div>
                <div className="flex gap-5"><div><strong className="block text-xl font-black">{minutes}<span className="ml-1 text-xs text-white/35">min</span></strong><span className="text-[9px] uppercase tracking-wider text-white/30">Walking</span></div><div><strong className="block text-xl font-black">{meters}<span className="ml-1 text-xs text-white/35">m</span></strong><span className="text-[9px] uppercase tracking-wider text-white/30">Distance</span></div></div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.035]">
              <header className="border-b border-white/10 p-6">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-fuchsia-300">Your walking story</p>
                <div className="mt-3 flex items-end justify-between gap-4"><h2 className="text-4xl font-black leading-none tracking-[-0.05em]">{minutes} MIN.<br /><span className="font-serif italic font-normal text-white/35">door to door.</span></h2><RouteIcon className="h-7 w-7 text-lime-300" /></div>
              </header>

              <div className="p-3">
                {route.edges.map((edge, index) => {
                  const nextBuilding = buildingById[route.ids[index + 1]];
                  const active = guiding && activeStep === index;
                  const completed = guiding && activeStep > index;
                  return (
                    <motion.article key={`${edge.from}-${edge.to}`} layout className={`relative flex gap-3 rounded-[1.35rem] p-3.5 transition ${active ? 'bg-lime-300 text-black' : completed ? 'bg-white/[0.04] opacity-40' : ''}`}>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${active ? 'bg-black text-lime-300' : completed ? 'bg-lime-300 text-black' : 'border border-white/10 bg-white/5 text-white/50'}`}>{completed ? <Check className="h-4 w-4" /> : index + 1}</span>
                      <div className="min-w-0"><h3 className="text-sm font-black">Walk to {nextBuilding.mapLabel}</h3><p className={`mt-1 text-[11px] leading-relaxed ${active ? 'text-black/60' : 'text-white/35'}`}>Follow {edge.via} · {edge.meters} m</p></div>
                      <ChevronRight className={`ml-auto mt-2 h-4 w-4 shrink-0 ${active ? 'text-black' : 'text-white/20'}`} />
                    </motion.article>
                  );
                })}
              </div>

              <div className="border-t border-white/10 p-4">
                {!guiding ? <button type="button" onClick={() => { setGuiding(true); setActiveStep(0); }} className="flex w-full items-center justify-center gap-2 rounded-full bg-lime-300 px-5 py-3.5 text-sm font-black text-black transition hover:bg-white"><Navigation className="h-4 w-4" />Start walking guidance</button> : <button type="button" onClick={() => activeStep < route.edges.length - 1 ? setActiveStep(step => step + 1) : resetGuidance()} className="flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3.5 text-sm font-black text-black transition hover:bg-white">{activeStep < route.edges.length - 1 ? 'Next checkpoint' : 'Finish route'}<ArrowRight className="h-4 w-4" /></button>}
              </div>
            </section>

            <button type="button" role="switch" aria-checked={accessibleOnly} onClick={() => { setAccessibleOnly(value => !value); resetGuidance(); }} className={`flex items-center gap-4 rounded-[2rem] border p-5 text-left transition ${accessibleOnly ? 'border-cyan-300/40 bg-cyan-300 text-black' : 'border-white/10 bg-white/[0.035] hover:border-cyan-300/25'}`}>
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accessibleOnly ? 'bg-black text-cyan-300' : 'bg-cyan-300 text-black'}`}><Accessibility className="h-6 w-6" /></span>
              <span><strong className="block text-sm font-black">Step-free route</strong><span className={`mt-1 block text-[10px] leading-relaxed ${accessibleOnly ? 'text-black/55' : 'text-white/35'}`}>Prioritise ramps, lifts and accessible paths.</span></span>
              <span className={`ml-auto h-6 w-11 rounded-full p-1 transition ${accessibleOnly ? 'bg-black' : 'bg-white/10'}`}><span className={`block h-4 w-4 rounded-full transition ${accessibleOnly ? 'translate-x-5 bg-cyan-300' : 'bg-white/50'}`} /></span>
            </button>

            <section className="rounded-[2rem] bg-fuchsia-300 p-6 text-black">
              <ShieldCheck className="h-6 w-6" />
              <h2 className="mt-5 text-2xl font-black tracking-[-0.04em]">No location surveillance.</h2>
              <p className="mt-2 text-xs font-medium leading-relaxed text-black/60">This prototype calculates a route from the starting building you choose. It does not collect or store live GPS history.</p>
            </section>
          </aside>
        </section>

        <section className="my-6 grid gap-4 rounded-[2.5rem] border border-white/10 bg-white/[0.025] p-6 sm:grid-cols-3 sm:p-8">
          {[{ icon: Building2, value: '12', label: 'Campus buildings mapped' }, { icon: Footprints, value: `${meters}m`, label: 'Current route distance' }, { icon: Clock3, value: `${minutes} min`, label: 'Estimated walking time' }].map(stat => <article key={stat.label} className="flex items-center gap-4 rounded-[1.5rem] bg-white/[0.035] p-5"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-lime-300"><stat.icon className="h-5 w-5" /></span><div><strong className="text-2xl font-black">{stat.value}</strong><p className="text-[10px] text-white/35">{stat.label}</p></div></article>)}
        </section>
      </div>
    </DashboardLayout>
  );
}
