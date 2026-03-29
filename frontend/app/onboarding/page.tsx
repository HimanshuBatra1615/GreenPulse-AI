"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function OnboardingPage() {
  const [form, setForm] = useState({ name: '', industry: 'Manufacturing', location: '', avg_monthly_bill: 50000 });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
     supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setUserId(session.user.id);
        else window.location.href = '/login';
     });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!userId) return;
      
      setLoading(true);
      const { error } = await supabase.from('sme_profiles').insert([{
          id: userId,
          name: form.name,
          industry: form.industry,
          location: form.location,
          avg_monthly_bill: form.avg_monthly_bill
      }]);
      
      setLoading(false);
      if (error) {
          alert("Error saving profile: " + error.message);
      } else {
          window.location.href = '/';
      }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full glass p-8 rounded-3xl">
        <h2 className="text-3xl font-display font-medium text-white mb-2">Establish Organization Baseline</h2>
        <p className="text-gray-400 text-sm font-mono mb-8">Personalize your RL agent and demand models.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-xs text-gray-400 font-mono mb-2 uppercase tracking-wider">Facility Name</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full bg-surfaceHover border border-borderC rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none text-sm" placeholder="Acme Textiles" />
               </div>
               <div>
                  <label className="block text-xs text-gray-400 font-mono mb-2 uppercase tracking-wider">Industry Type</label>
                  <select required value={form.industry} onChange={(e) => setForm({...form, industry: e.target.value})} className="w-full bg-surfaceHover border border-borderC rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none text-sm appearance-none">
                      <option>Textile & Weaving</option>
                      <option>Cold Storage</option>
                      <option>Manufacturing</option>
                      <option>Hospitality</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs text-gray-400 font-mono mb-2 uppercase tracking-wider">Location (City)</label>
                  <input required type="text" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} className="w-full bg-surfaceHover border border-borderC rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none text-sm" placeholder="Mumbai" />
               </div>
               <div>
                  <label className="block text-xs text-gray-400 font-mono mb-2 uppercase tracking-wider">Avg Monthly Bill (₹)</label>
                  <input required type="number" value={form.avg_monthly_bill} onChange={(e) => setForm({...form, avg_monthly_bill: Number(e.target.value)})} className="w-full bg-surfaceHover border border-borderC rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none text-sm font-mono" />
               </div>
           </div>
           
           <div className="pt-6 border-t border-borderC">
               <button type="submit" disabled={loading} className="w-full md:w-auto px-8 py-3 bg-neon text-background font-bold rounded-xl hover:bg-white transition float-right">
                  {loading ? 'Initializing Agent...' : 'Initialize GreenPulse'}
               </button>
               <div className="clear-both"></div>
           </div>
        </form>
      </div>
    </div>
  );
}
