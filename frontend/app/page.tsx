"use client";

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Dummy data to show charts instantly while UI connects
const initialChartData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  actual: 100 + Math.random() * 50,
  forecast: 100 + Math.random() * 50 + (i > 12 ? 20 : 0)
}));

export default function Dashboard() {
  const [liveKw, setLiveKw] = useState(128.5);
  const [chartData, setChartData] = useState(initialChartData);
  const [anomaly, setAnomaly] = useState(false);
  
  useEffect(() => {
     const socket = io('http://localhost:8000');
     socket.on('live_reading', (data) => {
         setLiveKw(data.consumption_kw);
         if (data.is_anomaly) setAnomaly(true);
         else setAnomaly(false);
         // Simulate pushing to chart data over time...
     });
     return () => { socket.disconnect() }
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <KPICard title="Live Consumption" value={`${liveKw.toFixed(1)} kW`} color="neon" subtitle="Actual Load" alert={anomaly} />
         <KPICard title="Monthly Savings" value="₹ 14,250" color="blue-500" subtitle="vs Baseline" />
         <KPICard title="CO₂ Avoided" value="2.1 t" color="teal-400" subtitle="Equivalent to 12 trees" />
         <KPICard title="VPP Revenue" value="₹ 3,400" color="amber-400" subtitle="Sold back to grid" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Column */}
          <div className="lg:col-span-2 space-y-6">
             <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="glass p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neonDark to-neon"></div>
                <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center justify-between">
                   LSTM Demand Forecast (72hr)
                   <span className="text-xs bg-neon/20 text-neon px-2 py-1 rounded font-mono border border-neon/30">MAPE <span className="text-white">4.2%</span></span>
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a3b2a" vertical={false} />
                            <XAxis dataKey="time" stroke="#4a5a4a" tick={{fill: '#8a9a8a', fontSize: 12, fontFamily: 'monospace'}} />
                            <YAxis stroke="#4a5a4a" tick={{fill: '#8a9a8a', fontSize: 12, fontFamily: 'monospace'}} />
                            <Tooltip contentStyle={{backgroundColor: '#121a12', borderColor: '#2a3b2a', borderRadius: '8px'}} itemStyle={{color: '#fff', fontFamily: 'monospace'}} />
                            <Line type="monotone" dataKey="actual" stroke="#2ecc71" strokeWidth={3} dot={false} name="Actual (kW)" />
                            <Line type="monotone" dataKey="forecast" stroke="#4facfe" strokeDasharray="5 5" strokeWidth={2} dot={false} name="Forecast (kW)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
             </motion.div>
             
             {/* LLM Recommendations */}
             <div className="glass p-5 rounded-2xl">
                 <h3 className="text-lg font-display font-bold text-white mb-4">AI Scheduling Priorities</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <RecCard priority="URGENT" text="Shift heavy weaving loads to 8 PM to avoid 3x peak tariff" saving="₹ 850" />
                    <RecCard priority="VPP" text="Commit 45kW flexibility to local grid dispatch in 2 hours" saving="₹ 400" />
                    <RecCard priority="OPTIMIZE" text="Pre-cool warehouse now; thermal mass holds temperature" saving="₹ 220" />
                 </div>
             </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
              {/* Federation Status */}
              <div className="glass p-5 rounded-2xl">
                 <h3 className="text-md font-display font-medium text-white mb-4 border-b border-borderC pb-2">Federation Status</h3>
                 <div className="space-y-4">
                    <NodeItem name="KnitWear Alpha" city="Tiruppur" progress={100} />
                    <NodeItem name="Sunrise Logistics" city="Pune" progress={85} />
                    <NodeItem name="Apex Auto" city="Chennai" progress={45} />
                    <NodeItem name="Ganga Mills" city="Surat" progress={10} />
                 </div>
                 <div className="mt-4 pt-4 border-t border-borderC">
                     <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
                        <span>Current FL Round</span>
                        <span className="text-neon">#42</span>
                     </div>
                 </div>
              </div>
              
              <div className="glass p-5 rounded-2xl relative">
                  <div className="absolute top-0 right-0 p-3"><span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span></div>
                  <h3 className="text-md font-display font-medium text-white mb-2">Isolation Forest</h3>
                  <p className="text-sm text-gray-400">Monitoring grid for equipment failure signatures. <span className="text-white font-medium ml-1">Normal Baseline</span></p>
                  <div className="h-[100px] mt-4">
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={chartData.slice(10,24)}>
                           <Area type="monotone" dataKey="actual" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                         </AreaChart>
                       </ResponsiveContainer>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, color, subtitle, alert }: { title: string, value: string, color: string, subtitle: string, alert?: boolean }) {
  const colorMap: any = {
    'neon': 'border-neon',
    'blue-500': 'border-blue-500',
    'teal-400': 'border-teal-400',
    'amber-400': 'border-amber-400',
  }
  return (
      <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} className={`glass p-5 rounded-xl border-t-4 ${colorMap[color]} relative overflow-hidden group`}>
         {alert && <div className="absolute inset-0 bg-red-500/10 animate-pulse border-2 border-red-500 z-10 rounded-xl"></div>}
         <p className="text-gray-400 text-sm font-medium mb-1 relative z-20">{title}</p>
         <h4 className="text-3xl font-display font-bold text-white relative z-20 tracking-tight">{value}</h4>
         <p className="text-xs text-gray-500 mt-2 font-mono relative z-20">{subtitle}</p>
         
         <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition duration-500"></div>
      </motion.div>
  )
}

function RecCard({ priority, text, saving }: { priority: string, text: string, saving: string }) {
    const pColor = priority === 'URGENT' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                   priority === 'VPP' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 
                   'bg-neon/20 text-neon border-neon/30';
    return (
        <div className="bg-surfaceHover border border-borderC p-4 rounded-xl hover:border-white/20 transition cursor-pointer flex flex-col justify-between">
            <div>
               <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border inline-block mb-3 ${pColor}`}>{priority}</span>
               <p className="text-sm text-gray-300 leading-snug">{text}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-borderC pt-3">
               <span className="text-xs text-gray-500 font-mono">Est. Saving</span>
               <span className="text-md font-bold text-white font-mono">{saving}</span>
            </div>
        </div>
    )
}

function NodeItem({ name, city, progress }: { name: string, city: string, progress: number }) {
    return (
        <div className="flex items-center justify-between">
            <div>
               <p className="text-sm font-medium text-gray-200">{name}</p>
               <p className="text-xs text-gray-500 font-mono">{city}</p>
            </div>
            <div className="w-24">
               <div className="flex justify-between text-[10px] text-gray-400 font-mono mb-1">
                  <span>Syncing</span>
                  <span>{progress}%</span>
               </div>
               <div className="h-1.5 w-full bg-surfaceHover rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{width: `${progress}%`}}></div>
               </div>
            </div>
        </div>
    )
}
