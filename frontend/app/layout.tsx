import { ReactNode } from 'react';
import './globals.css';
import Link from 'next/link';
import { Activity, BarChart2, Cpu, Globe, Zap, Settings } from 'lucide-react';

export const metadata = {
  title: 'GreenPulse AI',
  description: 'AI-powered energy intelligence platform for SMEs',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Syne:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="flex h-screen overflow-hidden bg-background font-sans text-gray-200">
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-borderC glass flex flex-col z-20">
          <div className="p-6 pb-2 border-b border-borderC">
            <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <Zap className="text-neon" size={28} />
              GreenPulse
            </h1>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavItem href="/" icon={<Activity size={20} />} label="Dashboard" />
            <NavItem href="/forecast" icon={<BarChart2 size={20} />} label="Forecast (LSTM)" />
            <NavItem href="/agent" icon={<Cpu size={20} />} label="RL Agent" />
            <NavItem href="/federation" icon={<Globe size={20} />} label="Federation Cluster" />
          </nav>

          {/* VPP Status Card in Sidebar */}
          <div className="p-4 border-t border-borderC">
            <div className="p-3 bg-neonDark/10 border border-neon/20 rounded-lg text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 font-medium font-mono text-xs">VPP STATUS</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon"></span>
                </span>
              </div>
              <p className="font-mono text-white">Active Grid Bid: <span className="text-neon ml-1">45kW</span></p>
            </div>
            <div className="mt-4 flex items-center justify-between text-gray-400 text-sm cursor-pointer hover:text-white transition">
               <span>Settings</span>
               <Settings size={18} />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
           {/* Top Navbar */}
           <header className="h-16 border-b border-borderC glass flex items-center justify-between px-6 z-10">
              <h2 className="text-xl font-display font-semibold text-white tracking-wide">Command Center</h2>
              
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 bg-surfaceHover px-3 py-1.5 rounded-full border border-borderC">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-neon"></span>
                    </span>
                    <span className="text-xs font-mono text-neon font-medium">Live · 5s refresh</span>
                 </div>
                 
                 <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-neonDark to-neon border flex items-center justify-center border-white/20 shadow-md">
                    <span className="text-xs font-bold text-background font-mono">SB</span>
                 </div>
              </div>
           </header>
           
           <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
              {children}
           </div>
        </main>
        
      </body>
    </html>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-neon hover:bg-neon/10 transition-all font-medium border border-transparent hover:border-neonDark/30">
        {icon}
        <span>{label}</span>
    </Link>
  );
}
