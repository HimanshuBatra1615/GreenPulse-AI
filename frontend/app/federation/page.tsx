"use client";

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck } from 'lucide-react';

const accuracyTrend = Array.from({length: 42}).map((_, i) => ({
    round: i+1,
    acc: 70 + (i/42)*22 + Math.random()*2
}));

export default function FederationPage() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            
            <div className="glass p-6 rounded-3xl flex items-center justify-between border-t-4 border-t-blue-500">
                <div>
                    <h2 className="text-2xl font-display font-medium text-white mb-2 flex items-center gap-2">
                        <ShieldCheck className="text-blue-500" />
                        GreenPulse Federated Cluster
                    </h2>
                    <p className="text-gray-400 font-mono text-sm">Privacy Guarantee: Raw meter data never leaves your node. Only encrypted model gradient weights are synced.</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-mono">Current FL Round</p>
                    <p className="text-4xl font-display font-bold text-blue-400">#42</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass p-6 rounded-3xl h-[400px]">
                    <h3 className="text-lg font-display font-medium text-white mb-6">Global Model Accuracy Over Time</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <LineChart data={accuracyTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a3b2a" vertical={false} />
                            <XAxis dataKey="round" stroke="#4a5a4a" tickFormatter={(v) => `R${v}`} tick={{fill: '#8a9a8a', fontFamily: 'monospace'}} />
                            <YAxis stroke="#4a5a4a" tick={{fill: '#8a9a8a', fontFamily: 'monospace'}} domain={[60, 100]} />
                            <Tooltip contentStyle={{backgroundColor: '#121a12', borderColor: '#2a3b2a', borderRadius: '8px'}} itemStyle={{color: '#fff', fontFamily: 'monospace'}} />
                            <Line type="monotone" dataKey="acc" stroke="#3b82f6" strokeWidth={3} dot={false} name="Accuracy (%)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass p-6 rounded-3xl">
                    <h3 className="text-lg font-display font-medium text-white mb-6">Connected SME Nodes</h3>
                    <div className="space-y-4">
                        {[
                            {n: "Your Facility", ind: "Textile", acc: 92.4, status: 'Synced', s_color: 'text-neon bg-neon/10 border-neon/30'},
                            {n: "KnitWear Alpha", ind: "Textile", acc: 91.8, status: 'Synced', s_color: 'text-neon bg-neon/10 border-neon/30'},
                            {n: "Sunrise Cold Storage", ind: "Cold Chain", acc: 88.5, status: 'Syncing', s_color: 'text-blue-400 bg-blue-400/10 border-blue-400/30'},
                            {n: "Apex Auto Parts", ind: "Manufacturing", acc: 85.2, status: 'Syncing', s_color: 'text-blue-400 bg-blue-400/10 border-blue-400/30'},
                            {n: "Ganga Mills", ind: "Textile", acc: 81.1, status: 'Offline', s_color: 'text-gray-400 bg-gray-500/10 border-gray-500/30'},
                        ].map((node, index) => (
                            <div key={index} className="flex flex-col gap-2 p-3 bg-surfaceHover rounded-xl border border-borderC">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-200">{node.n}</span>
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${node.s_color}`}>{node.status}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500 font-mono mt-1">
                                    <span>{node.ind}</span>
                                    <span>Acc: {node.acc}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}
