import React, { useState } from 'react';
import { GameState, Idol, IdolPosition, SongRelease } from '../types';

interface GroupPageProps {
  gameState: GameState;
  onUpdateName: (name: string) => void;
  onToggleRole: (idolId: string, role: IdolPosition) => void;
}

export const GroupPage: React.FC<GroupPageProps> = ({ gameState, onUpdateName, onToggleRole }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(gameState.groupName);

  const userReleases = gameState.releases.filter(r => r.isUser);
  const totalSales = userReleases.reduce((acc, r) => acc + r.stats.totalPhysical, 0);
  const totalWins = userReleases.reduce((acc, r) => acc + r.musicShowWins, 0);

  const handleSaveName = () => {
    onUpdateName(tempName);
    setIsEditingName(false);
  };

  const allRoles = Object.values(IdolPosition);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-600/20 to-pink-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-4xl shadow-lg border-4 border-slate-700">
                ✨
              </div>
              <div>
                <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Representative Group</div>
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="bg-slate-900 border border-slate-600 text-2xl font-bold text-white px-3 py-1 rounded focus:outline-none focus:border-violet-500"
                      autoFocus
                    />
                    <button onClick={handleSaveName} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-sm font-bold">Save</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 group">
                    <h1 className="text-4xl font-bold text-white">{gameState.groupName}</h1>
                    <button 
                      onClick={() => { setTempName(gameState.groupName); setIsEditingName(true); }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                )}
                <p className="text-slate-400 mt-1">{gameState.activeIdols.length} Members • Formed Week 1</p>
              </div>
            </div>

            <div className="flex gap-8 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">{totalSales.toLocaleString()}</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Total Sales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">{totalWins}</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Show Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">{gameState.fandom.size.toLocaleString()}</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Fandom</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Members & Roles Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>Member Roles</span>
          <span className="text-sm font-normal text-slate-400 bg-slate-800 px-2 py-1 rounded">Assign positions to boost performance</span>
        </h2>

        {gameState.activeIdols.length === 0 ? (
          <div className="p-12 text-center bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
            <p className="text-slate-400 text-lg">No active members yet.</p>
            <p className="text-slate-500 text-sm mt-2">Go to the "Trainees" tab to debut idols.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gameState.activeIdols.map((idol) => (
              <div key={idol.id} className="bg-slate-800 rounded-xl p-5 border border-slate-700 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-600">
                      <img 
                        src={`https://picsum.photos/seed/${idol.imageSeed}/200/200`} 
                        alt={idol.name} 
                        className="w-full h-full object-cover"
                      />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-white">{idol.name}</h3>
                     <div className="flex gap-4 text-xs text-slate-400 mt-1">
                        <span>Voc: {idol.stats.vocal}</span>
                        <span>Dnc: {idol.stats.dance}</span>
                        <span>Rap: {idol.stats.rap}</span>
                        <span>Vis: {idol.stats.visual}</span>
                     </div>
                   </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700">
                  {allRoles.map(role => {
                    const isActive = idol.positions.includes(role);
                    return (
                      <button
                        key={role}
                        onClick={() => onToggleRole(idol.id, role)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                          isActive 
                            ? 'bg-violet-600 border-violet-500 text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]' 
                            : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {role}
                        {isActive && <span className="ml-1 text-[10px] opacity-70">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discography List */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Discography</h2>
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-700 bg-slate-900/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div className="col-span-1">Week</div>
                <div className="col-span-4">Title</div>
                <div className="col-span-2">Concept</div>
                <div className="col-span-2 text-right">Sales</div>
                <div className="col-span-1 text-center">KR Peak</div>
                <div className="col-span-1 text-center">GL Peak</div>
                <div className="col-span-1 text-center">Wins</div>
            </div>
            {userReleases.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No songs released yet. Visit the Studio!</div>
            ) : (
                userReleases.slice().reverse().map(release => (
                    <div key={release.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <div className="col-span-1 text-slate-400">{release.dateReleased}</div>
                        <div className="col-span-4 font-bold text-white">{release.title}</div>
                        <div className="col-span-2 text-slate-400 text-xs px-2 py-1 bg-slate-700 rounded w-fit">{release.concept}</div>
                        <div className="col-span-2 text-right font-mono text-slate-300">{release.stats.totalPhysical.toLocaleString()}</div>
                        <div className="col-span-1 text-center font-bold text-yellow-500">#{release.peakRankKorea}</div>
                        <div className="col-span-1 text-center font-bold text-pink-500">#{release.peakRankGlobal}</div>
                        <div className="col-span-1 text-center font-bold text-slate-300">{release.musicShowWins}</div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};