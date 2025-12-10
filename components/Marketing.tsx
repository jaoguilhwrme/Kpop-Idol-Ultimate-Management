import React, { useState } from 'react';
import { GameState, SongRelease } from '../types';

interface MarketingProps {
  gameState: GameState;
  onPromote: (songId: string, type: 'public' | 'global' | 'playlist', actionName: string, cost: number, effectValue: number, energyCost: number) => void;
  isProcessing: boolean;
}

export const Marketing: React.FC<MarketingProps> = ({ gameState, onPromote, isProcessing }) => {
  // Only recent user songs (last 12 weeks) are eligible for marketing
  const eligibleSongs = gameState.releases
    .filter(r => r.isUser && (gameState.turn - r.dateReleased) < 12)
    .sort((a, b) => b.dateReleased - a.dateReleased);

  const [selectedSongId, setSelectedSongId] = useState<string>(eligibleSongs[0]?.id || '');
  const selectedSong = eligibleSongs.find(s => s.id === selectedSongId);

  const actions = [
    {
      category: 'public',
      name: 'Street Promotions',
      desc: 'Hand out flyers and busk in Hongdae.',
      cost: 500000,
      energy: 10,
      effect: 5,
      effectDesc: '+5 Public Interest (KR)',
      icon: '📣'
    },
    {
      category: 'public',
      name: 'Variety Show Guest',
      desc: 'Send members to a popular variety show.',
      cost: 2000000,
      energy: 25,
      effect: 20,
      effectDesc: '+20 Public Interest (KR)',
      icon: '📺'
    },
    {
        category: 'public',
        name: 'National Radio Push',
        desc: 'Interview tour on major radio stations.',
        cost: 5000000,
        energy: 15,
        effect: 35,
        effectDesc: '+35 Public Interest (KR)',
        icon: '📻'
    },
    {
      category: 'playlist',
      name: 'Pitch to Curators',
      desc: 'Send press kits to Spotify playlist curators.',
      cost: 1000000,
      energy: 5,
      effect: 200000,
      effectDesc: '+200k Playlist Reach',
      icon: '📧'
    },
    {
      category: 'playlist',
      name: 'Premier Playlisting',
      desc: 'Secure spots on "K-Pop Rising" and "Teen Beats".',
      cost: 15000000,
      energy: 0,
      effect: 1500000,
      effectDesc: '+1.5M Playlist Reach',
      icon: '🎧'
    },
    {
      category: 'global',
      name: 'TikTok Challenge',
      desc: 'Launch a viral dance challenge with influencers.',
      cost: 8000000,
      energy: 20,
      effect: 0,
      effectDesc: 'High Chance of Viral Status',
      icon: '💃'
    },
    {
      category: 'global',
      name: 'Times Square Ad',
      desc: 'A massive billboard in New York City.',
      cost: 50000000,
      energy: 0,
      effect: 5000000,
      effectDesc: '+5M Reach & Global Hype',
      icon: '🏙️'
    }
  ];

  if (eligibleSongs.length === 0) {
    return (
        <div className="p-10 text-center bg-slate-800 rounded-xl border border-slate-700 border-dashed">
            <h2 className="text-xl font-bold text-slate-400 mb-2">No Active Songs</h2>
            <p className="text-slate-500">Produce and release a song to start marketing campaigns.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold text-white mb-2">Marketing HQ</h2>
           <p className="text-slate-400">Boost streams, gain public recognition, and secure playlists.</p>
        </div>
        <div className="w-full md:w-auto">
            <select 
                value={selectedSongId}
                onChange={(e) => setSelectedSongId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white p-3 rounded-lg font-bold focus:ring-2 focus:ring-violet-500 outline-none"
            >
                {eligibleSongs.map(s => (
                    <option key={s.id} value={s.id}>{s.title} (Wk {gameState.turn - s.dateReleased})</option>
                ))}
            </select>
        </div>
      </div>

      {selectedSong && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Song Stats */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg h-fit">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-3xl">💿</div>
                    <div>
                        <h3 className="font-bold text-white text-lg">{selectedSong.title}</h3>
                        <div className="flex gap-2 text-xs">
                             <span className="bg-slate-900 px-2 py-1 rounded text-slate-300">Rank #{selectedSong.currentRankKorea || 'Out'}</span>
                             <span className="bg-slate-900 px-2 py-1 rounded text-slate-300">Global #{selectedSong.currentRankGlobal || 'Out'}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Public Interest (KR)</span>
                            <span className="text-white font-bold">{Math.floor(selectedSong.marketingStats?.publicInterest || 0)}/100</span>
                        </div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${Math.min(100, selectedSong.marketingStats?.publicInterest || 0)}%` }}></div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Affects Melon Unique Listeners</p>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Playlist Reach</span>
                            <span className="text-white font-bold">{(selectedSong.marketingStats?.playlistReach || 0).toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${Math.min(100, (selectedSong.marketingStats?.playlistReach || 0) / 10000000 * 100)}%` }}></div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Affects Global Streams (Decays weekly)</p>
                    </div>
                    
                    {selectedSong.isViral && (
                        <div className="bg-pink-900/30 border border-pink-500/50 p-3 rounded-lg text-center">
                            <span className="text-pink-400 font-bold uppercase tracking-widest text-sm">🔥 Viral Status Active</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {actions.map((action, idx) => {
                    const avgEnergy = gameState.activeIdols.length > 0 
                        ? gameState.activeIdols.reduce((a, b) => a + b.energy, 0) / gameState.activeIdols.length 
                        : 0;
                    const canAfford = gameState.money >= action.cost;
                    const hasEnergy = avgEnergy >= action.energy;
                    
                    let borderColor = 'border-slate-700 hover:border-slate-500';
                    if (action.category === 'playlist') borderColor = 'border-green-900/50 hover:border-green-500';
                    if (action.category === 'public') borderColor = 'border-yellow-900/50 hover:border-yellow-500';
                    if (action.category === 'global') borderColor = 'border-pink-900/50 hover:border-pink-500';

                    return (
                        <div key={idx} className={`bg-slate-800 p-4 rounded-xl border ${borderColor} transition-all shadow-md flex flex-col`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{action.icon}</span>
                                    <div>
                                        <h4 className="font-bold text-white">{action.name}</h4>
                                        <div className="text-[10px] text-slate-400 uppercase font-bold">{action.category} Promotion</div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-300 mb-4 flex-1">{action.desc}</p>
                            
                            <div className="bg-slate-900/50 p-2 rounded mb-3">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-500">Effect</span>
                                    <span className="text-emerald-400 font-bold">{action.effectDesc}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Cost</span>
                                    <span className="text-slate-200">¥{action.cost.toLocaleString()} • {action.energy} Energy</span>
                                </div>
                            </div>

                            <button
                                onClick={() => onPromote(selectedSong.id, action.category as any, action.name, action.cost, action.effect, action.energy)}
                                disabled={!canAfford || !hasEnergy || isProcessing}
                                className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${
                                    !canAfford || !hasEnergy || isProcessing
                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                }`}
                            >
                                Purchase
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
      )}
    </div>
  );
};
