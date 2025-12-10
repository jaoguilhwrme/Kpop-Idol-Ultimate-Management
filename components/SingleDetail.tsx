import React from 'react';
import { GameState, ReleaseStyle } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, CartesianGrid } from 'recharts';

interface SingleDetailProps {
  songId: string;
  gameState: GameState;
  onBack: () => void;
}

export const SingleDetail: React.FC<SingleDetailProps> = ({ songId, gameState, onBack }) => {
  const song = gameState.releases.find(r => r.id === songId);

  if (!song) return <div>Song not found</div>;

  const chartRunData = song.chartRunKorea.map((e, i) => {
     // Match global rank if exists for same week
     const globalEntry = song.chartRunGlobal.find(g => g.week === e.week);
     const bugsEntry = song.chartRunBugs?.find(b => b.week === e.week);
     return {
         name: `Wk ${e.week}`,
         melon: e.rank,
         global: globalEntry ? globalEntry.rank : null,
         bugs: bugsEntry ? bugsEntry.rank : null
     };
  });

  const weeksSinceRelease = gameState.turn - song.dateReleased;
  
  // Metacritic Color
  const getScoreColor = (score: number) => {
      if (score >= 80) return 'bg-green-500';
      if (score >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center space-x-2">
        <span>← Back</span>
      </button>

      {/* Header */}
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8">
            <div className="w-48 h-48 bg-slate-700 rounded shadow-2xl flex-shrink-0 flex items-center justify-center text-6xl">
                💿
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${song.style === ReleaseStyle.COMMERCIAL ? 'bg-pink-600 text-white' : 'bg-indigo-600 text-white'}`}>
                        {song.style}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-slate-700 text-slate-300">
                        {song.concept}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-slate-700 text-slate-300">
                        {song.releaseType}
                    </span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">{song.title}</h1>
                <p className="text-xl text-slate-400 mb-6">{song.artistName} • Released Week {song.dateReleased}</p>
                
                <div className="flex gap-8">
                    <div>
                        <div className="text-3xl font-bold text-white font-mono">{song.stats.totalStreamsGlobal.toLocaleString()}</div>
                        <div className="text-xs text-slate-500 uppercase font-bold">Total Global Streams</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white font-mono">{song.stats.totalPhysical.toLocaleString()}</div>
                        <div className="text-xs text-slate-500 uppercase font-bold">Physical Sales</div>
                    </div>
                     <div>
                        <div className="text-3xl font-bold text-white font-mono">{song.musicShowWins}</div>
                        <div className="text-xs text-slate-500 uppercase font-bold">Wins</div>
                    </div>
                </div>
            </div>
            
            {/* Critic Score Box */}
            <div className="flex flex-col items-end">
                <div className={`w-16 h-16 ${getScoreColor(song.reviews.criticScore)} rounded flex items-center justify-center text-2xl font-bold text-white shadow-lg mb-2`}>
                    {song.reviews.criticScore}
                </div>
                <div className="text-xs text-slate-400 uppercase font-bold mb-1">Critic Score</div>
                <div className="text-right text-xs text-slate-500 italic max-w-[150px]">"{song.reviews.summary}"</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Run */}
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Chart Performance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartRunData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" hide />
                        <YAxis reversed domain={[1, 100]} stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                        <Legend />
                        <Line type="monotone" dataKey="melon" stroke="#10b981" name="Melon" strokeWidth={3} dot={false} connectNulls />
                        <Line type="monotone" dataKey="global" stroke="#3b82f6" name="Spotify" strokeWidth={3} dot={false} connectNulls />
                        <Line type="monotone" dataKey="bugs" stroke="#f97316" name="Bugs" strokeWidth={2} dot={false} connectNulls />
                    </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                      <div className="text-xs text-slate-500 uppercase">Melon Peak</div>
                      <div className="text-xl font-bold text-emerald-400">#{song.peakRankKorea}</div>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                      <div className="text-xs text-slate-500 uppercase">Global Peak</div>
                      <div className="text-xl font-bold text-blue-400">#{song.peakRankGlobal}</div>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                      <div className="text-xs text-slate-500 uppercase">Bugs Peak</div>
                      <div className="text-xl font-bold text-orange-400">#{song.peakRankBugs}</div>
                  </div>
              </div>
          </div>

          {/* TikTok Stats */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <div className="flex items-center gap-2 mb-4">
                 <div className="text-2xl">📱</div>
                 <h3 className="text-lg font-bold text-white">TikTok Analytics</h3>
             </div>
             
             <div className="space-y-6">
                 <div>
                     <div className="flex justify-between text-sm mb-1">
                         <span className="text-slate-400">Total Creations</span>
                         <span className="text-white font-mono">{song.tiktokStats.totalVideos.toLocaleString()}</span>
                     </div>
                 </div>
                 
                 <div>
                     <div className="flex justify-between text-sm mb-1">
                         <span className="text-slate-400">Total Views</span>
                         <span className="text-white font-mono">{(song.tiktokStats.totalViews / 1000000).toFixed(1)}M</span>
                     </div>
                 </div>

                 <div className="bg-slate-900 p-4 rounded-lg">
                     <div className="text-xs text-slate-500 uppercase font-bold mb-1">Top Challenge</div>
                     <div className="text-pink-400 font-bold">{song.tiktokStats.challengeName}</div>
                     {song.tiktokStats.isTrending && (
                         <div className="mt-2 text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded inline-block animate-pulse">
                             🔥 Currently Trending
                         </div>
                     )}
                 </div>
                 
                 <p className="text-xs text-slate-500">
                     TikTok virality directly impacts Global Chart performance.
                 </p>
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tracklist / B-Sides */}
          {song.releaseType === 'Album' && (
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-4">Album Tracklist</h3>
                  <div className="space-y-2">
                      <div className="flex items-center p-3 bg-violet-900/20 border border-violet-500/30 rounded-lg">
                           <div className="w-6 text-center text-slate-500 text-xs">1</div>
                           <div className="font-bold text-white flex-1">{song.title}</div>
                           <div className="text-xs bg-violet-600 px-2 py-0.5 rounded text-white">Title</div>
                      </div>
                      {song.tracklist?.map((track, i) => (
                           <div key={i} className="flex items-center p-3 bg-slate-900/30 rounded-lg">
                                <div className="w-6 text-center text-slate-500 text-xs">{i + 2}</div>
                                <div className="text-slate-300 flex-1">{track}</div>
                                {song.bSides[i]?.rank && (
                                    <div className="text-xs text-emerald-500 font-mono">Rank #{song.bSides[i].rank}</div>
                                )}
                           </div>
                      ))}
                  </div>
              </div>
          )}

          {/* Music Show History */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Music Show Trophies</h3>
              {song.musicShowWins === 0 ? (
                  <div className="text-slate-500 text-sm">No wins yet.</div>
              ) : (
                  <div className="grid grid-cols-2 gap-3">
                      {['The Show', 'Show Champion', 'M Countdown', 'Music Bank', 'Inkigayo'].map(show => {
                          const wins = song.musicShowHistory?.filter(h => h.showName === show && h.won).length || 0;
                          if (wins === 0) return null;
                          return (
                              <div key={show} className="bg-slate-900 p-3 rounded-lg flex justify-between items-center border border-slate-700">
                                  <span className="text-sm text-slate-300">{show}</span>
                                  <span className="font-bold text-yellow-400">{wins} 🏆</span>
                              </div>
                          );
                      })}
                  </div>
              )}
              {song.musicShowHistory?.length > 0 && (
                   <div className="mt-4 pt-4 border-t border-slate-700">
                       <h4 className="text-xs font-bold text-slate-400 mb-2">Recent Scores</h4>
                       <div className="space-y-2">
                           {song.musicShowHistory.slice(-3).reverse().map((h, i) => (
                               <div key={i} className="flex justify-between text-xs">
                                   <span className="text-slate-400">{h.showName} (Wk {h.week})</span>
                                   <span className="font-mono text-slate-200">{h.score.toLocaleString()} pts {h.won ? '👑' : ''}</span>
                               </div>
                           ))}
                       </div>
                   </div>
              )}
          </div>
      </div>
    </div>
  );
};