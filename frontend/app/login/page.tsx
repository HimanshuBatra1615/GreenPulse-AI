"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Zap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (isSignUp: boolean) => {
    setLoading(true);
    let result;
    if (isSignUp) {
        result = await supabase.auth.signUp({ email, password });
    } else {
        result = await supabase.auth.signInWithPassword({ email, password });
    }
    
    setLoading(false);
    if (result.error) {
        alert(result.error.message);
    } else {
        window.location.href = isSignUp ? '/onboarding' : '/';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full glass p-8 rounded-3xl space-y-8">
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-neon/10 border border-neon/30 rounded-2xl flex items-center justify-center mb-4">
             <Zap className="text-neon" size={32} />
          </div>
          <h2 className="text-3xl font-display font-medium text-white">GreenPulse AI</h2>
          <p className="text-gray-400 mt-2 text-sm font-mono">SME Energy Intelligence</p>
        </div>
        
        <div className="space-y-4">
           <div>
              <label className="block text-xs text-gray-400 font-mono mb-1 uppercase tracking-wider">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surfaceHover border border-borderC rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon transition text-sm" placeholder="operator@smefabric.com" />
           </div>
           <div>
              <label className="block text-xs text-gray-400 font-mono mb-1 uppercase tracking-wider">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-surfaceHover border border-borderC rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon transition text-sm" placeholder="••••••••" />
           </div>
           
           <div className="pt-4 flex flex-col gap-3">
               <button onClick={() => handleAuth(false)} disabled={loading} className="w-full bg-neon text-background font-bold rounded-xl py-3 hover:bg-white transition flex items-center justify-center">
                  {loading ? 'Authenticating...' : 'Secure Login'}
               </button>
               <button onClick={() => handleAuth(true)} disabled={loading} className="w-full bg-transparent border border-neon/30 text-neon font-medium rounded-xl py-3 hover:bg-neon/10 transition flex items-center justify-center">
                  Register New Organization
               </button>
           </div>
        </div>
      </div>
    </div>
  );
}
