import React from 'react';
import { Idol } from '../types';

interface IdolCardProps {
  idol: Idol;
  onTrain?: (idolId: string, stat: keyof Idol['stats']) => void;
  showTraining?: boolean;
}

const StatBar: React.FC<{ label: string; value: number; color: string; onTrain?: () => void }> = ({ label, value, color, onTrain }) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs mb-1">
      <span className="text-slate-400 uppercase font-semibold">{label}</span>
      <span className="font-mono text-slate-200">{value}</span>
    </div>
    <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
                className={`h-full ${color}`} 
                style={{ width: `${Math.min(100, value)}%` }}
            ></div>
        </div>
        {onTrain && (
            <button 
                onClick={onTrain}
                className="text-[10px] px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
            >
                Train
            </button>
        )}
    </div>
  </div>
);

export const IdolCard: React.FC<IdolCardProps> = ({ idol, onTrain, showTraining }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-violet-500/50 transition-colors shadow-lg">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-inner">
           <img 
            src={`https://picsum.photos/seed/${idol.imageSeed}/200/200`} 
            alt={idol.name} 
            className="w-full h-full object-cover rounded-full opacity-90"
           />
        </div>
        <div>
          <h3 className="font-bold text-lg text-white">{idol.name}</h3>
          <p className="text-xs text-slate-400">Age: {idol.age}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {idol.positions.map(p => (
              <span key={p} className="text-[10px] px-2 py-0.5 bg-violet-900/50 text-violet-200 rounded-full border border-violet-700/50">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-1">
        <StatBar label="Vocal" value={idol.stats.vocal} color="bg-pink-500" onTrain={showTraining && onTrain ? () => onTrain(idol.id, 'vocal') : undefined} />
        <StatBar label="Dance" value={idol.stats.dance} color="bg-cyan-500" onTrain={showTraining && onTrain ? () => onTrain(idol.id, 'dance') : undefined} />
        <StatBar label="Rap" value={idol.stats.rap} color="bg-yellow-500" onTrain={showTraining && onTrain ? () => onTrain(idol.id, 'rap') : undefined} />
        <StatBar label="Visual" value={idol.stats.visual} color="bg-purple-500" onTrain={showTraining && onTrain ? () => onTrain(idol.id, 'visual') : undefined} />
        <StatBar label="Charisma" value={idol.stats.charisma} color="bg-emerald-500" onTrain={showTraining && onTrain ? () => onTrain(idol.id, 'charisma') : undefined} />
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700 grid grid-cols-2 gap-2 text-center">
         <div>
            <div className="text-[10px] text-slate-500 uppercase">Energy</div>
            <div className={`text-sm font-bold ${idol.energy < 30 ? 'text-red-400' : 'text-green-400'}`}>{idol.energy}%</div>
         </div>
         <div>
            <div className="text-[10px] text-slate-500 uppercase">Stress</div>
            <div className={`text-sm font-bold ${idol.stress > 70 ? 'text-red-400' : 'text-blue-400'}`}>{idol.stress}%</div>
         </div>
      </div>
    </div>
  );
};
