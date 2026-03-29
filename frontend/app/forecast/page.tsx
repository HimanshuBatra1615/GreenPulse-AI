"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// Synthetic forecast data
const generateForecastData = () => {
  return Array.from({ length: 72 }).map((_, i) => ({
    hour: i,
    val: 80 + Math.random() * 20 + Math.sin(i / 12 * Math.PI) * 40,
    lower: 70 + Math.sin(i / 12 * Math.PI) * 40,
    upper: 90 + Math.sin(i / 12 * Math.PI) * 40,
  }));
};

const data = generateForecastData();

export default function ForecastPage() {
  const [horizon, setHorizon] = useState<'24hr' | '48hr' | '72hr'>('72hr');
  
  const displayData = data.slice(0, horizon === '24hr' ? 24 : horizon === '48hr' ? 48 : 72);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-medium text-white">LSTM Demand Forecast</h2>
          <div className="flex bg-surfaceHover p-1 rounded-lg border border-borderC">
             {['24hr', '48hr', '72hr'].map(h => (
                <button
                  key={h}
                  onClick={() => setHorizon(h as any)}
                  className={`px-4 py-1.5 text-sm font-mono rounded-md transition ${horizon === h ? 'bg-neon text-background font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  {h}
                </button>
             ))}
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="glass p-5 rounded-2xl flex flex-col justify-between">
               <span className="text-gray-400 text-sm font-medium">MAPE Accuracy</span>
               <span className="text-4xl font-display font-bold text-neon mt-2 border-b border-neon/20 pb-4 inline-block">4.21%</span>
               <p className="text-xs text-gray-500 mt-4 leading-relaxed font-mono">Mean Absolute Percentage Error across trailing 30-day validation set.</p>
           </div>
           
           <div className="glass p-5 rounded-2xl flex flex-col justify-between">
               <span className="text-gray-400 text-sm font-medium">Forecast Confidence</span>
               <span className="text-4xl font-display font-bold text-white mt-2 border-b border-borderC pb-4 inline-block">±8.5 kW</span>
               <p className="text-xs text-gray-500 mt-4 leading-relaxed font-mono">95% Confidence Interval band deviation at peak load hours.</p>
           </div>

           <div className="glass p-5 rounded-2xl flex flex-col justify-between">
               <span className="text-gray-400 text-sm font-medium">Next Peak Predicted</span>
               <span className="text-4xl font-display font-bold text-red-500 mt-2 border-b border-red-500/20 pb-4 inline-block">14:30</span>
               <p className="text-xs text-gray-500 mt-4 leading-relaxed font-mono">Estimated peak grid tariff block crossing 142kW threshold.</p>
           </div>
       </div>

       <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="glass p-6 rounded-3xl h-[500px] relative">
            <h3 className="text-lg font-display font-bold text-white mb-6">Forward Trajectory ({horizon})</h3>
            
            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3b2a" vertical={false} />
                    <XAxis dataKey="hour" stroke="#4a5a4a" tickFormatter={(v) => `+${v}h`} tick={{fill: '#8a9a8a', fontFamily: 'monospace'}} />
                    <YAxis stroke="#4a5a4a" tick={{fill: '#8a9a8a', fontFamily: 'monospace'}} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{backgroundColor: '#121a12', borderColor: '#2a3b2a', borderRadius: '8px'}} itemStyle={{color: '#fff', fontFamily: 'monospace'}} />
                    
                    <Line type="monotone" dataKey="val" stroke="#2ecc71" strokeWidth={3} dot={false} name="Predicted kW" />
                    
                    <ReferenceLine x={14} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Peak Demand', fill: '#ef4444', fontSize: 12, fontFamily: 'monospace' }} />
                </LineChart>
            </ResponsiveContainer>
       </motion.div>
    </div>
  );
}
