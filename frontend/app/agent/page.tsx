"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function RLAgentPage() {
  const [autoApprove, setAutoApprove] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-medium text-white">RL Agent Optimization (PPO)</h2>
          
          <div className="flex items-center gap-3">
             <span className="text-sm font-mono text-gray-400">Auto-execute decisions</span>
             <button 
                onClick={() => setAutoApprove(!autoApprove)}
                className={`w-12 h-6 rounded-full relative transition-colors ${autoApprove ? 'bg-neon' : 'bg-surfaceHover border border-borderC'}`}
             >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${autoApprove ? 'left-7' : 'left-1'}`}></div>
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 glass p-6 rounded-3xl min-h-[400px]">
             <h3 className="text-lg font-display font-bold text-white mb-6">Daily Policy Heatmap</h3>
             <p className="text-gray-400 text-sm mb-6 max-w-2xl">
                 The reinforcement learning agent determines the optimal scheduling of heavy machinery loads against dynamic grid tariffs. Red blocks indicate recommended load-shifting away from peak.
             </p>
             
             {/* Mock Heatmap CSS Grid */}
             <div className="grid grid-cols-24 gap-1 h-24 mb-2">
                 {Array.from({length: 24}).map((_, i) => (
                    <div key={i} className="flex flex-col items-center justify-end group cursor-pointer relative">
                        <div className={`w-full rounded-sm transition ${
                            i >= 14 && i <= 18 ? 'bg-red-500/80 h-[80%]' : 
                            i >= 8 && i <= 13 ? 'bg-neon/60 h-[40%]' : 
                            i >= 20 ? 'bg-blue-500/80 h-[90%]' : 
                            'bg-surfaceHover h-[20%]'
                        }`}></div>
                        
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-black p-2 rounded text-[10px] font-mono whitespace-nowrap z-10 border border-borderC">
                            {i}:00 | {i >= 14 && i <= 18 ? 'SHIFT' : i >= 20 ? 'RUN HEAVY' : 'NORMAL'}
                        </div>
                    </div>
                 ))}
             </div>
             <div className="grid grid-cols-24 gap-1 text-[10px] text-gray-600 font-mono text-center">
                 {Array.from({length: 24}).map((_, i) => <div key={i}>{i}</div>)}
             </div>
             
          </div>

          <div className="space-y-6">
              <div className="glass p-5 rounded-2xl">
                 <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Load Shifted (MTD)</span>
                 <h4 className="text-3xl font-display font-bold text-white mt-1">450 <span className="text-sm font-mono text-neon">kWh</span></h4>
              </div>
              
              <div className="glass p-5 rounded-2xl">
                 <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Policy Reward</span>
                 <h4 className="text-3xl font-display font-bold text-white mt-1">+8.4<span className="text-sm font-mono text-blue-400">%</span></h4>
              </div>
          </div>
       </div>

       <div className="glass p-6 rounded-3xl">
           <h3 className="text-lg font-display font-bold text-white mb-6">Recent Agent Actions</h3>
           <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="border-b border-borderC text-xs uppercase tracking-wider text-gray-500 font-mono">
                         <th className="pb-3 px-4">Time</th>
                         <th className="pb-3 px-4">Action Taken</th>
                         <th className="pb-3 px-4">Impact</th>
                         <th className="pb-3 px-4">Est. Savings</th>
                         <th className="pb-3 px-4 text-right">Status</th>
                      </tr>
                   </thead>
                   <tbody className="text-sm text-gray-300">
                      {[
                        { t: '14:25', a: 'Shift HVAC Load', i: '-45 kW from Peak', s: '₹ 320', st: 'Executed' },
                        { t: '11:00', a: 'Pre-cool Storage', i: '+20 kW off-peak', s: '₹ 150', st: 'Executed' },
                        { t: '09:15', a: 'Release VPP Bid', i: 'Sold 15 kW Flexibility', s: '₹ 450', st: 'Pending Grid' },
                      ].map((log, i) => (
                        <tr key={i} className="border-b border-borderC/50 hover:bg-surfaceHover/50 transition">
                           <td className="py-4 px-4 font-mono text-gray-500">{log.t}</td>
                           <td className="py-4 px-4">{log.a}</td>
                           <td className="py-4 px-4 text-neon">{log.i}</td>
                           <td className="py-4 px-4 font-mono font-medium">{log.s}</td>
                           <td className="py-4 px-4 text-right">
                              <span className={`px-2 py-1 rounded text-xs border ${log.st === 'Executed' ? 'bg-neon/10 text-neon border-neon/30' : 'bg-amber-500/10 text-amber-500 border-amber-500/30'}`}>{log.st}</span>
                           </td>
                        </tr>
                      ))}
                   </tbody>
               </table>
           </div>
       </div>

    </div>
  );
}
