import React from 'react';
import { GameState, SongRelease } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ArtistDetailProps {
  artistId: string;
  gameState: GameState;
  onBack: () => void;
}

export const ArtistDetail: React.FC<ArtistDetailProps> = ({ artistId, gameState, onBack }) => {
  // Find Artist data
  let artistName = "";
  let isUser = false;
  let artistStats: { fanbase: number } | null = null;
  let companyName = "";

  if (artistId === "user-group") {
    isUser = true;
    artistName = gameState.groupName;
    companyName = gameState.companyName;
    artistStats = { fanbase: gameState.fandom.size };
  } else {
    // Find in competitors
    const competitor = gameState.competitors.find(c => c.artists.some(a => a.id === artistId));
    if (competitor) {
      const artist = competitor.artists.find(a => a.id === artistId)!;
      artistName = artist.name;
      companyName = competitor.name;
      artistStats = { fanbase: artist.fandom.size };
    }
  }

  const releases = gameState.releases.filter(r => r.artistId === artistId).sort((a, b) => b.dateReleased - a.dateReleased);
  const singles = releases.filter(r => r.releaseType === 'Single');
  const albums = releases.filter(r => r.releaseType === 'Album');

  const totalWins = releases.reduce((acc, r) => acc + r.musicShowWins, 0);
  const totalSales = releases.reduce((acc, r) => acc + r.stats.totalPhysical, 0);
  
  // Filter nominations for this artist
  const artistNominations = gameState.currentNominations.filter(n => n.artistId === artistId);

  // Data for chart run graph (last release)
  const lastRelease = releases[0];
  const graphData = lastRelease 
    ? lastRelease.chartRunKorea.map(e => ({ week: `Wk ${e.week}`, rank: e.rank }))
    : [];

  const renderReleaseList = (list: SongRelease[], title: string) => (
      <div className="space-y-3 mb-6">
        <h4 className="font-bold text-slate-400 uppercase text-xs tracking-wider">{title}</h4>
        {list.length === 0 ? <div className="text-slate-600 text-sm">No {title.toLowerCase()} released yet.</div> : list.map(r => (
            <div key={r.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center justify-between">
                <div>
                <div className="text-xs text-slate-500 uppercase">Week {r.dateReleased}</div>
                <div className="font-bold text-lg text-white flex items-center gap-2">
                    {r.title}
                    {r.certifications && r.certifications.length > 0 && (
                        <div className="flex gap-1">
                            {r.certifications.map((c, i) => (
                                <span key={i} className="text-[10px] bg-slate-200 text-slate-900 px-1 rounded font-bold" title={`${c.region} ${c.type}`}>
                                    {c.type === 'Million' ? '💎' : '💿'}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="text-sm text-slate-400">{r.concept} • {r.stats.totalPhysical.toLocaleString()} copies</div>
                </div>
                <div className="flex space-x-4 text-right">
                <div>
                    <div className="text-xs text-slate-500 uppercase">KR Peak</div>
                    <div className={`font-mono font-bold ${r.peakRankKorea <= 10 ? 'text-yellow-400' : 'text-slate-300'}`}>
                        #{r.peakRankKorea}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 uppercase">GL Peak</div>
                    <div className={`font-mono font-bold ${r.peakRankGlobal <= 10 ? 'text-pink-400' : 'text-slate-300'}`}>
                        #{r.peakRankGlobal}
                    </div>
                </div>
                </div>
            </div>
        ))}
      </div>
  );

  if (!artistName) return <div>Artist not found</div>;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center space-x-2">
        <span>← Back</span>
      </button>

      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="relative z-10 flex items-center space-x-6">
           <div className="w-24 h-24 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center text-4xl shadow-lg border-4 border-slate-800">
             {isUser ? '⭐️' : '🎤'}
           </div>
           <div>
             <h1 className="text-4xl font-bold text-white mb-2">{artistName}</h1>
             <p className="text-xl text-slate-400">{companyName}</p>
           </div>
           <div className="ml-auto flex space-x-6 text-center">
             <div>
                <div className="text-2xl font-bold text-white font-mono">{totalWins}</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Wins</div>
             </div>
             <div>
                <div className="text-2xl font-bold text-white font-mono">{(totalSales / 1000).toFixed(1)}k</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Sales</div>
             </div>
             <div>
                <div className="text-2xl font-bold text-white font-mono">{releases.length}</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Songs</div>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
           {/* Active Nominations Banner */}
           {artistNominations.length > 0 && (
             <div className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 p-6 rounded-xl border border-yellow-500/30 mb-6">
                <h3 className="text-yellow-400 font-bold flex items-center gap-2 mb-4">
                   <span>🏆 Active Nominations</span>
                   <span className="text-xs bg-yellow-500/20 px-2 py-0.5 rounded text-yellow-200">Golden Disc Awards</span>
                </h3>
                <div className="grid gap-3">
                   {artistNominations.map(nom => (
                      <div key={nom.id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-white/5">
                         <span className="font-bold text-slate-200">{nom.category}</span>
                         <span className="text-sm text-slate-400">{nom.nomineeName}</span>
                      </div>
                   ))}
                </div>
             </div>
           )}

           <h3 className="text-xl font-bold text-white">Discography</h3>
           {renderReleaseList(albums, "Albums")}
           {renderReleaseList(singles, "Singles")}
        </div>

        <div className="space-y-6">
           {lastRelease && lastRelease.chartRunKorea.length > 0 && (
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
               <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Latest Chart Run (Korea)</h3>
               <div className="h-40">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={graphData}>
                        <XAxis dataKey="week" hide />
                        <YAxis reversed domain={[1, 50]} hide />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                        <Bar dataKey="rank" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
               </div>
               <p className="text-xs text-center text-slate-500 mt-2">{lastRelease.title}</p>
             </div>
           )}
           
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Artist Stats</h3>
              <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">Fanbase Power</span>
                        <span className="text-white">{artistStats?.fanbase.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full">
                        <div className="h-full bg-pink-500 rounded-full" style={{ width: `${Math.min(100, (artistStats?.fanbase || 0) / 1000)}%` }}></div>
                    </div>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
