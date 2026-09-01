'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, googleLogin } from '@/firebase/auth';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { AnimatedGradient } from '@/components/ui/AnimatedGradient';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(email, password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast.success('Successfully logged in with Google');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
      {/* Background Glow */}
      <AnimatedGradient />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 p-4"
      >
        <GlassCard className="p-10 rounded-3xl" hoverEffect={false}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black mb-2">Welcome Back</h1>
            <p className="text-slate-400">Sign in to continue to CampusAI</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                required
                className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 input-glow"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 input-glow"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
            <span className="w-1/5 border-b border-slate-700"></span>
            <span>OR CONTINUE WITH</span>
            <span className="w-1/5 border-b border-slate-700"></span>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="mt-6 w-full flex items-center justify-center gap-3 p-4 rounded-xl glass hover:bg-white/10 transition-colors border border-slate-700"
          >
            <FcGoogle className="w-6 h-6" />
            <span className="font-medium">Google</span>
          </button>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
