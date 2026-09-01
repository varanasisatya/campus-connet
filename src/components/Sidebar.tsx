'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, CalendarDays, Search, MessageSquare, LogOut, MapPinned, ShieldCheck } from 'lucide-react';
import { logoutUser } from '@/firebase/auth';
import { useRouter } from 'next/navigation';

import { useUserStore } from '@/store/userStore';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: CalendarDays, label: 'Events', href: '/events' },
  { icon: MapPinned, label: 'Campus Map', href: '/campus-map' },
  { icon: Search, label: 'Lost & Found', href: '/lost-found' },
  { icon: MessageSquare, label: 'Campus Feed', href: '/feed' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUserStore();
  const visibleMenuItems = user?.role === 'admin' || user?.role === 'moderator'
    ? [...menuItems, { icon: ShieldCheck, label: 'Command Center', href: '/admin' }]
    : menuItems;

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
  };

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center border-t border-white/10 bg-[#0d0b13]/90 px-3 backdrop-blur-2xl md:bottom-auto md:top-0 md:h-screen md:w-40 md:flex-col md:border-r md:border-t-0 md:px-0"
    >
      <div className="hidden py-8 md:block">
        <h2 className="text-xl font-black tracking-tight">
          Campus<span className="gradient-text">AI</span>
        </h2>
      </div>

      <nav className="flex flex-1 items-center justify-around md:flex-col md:justify-center md:gap-5">
        {visibleMenuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                aria-label={item.label}
                className={cn(
                  'group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300',
                  isActive
                    ? 'text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 -z-10 rounded-2xl bg-lime-300 shadow-[0_0_28px_rgba(190,242,100,.25)]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {!isActive && (
                   <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl -z-10" />
                )}
                <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="pointer-events-none absolute left-14 hidden whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-black opacity-0 transition group-hover:opacity-100 md:block">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="hidden pb-6 md:mt-auto md:block">
        {user && (
          <div className="mb-4 flex justify-center">
            <div title={user.displayName || 'Student'} className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-300 font-bold text-black shadow-lg">
              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
          </div>
        )}
        <button 
          onClick={handleLogout}
          aria-label="Logout"
          className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl text-white/40 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </motion.aside>
  );
}
