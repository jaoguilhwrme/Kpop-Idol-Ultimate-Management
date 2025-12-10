import React, { useState, useMemo } from 'react';
import { GameState } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface ChartPageProps {
  gameState: GameState;
  onArtistClick: (artistId: string) => void;
}

export const ChartPage: React.FC<ChartPageProps> = ({ gameState, onArtistClick }) => {
  const [chartRegion, setChartRegion] = useState<'Korea' | 'Bugs' | 'Global'>('Korea');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter songs that are currently charting based on selected Region (Top 50 visible)
  const chartingSongs = gameState.releases
    .filter(r => {
        if (chartRegion === 'Korea') return r.currentRankKorea !== null && r.currentRankKorea <= 50;
        if (chartRegion === 'Bugs') return r.currentRankBugs !== null && r.currentRankBugs <= 50;
        return r.currentRankGlobal !== null && r.currentRankGlobal <= 50;
    })
    .sort((a, b) => {
      const rankA = chartRegion === 'Korea' ? a.currentRankKorea! : (chartRegion === 'Bugs' ? a.currentRankBugs! : a.currentRankGlobal!);
      const rankB = chartRegion === 'Korea' ? b.currentRankKorea! : (chartRegion === 'Bugs' ? b.currentRankBugs! : b.currentRankGlobal!);
      return rankA - rankB;
    });

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
        if (prev.includes(id)) return prev.filter(x => x !== id);
        if (prev.length >= 5) return prev; // Limit to 5
        return [...prev, id];
    });
  };

  const songsToGraph = useMemo(() => {
    if (selectedIds.length > 0) return gameState.releases.filter(r => selectedIds.includes(r.id));
    return chartingSongs.slice(0, 5);
  }, [selectedIds, chartingSongs, gameState.releases]);

  const graphData = useMemo(() => {
    const dataMap: { [week: number]: any } = {};
    const weeks = new Set<number>();
    songsToGraph.forEach(song => {
      const run = chartRegion === 'Korea' ? song.chartRunKorea : (chartRegion === 'Bugs' ? song.chartRunBugs : song.chartRunGlobal);
      run.forEach(entry => {
        weeks.add(entry.week);
        if (!dataMap[entry.week]) dataMap[entry.week] = { week: entry.week };
        dataMap[entry.week][song.id] = entry.rank;
      });
    });
    return Array.from(weeks).sort((a, b) => a - b).map(w => dataMap[w]);
  }, [songsToGraph, chartRegion]);

  const colors = ["#f472b6", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Music Charts</h2>
          <p className="text-slate-400">Week {gameState.turn}</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
            <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
                <button
                    onClick={() => { setChartRegion('Korea'); setSelectedIds([]); }}
                    className={`px-4 py-1.5 rounded text-sm font-bold transition-all ${
                    chartRegion === 'Korea' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    🍈 Melon
                </button>
                <button
                    onClick={() => { setChartRegion('Bugs'); setSelectedIds([]); }}
                    className={`px-4 py-1.5 rounded text-sm font-bold transition-all ${
                    chartRegion === 'Bugs' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    🐞 Bugs
                </button>
                <button
                    onClick={() => { setChartRegion('Global'); setSelectedIds([]); }}
                    className={`px-4 py-1.5 rounded text-sm font-bold transition-all ${
                    chartRegion === 'Global' ? 'bg-green-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    🌍 Spotify
                </button>
            </div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
         <div className="h-[300px] w-full">
            <ResponsiveContainer>
                <LineChart data={graphData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="week" stroke="#94a3b8" />
                    <YAxis reversed domain={[1, 100]} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                    <Legend />
                    {songsToGraph.map((song, i) => (
                        <Line key={song.id} type="monotone" dataKey={song.id} name={song.title} stroke={colors[i % colors.length]} strokeWidth={3} dot={false} connectNulls />
                    ))}
                </LineChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-700 bg-slate-900/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-4">Song</div>
          <div className="col-span-2">Chart Run</div>
          <div className="col-span-2 text-right">Unique Listeners</div>
          <div className="col-span-2 text-right">Weekly Streams</div>
        </div>

        <div className="divide-y divide-slate-700/50">
          {chartingSongs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 col-span-12">No data available for this chart.</div>
          ) : chartingSongs.map((song) => {
            const rank = chartRegion === 'Korea' ? song.currentRankKorea! : (chartRegion === 'Bugs' ? song.currentRankBugs! : song.currentRankGlobal!);
            const peak = chartRegion === 'Korea' ? song.peakRankKorea : (chartRegion === 'Bugs' ? song.peakRankBugs : song.peakRankGlobal);
            const history = chartRegion === 'Korea' ? song.chartRunKorea : (chartRegion === 'Bugs' ? song.chartRunBugs : song.chartRunGlobal);
            const weeklyStreams = chartRegion === 'Korea' ? song.stats.weeklyStreamsKR : (chartRegion === 'Bugs' ? song.stats.weeklyStreamsBugs : song.stats.weeklyStreamsGlobal);
            const weeksOnChart = history.length;
            
            // Stability Score
            const retention = Math.max(0, Math.min(100, Math.round(((101 - rank) / (101 - peak)) * 100)));
            
            let barColor = 'bg-slate-500';
            if (retention >= 90) barColor = 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
            else if (retention >= 70) barColor = 'bg-blue-500';
            else if (retention >= 50) barColor = 'bg-yellow-500';
            else barColor = 'bg-red-500';

            const isSelected = selectedIds.includes(song.id);
            
            return (
              <div key={song.id} className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-700/30 ${song.isUser ? 'bg-violet-900/10' : ''}`}>
                <div className="col-span-1 flex justify-center">
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelection(song.id)} className="w-4 h-4 bg-slate-700 rounded border-slate-600 text-indigo-600 cursor-pointer" />
                </div>
                <div className="col-span-1 text-center flex flex-col items-center">
                     <span className="font-bold text-white text-lg">{rank}</span>
                     {rank < peak + 5 && rank !== 1 && <span className="text-[10px] text-emerald-400">Stable</span>}
                     {rank === 1 && <span className="text-[10px] text-yellow-400 animate-pulse">PAK</span>}
                </div>
                <div className="col-span-4">
                    <div className="font-bold text-white truncate">{song.title}</div>
                    <div className="text-xs text-slate-400 cursor-pointer hover:text-white hover:underline" onClick={() => onArtistClick(song.artistId)}>{song.artistName}</div>
                </div>
                <div className="col-span-2">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Pk #{peak}</span>
                        <span>{weeksOnChart} Wks</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden w-full" title={`Stability: ${retention}%`}>
                        <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${retention}%` }}></div>
                    </div>
                </div>
                <div className="col-span-2 text-right text-slate-300 font-mono text-sm">
                    {chartRegion === 'Korea' ? song.stats.uniqueListenersKR.toLocaleString() : '-'}
                </div>
                <div className="col-span-2 text-right text-slate-300 font-mono text-sm">
                    {weeklyStreams.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};