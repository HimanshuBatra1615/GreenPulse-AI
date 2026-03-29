"use client";

import jsPDF from 'jspdf';
import { Download } from 'lucide-react';

export default function ReportsPage() {
    
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("GreenPulse AI - Monthly Executive Report", 20, 20);
        
        doc.setFontSize(14);
        doc.text("Organization: SME Name", 20, 35);
        doc.text("Period: March 2026", 20, 45);
        
        doc.setFontSize(16);
        doc.text("Performance Summary", 20, 65);
        
        doc.setFontSize(12);
        doc.text("Total Consumption: 32,450 kWh (-12% MoM)", 40, 75);
        doc.text("Peak Load Avoided: 450 kWh", 40, 85);
        
        doc.text("Financial Impact", 20, 105);
        doc.text("LSTM Scheduling Savings: 12,500 Rs", 40, 115);
        doc.text("VPP Grid Revenue: 3,400 Rs", 40, 125);
        doc.text("Total Value Generated: 15,900 Rs", 40, 135);
        
        doc.text("Environmental Impact", 20, 155);
        doc.text("CO2 Emissions Prevented: 2.1 Tonnes", 40, 165);
        
        doc.save("GreenPulse_Report_March.pdf");
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="glass p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
                <div className="w-20 h-20 bg-neon/20 rounded-full flex items-center justify-center border border-neon/50">
                    <Download className="text-neon" size={32} />
                </div>
                <h2 className="text-3xl font-display font-medium text-white">Monthly Energy Report Ready</h2>
                <p className="text-gray-400 font-mono text-sm max-w-md">Your AI-driven load optimization summary, VPP revenue receipts, and environmental impact for the trailing 30 days is ready.</p>
                
                <button 
                    onClick={downloadPDF}
                    className="mt-4 px-6 py-3 bg-neon text-background font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                >
                    <Download size={18} />
                    Download PDF Report
                </button>
            </div>
        </div>
    )
}
