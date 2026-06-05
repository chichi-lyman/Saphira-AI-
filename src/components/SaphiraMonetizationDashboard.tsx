import React, { useState } from 'react';

// --- STAGE 1: METRIC ENTRIES & TYPE DEFINITIONS ---
interface TransactionLog {
  id: string;
  skillName: string;
  value: number;
  margin: number;
  status: 'SETTLED' | 'HELD' | 'REFUNDED';
  timestamp: string;
}

export const SaphiraMonetizationDashboard: React.FC = () => {
  // Mock live data stream feeding directly from saphira_ledger.py
  const [ledgerMetrics, setLedgerMetrics] = useState({
    totalRevenue: 1482.45,
    netMargin: 494.15,
    activeEscrowHolds: 18.20,
    marginPercentage: 33.3
  });

  const [transactions, setTransactions] = useState<TransactionLog[]>([
    { id: 'TXN_4F2D8A1E99', skillName: 'autonomous_container_patch', value: 0.4500, margin: 0.1500, status: 'SETTLED', timestamp: '14:23:10' },
    { id: 'TXN_9B2C7F13E2', skillName: 'fuzz_vector_generator', value: 1.2500, margin: 0.4200, status: 'SETTLED', timestamp: '14:19:45' },
    { id: 'TXN_1A8E3D04C1', skillName: 'cross_platform_email_nurture', value: 0.0800, margin: 0.0250, status: 'HELD', timestamp: '14:24:01' },
    { id: 'TXN_7E3A9B22F0', skillName: 'errored_dependency_resolver', value: 0.9500, margin: 0.0000, status: 'REFUNDED', timestamp: '14:10:12' }
  ]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 font-sans text-[#121212] antialiased">
      
      {/* --- DASHBOARD MONITORING HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-gray-400 uppercase">Saphira Ledger Protocol</span>
          <h2 className="text-xl font-bold text-black tracking-tight mt-0.5">Value Exchange Monitor</h2>
        </div>
        <div className="mt-2 md:mt-0 bg-white border border-gray-200/60 rounded-xl px-3 py-1.5 flex items-center space-x-2 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-bold uppercase text-gray-500">Autonomous Ledger Online</span>
        </div>
      </div>

      {/* --- FINANCIAL GRID: LIQUID GLASS HIGH-CONTRAST PANELS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* TOTAL REVENUE CARD */}
        <div className="bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.01)] relative overflow-hidden">
          <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase block mb-1">Total Gross Revenue</span>
          <div className="text-2xl font-bold tracking-tight font-mono text-black">${ledgerMetrics.totalRevenue.toFixed(2)}</div>
          <div className="absolute right-4 bottom-4 h-2 w-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full" />
        </div>

        {/* NET PROFIT CARD */}
        <div className="bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.01)] relative overflow-hidden">
          <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase block mb-1">Net Platform Margin</span>
          <div className="text-2xl font-bold tracking-tight font-mono text-black">${ledgerMetrics.netMargin.toFixed(2)}</div>
          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1 inline-block">
            +{ledgerMetrics.marginPercentage}% Yield
          </span>
        </div>

        {/* ESCROW HOLD CARD */}
        <div className="bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.01)] relative overflow-hidden">
          <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase block mb-1">Active Escrow Holds</span>
          <div className="text-2xl font-bold tracking-tight font-mono text-gray-800">${ledgerMetrics.activeEscrowHolds.toFixed(2)}</div>
          <span className="text-[10px] font-mono font-bold text-gray-400 mt-1 inline-block">Awaiting Sandbox Audits</span>
        </div>

        {/* COMPUTE COST INDEX (NEON PINK ACCENT INDICATOR) */}
        <div className="bg-white/40 backdrop-blur-xl border border-[#FF007F]/20 rounded-2xl p-5 shadow-[0_8px_32px_rgba(255,0,127,0.02)] relative">
          <div className="absolute top-0 right-0 h-1.5 w-12 bg-[#FF007F] rounded-bl-xl" />
          <span className="text-[10px] font-mono tracking-wider text-[#FF007F] uppercase block mb-1">Compute Efficiency</span>
          <div className="text-2xl font-bold tracking-tight font-mono text-black">1.50x</div>
          <span className="text-[10px] font-mono text-gray-400 block mt-1">Platform markup floor locked</span>
        </div>

      </div>

      {/* --- REAL-TIME TRANSACTION TICKER ENGINE --- */}
      <div className="bg-white/60 backdrop-blur-lg border border-white/80 rounded-3xl p-6 shadow-[0_16px_48px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold text-black font-mono uppercase tracking-wider">Dynamic Transaction Stream</h3>
            <p className="text-[11px] text-gray-400">Live ledger commits synced from saphira_ledger.py</p>
          </div>
          <button className="text-[11px] font-mono font-bold text-[#FF007F] hover:underline bg-[#FF007F]/5 px-2.5 py-1 rounded-lg border border-[#FF007F]/10">
            Export Ledger
          </button>
        </div>

        {/* TRANSACTION TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="pb-3 font-medium uppercase tracking-wider">Transaction ID</th>
                <th className="pb-3 font-medium uppercase tracking-wider">Skill/Intent Block</th>
                <th className="pb-3 font-medium uppercase tracking-wider text-right">Value (USD)</th>
                <th className="pb-3 font-medium uppercase tracking-wider text-right">Margin (USD)</th>
                <th className="pb-3 font-medium uppercase tracking-wider text-center">Protocol State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((txn) => (
                <tr key={txn.id} className="group hover:bg-gray-50/40 transition-colors">
                  <td className="py-3.5 font-bold text-gray-900">{txn.id}</td>
                  <td className="py-3.5 text-gray-600 max-w-xs truncate">{txn.skillName}</td>
                  <td className="py-3.5 text-right font-bold text-gray-900">${txn.value.toFixed(4)}</td>
                  <td className="py-3.5 text-right text-emerald-600 font-bold">
                    {txn.margin > 0 ? `+$${txn.margin.toFixed(4)}` : '$0.0000'}
                  </td>
                  <td className="py-3.5 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase
                      ${txn.status === 'SETTLED' && 'bg-emerald-50 text-emerald-700'}
                      ${txn.status === 'HELD' && 'bg-gray-100 text-gray-600'}
                      ${txn.status === 'REFUNDED' && 'bg-[#FF007F]/5 text-[#FF007F] border border-[#FF007F]/10'}
                    `}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

