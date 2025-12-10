import React, { useState } from 'react';
import { GameState, SongRelease } from '../types';

interface MusicShowsProps {
  gameState: GameState;
  onVote: (songId: string, amount: number) => void;
}

export const MusicShows: React.FC<MusicShowsProps> = ({ gameState, onVote }) => {
  const [activeShow, setActiveShow] = useState('Inkigayo');

  // Only recent songs (released in last 8 weeks) are tracked in history
  // Find the user's latest promoted song to show voting button
  const userLatestSong = gameState.releases
    .filter(r => r.isUser && (gameState.turn - r.dateReleased) < 8)
    .sort((a, b) => b.dateReleased - a.dateReleased)[0];

  const shows = [
      { name: 'The Show', color: 'border-pink-500', icon: '🎀', desc: "Favors rising artists & voting." },
      { name: 'Show Champion', color: 'border-blue-500', icon: '🏆', desc: "Balanced metrics." },
      { name: 'M Countdown', color: 'border-green-500', icon: '🎤', desc: "Digital & Broadcast heavy." },
      { name: 'Music Bank', color: 'border-sky-500', icon: '🏦', desc: "Physical sales & Broadcast." },
      { name: 'Inkigayo', color: 'border-purple-500', icon: '📺', desc: "Digital & SNS (YouTube) heavy." }
  ];

  // Find results for the CURRENT week (or most recent calculated)
  // We need to look at any song that has a result for this week and show
  // But actually, the simulation stores results in `musicShowHistory` of individual songs.
  // We need to find ONE song that has the detailed `candidates` data for this week/show.
  // We can look at the user's song, or just scan recent releases.
  
  let resultForShow: any = null;
  // Try to find a recent result containing candidate data
  for (const r of gameState.releases) {
      const entry = r.musicShowHistory?.find(h => h.showName === activeShow && h.week === gameState.turn);
      if (entry && entry.candidates && entry.candidates.length > 0) {
          resultForShow = entry;
          break;
      }
  }

  // If no result found (e.g. week 1 or no candidates processed yet), show placeholder
  const candidates = resultForShow?.candidates || [];
  const winner = candidates.length > 0 ? candidates.reduce((prev: any, current: any) => (prev.score > current.score) ? prev : current) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Music Shows</h2>
          <p className="text-slate-400">Week {gameState.turn} Results</p>
        </div>
        <div className="bg-pink-900/30 border border-pink-500/50 px-6 py-3 rounded-xl flex flex-col items-center">
           <div className="text-xs text-pink-300 uppercase font-bold">Available Votes</div>
           <div className="text-3xl font-bold text-white">{gameState.fanVotes.toLocaleString()}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2">
          {shows.map(show => (
              <button
                key={show.name}
                onClick={() => setActiveShow(show.name)}
                className={`px-4 py-3 rounded-lg font-bold text-sm whitespace-nowrap transition-all border-b-4 flex items-center gap-2 ${
                    activeShow === show.name 
                    ? `bg-slate-800 text-white ${show.color}`
                    : 'bg-slate-900 text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                  <span>{show.icon}</span> {show.name}
              </button>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stage / Winner */}
          <div className="lg:col-span-2 space-y-6">
             {candidates.length === 0 ? (
                 <div className="bg-slate-800 p-12 rounded-xl border border-slate-700 border-dashed text-center text-slate-500">
                     No show data available for this week yet. Wait for results!
                 </div>
             ) : (
                 <>
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl relative overflow-hidden">
                        {winner && (
                            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        )}
                        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-wider">This Week's Nominees</h3>
                        
                        <div className="space-y-3">
                            {candidates.sort((a: any, b: any) => b.score - a.score).map((cand: any, idx: number) => {
                                const isWinner = idx === 0;
                                return (
                                    <div key={idx} className={`relative p-4 rounded-lg border flex items-center gap-4 ${isWinner ? 'bg-yellow-900/10 border-yellow-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg ${isWinner ? 'bg-yellow-500 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold text-lg ${isWinner ? 'text-yellow-400' : 'text-white'}`}>{cand.artistName}</span>
                                                {cand.isUser && <span className="text-[10px] bg-violet-600 px-1.5 py-0.5 rounded text-white font-bold">YOU</span>}
                                            </div>
                                            <div className="text-sm text-slate-400">{cand.songTitle}</div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <div className="text-2xl font-mono font-bold text-white">{cand.score.toLocaleString()}</div>
                                            <div className="text-[10px] text-slate-500 uppercase">Points</div>
                                        </div>

                                        {/* Score Breakdown Tooltip/Bar */}
                                        <div className="absolute bottom-0 left-0 w-full h-1 flex opacity-50">
                                            <div className="bg-blue-500" style={{ width: `${(cand.breakdown.digital / cand.score) * 100}%` }} title="Digital"></div>
                                            <div className="bg-emerald-500" style={{ width: `${(cand.breakdown.physical / cand.score) * 100}%` }} title="Physical"></div>
                                            <div className="bg-pink-500" style={{ width: `${(cand.breakdown.sns / cand.score) * 100}%` }} title="SNS"></div>
                                            <div className="bg-purple-500" style={{ width: `${(cand.breakdown.votes / cand.score) * 100}%` }} title="Votes"></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-xs text-center text-slate-400">
                        <div className="flex items-center justify-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Digital</div>
                        <div className="flex items-center justify-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Physical</div>
                        <div className="flex items-center justify-center gap-1"><div className="w-2 h-2 bg-pink-500 rounded-full"></div> SNS</div>
                        <div className="flex items-center justify-center gap-1"><div className="w-2 h-2 bg-purple-500 rounded-full"></div> Votes</div>
                    </div>
                 </>
             )}
          </div>

          {/* Voting Panel */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Pre-Voting</h3>
              {userLatestSong ? (
                  <div className="space-y-4">
                      <div className="bg-slate-900 p-4 rounded-lg">
                          <div className="text-xs text-slate-500 uppercase mb-1">Promoting Song</div>
                          <div className="font-bold text-white">{userLatestSong.title}</div>
                          <div className="flex justify-between mt-2 text-sm">
                              <span className="text-slate-400">Current Votes</span>
                              <span className="text-pink-400 font-bold">{userLatestSong.votesAllocated.toLocaleString()}</span>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button 
                           onClick={() => onVote(userLatestSong.id, 100)}
                           disabled={gameState.fanVotes < 100}
                           className="py-3 bg-slate-700 hover:bg-pink-600 disabled:opacity-50 disabled:hover:bg-slate-700 rounded font-bold transition-colors text-white"
                         >
                           Vote 100
                         </button>
                         <button 
                           onClick={() => onVote(userLatestSong.id, 1000)}
                           disabled={gameState.fanVotes < 1000}
                           className="py-3 bg-slate-700 hover:bg-pink-600 disabled:opacity-50 disabled:hover:bg-slate-700 rounded font-bold transition-colors text-white"
                         >
                           Vote 1,000
                         </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Votes reset weekly. Allocating votes increases your score across all shows, but has diminishing returns.</p>
                  </div>
              ) : (
                  <div className="text-center text-slate-500 py-8">
                      No active song to vote for.
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
