import React from 'react';
import { GameState } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DashboardProps {
  gameState: GameState;
}

export const Dashboard: React.FC<DashboardProps> = ({ gameState }) => {
  const latestRelease = gameState.releases[0]; // Assuming prepended

  const stats = [
    { label: 'Funds (KRW)', value: `¥${gameState.money.toLocaleString()}`, color: 'text-emerald-400' },
    { label: 'Total Fans', value: gameState.fandom.size.toLocaleString(), color: 'text-pink-400' },
    { label: 'Reputation', value: `${gameState.reputation}/100`, color: 'text-yellow-400' },
    { label: 'Active Idols', value: gameState.activeIdols.length, color: 'text-blue-400' },
  ];

  // Dummy chart data for visuals
  const chartData = [
    { name: 'Wk 1', sales: 4000 },
    { name: 'Wk 2', sales: 3000 },
    { name: 'Wk 3', sales: 2000 },
    { name: 'Wk 4', sales: 2780 },
    { name: 'Wk 5', sales: 1890 },
    { name: 'Wk 6', sales: 2390 },
    { name: 'Wk 7', sales: 3490 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</div>
            <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Feed / Notifications */}
        <div className="md:col-span-2 space-y-6">
           {/* Awards Season Banner */}
           {gameState.currentNominations.length > 0 && (
             <div className="bg-gradient-to-r from-yellow-800 to-amber-900 p-6 rounded-xl border border-yellow-500 shadow-lg relative overflow-hidden animate-pulse">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">🏆 Awards Season is Here!</h2>
                        <p className="text-yellow-100 text-sm">Winners announced Week 52. Check Artist Details for full list.</p>
                    </div>
                    <div className="text-right">
                         <div className="text-4xl font-bold text-white">{gameState.currentNominations.length}</div>
                         <div className="text-xs uppercase font-bold text-yellow-200">Total Nominees</div>
                    </div>
                </div>
             </div>
           )}

           {latestRelease && (
             <div className="bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="px-2 py-1 bg-white/10 text-white text-xs rounded mb-2 inline-block">Latest Release</span>
                            <h2 className="text-3xl font-bold text-white mb-1">{latestRelease.title}</h2>
                            <p className="text-violet-200 text-sm mb-4">Concept: {latestRelease.concept} • Quality: {latestRelease.quality}/100</p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-yellow-400">
                                {latestRelease.peakRankKorea > 100 ? 'N/A' : `#${latestRelease.peakRankKorea}`}
                            </div>
                            <div className="text-xs text-slate-300">Peak Chart (KR)</div>
                        </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-black/30 rounded-lg">
                        <div className="text-xs text-slate-400 mb-2 uppercase font-bold">Best Netizen Comment</div>
                        <p className="text-sm italic text-slate-200">"{latestRelease.netizenComments[0]}"</p>
                    </div>
                </div>
                {/* Decorative element */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-pink-500 blur-[60px] opacity-20 rounded-full"></div>
             </div>
           )}

           <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
             <div className="p-4 border-b border-slate-700 bg-slate-800/80 backdrop-blur sticky top-0">
               <h3 className="font-bold text-slate-200">Recent Notifications</h3>
             </div>
             <div className="max-h-[300px] overflow-y-auto p-4 space-y-3">
               {gameState.notifications.length === 0 ? (
                 <p className="text-slate-500 text-center py-4">No news yet. Start your journey!</p>
               ) : (
                 gameState.notifications.slice().reverse().map(notif => (
                   <div key={notif.id} className={`p-3 rounded-lg border-l-4 text-sm ${
                     notif.type === 'success' ? 'border-green-500 bg-green-900/10' :
                     notif.type === 'danger' ? 'border-red-500 bg-red-900/10' :
                     'border-blue-500 bg-blue-900/10'
                   }`}>
                     <div className="flex justify-between text-xs text-slate-400 mb-1">
                       <span className="uppercase font-bold tracking-wider">{notif.title}</span>
                       <span>Wk {notif.date}</span>
                     </div>
                     <div className="text-slate-200">{notif.message}</div>
                   </div>
                 ))
               )}
             </div>
           </div>
        </div>

        {/* Mini Chart */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col">
            <h3 className="font-bold text-slate-200 mb-4">Market Trend</h3>
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} 
                            itemStyle={{ color: '#fff' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">Sales projection based on current market trends.</p>
        </div>
      </div>
    </div>
  );
};
