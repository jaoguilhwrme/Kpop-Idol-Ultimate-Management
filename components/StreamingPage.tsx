import React from 'react';
import { GameState } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface StreamingPageProps {
  gameState: GameState;
}

export const StreamingPage: React.FC<StreamingPageProps> = ({ gameState }) => {
  const releases = gameState.releases.filter(r => r.isUser).sort((a, b) => b.dateReleased - a.dateReleased);
  
  // Stats
  const totalStreamsKR = releases.reduce((acc, r) => acc + r.stats.totalStreamsKR, 0);
  const totalStreamsGlobal = releases.reduce((acc, r) => acc + r.stats.totalStreamsGlobal, 0);
  const totalStreams = totalStreamsKR + totalStreamsGlobal;
  
  // Calculate monthly listeners estimate (Unique listeners from last 4 weeks of releases)
  const monthlyListeners = releases
    .filter(r => (gameState.turn - r.dateReleased) <= 4)
    .reduce((acc, r) => acc + r.stats.uniqueListenersKR, 0) + Math.floor(gameState.fandom.size * 1.5);

  const topSongs = [...releases].sort((a, b) => (b.stats.totalStreamsKR + b.stats.totalStreamsGlobal) - (a.stats.totalStreamsKR + a.stats.totalStreamsGlobal)).slice(0, 5);

  // Graph data: Total streams per week for last 5 releases
  const chartData = releases.slice(0, 7).reverse().map(r => ({
      name: r.title.length > 10 ? r.title.substring(0, 10) + '...' : r.title,
      streams: r.stats.totalStreamsGlobal + r.stats.totalStreamsKR
  }));

  // History Growth Data
  const historyData = gameState.groupHistory.map(entry => ({
      name: `Wk ${entry.week}`,
      streams: entry.totalStreams,
      fans: entry.fans
  }));

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-8">
      {/* Header Profile */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 shadow-2xl">
         <div className="flex flex-col md:flex-row items-end gap-6">
             <div className="w-40 h-40 shadow-2xl rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-6xl border-4 border-slate-900">
                🎧
             </div>
             <div className="flex-1">
                 <div className="text-sm font-bold text-green-400 uppercase tracking-widest mb-2">Verified Artist</div>
                 <h1 className="text-5xl font-black text-white mb-4 tracking-tight">{gameState.groupName}</h1>
                 <div className="flex items-center gap-4 text-slate-300">
                    <span className="text-white font-bold">{formatNumber(monthlyListeners)}</span> monthly listeners
                    <span>•</span>
                    <span className="text-white font-bold">{formatNumber(gameState.fandom.size)}</span> followers
                 </div>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Popular Tracks */}
          <div className="md:col-span-2 space-y-8">
             <div>
                <h3 className="text-xl font-bold text-white mb-4">Popular</h3>
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                    {topSongs.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No releases yet.</div>
                    ) : (
                        topSongs.map((song, index) => {
                            const total = song.stats.totalStreamsKR + song.stats.totalStreamsGlobal;
                            return (
                                <div key={song.id} className="flex items-center p-4 hover:bg-white/5 transition-colors group">
                                    <div className="w-8 text-center text-slate-500 font-mono">{index + 1}</div>
                                    <div className="w-12 h-12 bg-slate-800 rounded mx-4 flex items-center justify-center text-xl shadow">
                                        🎵
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-white group-hover:text-green-400 transition-colors">{song.title}</div>
                                        <div className="text-xs text-slate-500">{song.stats.totalStreamsGlobal > song.stats.totalStreamsKR ? 'Global Hit' : 'Domestic Hit'}</div>
                                    </div>
                                    <div className="text-right text-slate-300 font-mono text-sm">
                                        {total.toLocaleString()}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
             </div>
             
             {/* Growth History Chart */}
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Growth Trajectory</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                            <Legend />
                            <Line type="monotone" dataKey="streams" name="Total Streams" stroke="#4ade80" strokeWidth={3} dot={false} />
                            <Line type="monotone" dataKey="fans" name="Fandom Size" stroke="#e879f9" strokeWidth={3} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-center text-slate-500 mt-2">Cumulative growth of streams and fanbase.</p>
             </div>
          </div>

          {/* Stats Column */}
          <div className="space-y-6">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Total Streams</h3>
                  <div className="text-4xl font-black text-white mb-2">{formatNumber(totalStreams)}</div>
                  <div className="space-y-2 mt-4">
                      <div>
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                              <span>Domestic (KR)</span>
                              <span>{Math.round((totalStreamsKR / (totalStreams || 1)) * 100)}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${(totalStreamsKR / (totalStreams || 1)) * 100}%` }}></div>
                          </div>
                      </div>
                      <div>
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                              <span>Global</span>
                              <span>{Math.round((totalStreamsGlobal / (totalStreams || 1)) * 100)}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500" style={{ width: `${(totalStreamsGlobal / (totalStreams || 1)) * 100}%` }}></div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Initial Performance Trend</h3>
                  <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                              <XAxis dataKey="name" hide />
                              <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                              />
                              <Bar dataKey="streams" fill="#4ade80" radius={[4, 4, 4, 4]} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-center text-slate-500 mt-2">Last 7 Releases (Launch Week)</p>
              </div>
          </div>
      </div>

      {/* Discography Table */}
      <div>
         <h3 className="text-xl font-bold text-white mb-4">Full Discography</h3>
         <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
             <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 text-xs font-bold text-slate-500 uppercase">
                 <div className="col-span-1">#</div>
                 <div className="col-span-5">Title</div>
                 <div className="col-span-2 text-right">Daily</div>
                 <div className="col-span-2 text-right">Total</div>
                 <div className="col-span-2 text-center">Peak</div>
             </div>
             {releases.map((song, i) => (
                 <div key={song.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors border-b border-slate-800/50">
                     <div className="col-span-1 text-slate-500">{i + 1}</div>
                     <div className="col-span-5 flex items-center gap-3">
                         <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center text-xs">💿</div>
                         <div>
                             <div className="font-bold text-white">{song.title}</div>
                             <div className="text-xs text-slate-500">{song.releaseType} • {song.concept}</div>
                         </div>
                     </div>
                     <div className="col-span-2 text-right text-slate-400 font-mono text-xs">
                         {formatNumber(song.stats.weeklyStreamsGlobal + song.stats.weeklyStreamsKR)}
                     </div>
                     <div className="col-span-2 text-right text-white font-mono text-sm">
                         {formatNumber(song.stats.totalStreamsGlobal + song.stats.totalStreamsKR)}
                     </div>
                     <div className="col-span-2 text-center text-xs">
                         <span className="text-green-400 font-bold">#{song.peakRankGlobal}</span> <span className="text-slate-600">GL</span>
                     </div>
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
};