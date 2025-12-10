import React from 'react';
import { GameState } from '../types';

interface BusinessProps {
  gameState: GameState;
  onAction: (action: string, cost: number, rewardMoney: number, rewardFans: number, energyCost: number) => void;
  isProcessing: boolean;
}

export const Business: React.FC<BusinessProps> = ({ gameState, onAction, isProcessing }) => {
  const hasIdols = gameState.activeIdols.length > 0;
  const avgEnergy = hasIdols 
    ? gameState.activeIdols.reduce((a, b) => a + b.energy, 0) / gameState.activeIdols.length 
    : 0;

  const actions = [
    {
      id: 'livestream',
      title: 'Fan Livestream',
      description: 'Host a casual live session to bond with fans.',
      cost: 0,
      rewardMoney: 100000,
      rewardFans: 200,
      energyCost: 10,
      cooldown: 0,
      icon: '📱'
    },
    {
      id: 'merch',
      title: 'Limited Merch Drop',
      description: 'Release photo cards and t-shirts.',
      cost: 5000000,
      rewardMoney: Math.floor(gameState.fandom.size * 5000), // Scales with fandom
      rewardFans: 50,
      energyCost: 5,
      cooldown: 4,
      icon: '👕'
    },
    {
      id: 'fanmeeting',
      title: 'Fan Meeting',
      description: 'Rent a hall for a fan meeting event.',
      cost: 20000000,
      rewardMoney: Math.floor(gameState.fandom.size * 15000),
      rewardFans: 1000,
      energyCost: 30,
      cooldown: 8,
      icon: '🤝'
    },
    {
      id: 'concert',
      title: 'World Tour Concert',
      description: 'A massive production for global fans.',
      cost: 100000000,
      rewardMoney: Math.floor(gameState.fandom.size * 50000),
      rewardFans: 5000,
      energyCost: 60,
      cooldown: 20,
      icon: '🎤'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Business Management</h2>
          <p className="text-slate-400">Manage revenue streams and events.</p>
        </div>
        <div className="bg-slate-800 px-6 py-3 rounded-xl border border-slate-700">
           <div className="text-xs text-slate-500 uppercase font-bold">Group Energy</div>
           <div className={`text-2xl font-bold ${avgEnergy < 30 ? 'text-red-500' : 'text-emerald-500'}`}>
             {Math.floor(avgEnergy)}%
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {actions.map(action => {
            const potentialProfit = action.rewardMoney - action.cost;
            const canAfford = gameState.money >= action.cost;
            const hasEnergy = avgEnergy >= action.energyCost;

            return (
                <div key={action.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-violet-500 transition-all shadow-lg flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl bg-slate-900 p-3 rounded-lg">{action.icon}</div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{action.title}</h3>
                                <p className="text-slate-400 text-sm">{action.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-900/50 p-4 rounded-lg text-sm">
                        <div>
                            <span className="text-slate-500 block">Upfront Cost</span>
                            <span className="text-red-400 font-mono">¥{action.cost.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block">Est. Revenue</span>
                            <span className="text-emerald-400 font-mono">~¥{action.rewardMoney.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block">Fan Growth</span>
                            <span className="text-pink-400">+{action.rewardFans.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block">Energy Cost</span>
                            <span className="text-yellow-400">-{action.energyCost}%</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => onAction(action.title, action.cost, action.rewardMoney, action.rewardFans, action.energyCost)}
                        disabled={!hasIdols || !canAfford || !hasEnergy || isProcessing}
                        className={`mt-auto w-full py-3 rounded-lg font-bold transition-all ${
                            !hasIdols || !canAfford || !hasEnergy || isProcessing
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg'
                        }`}
                    >
                        {!hasIdols ? 'No Idols' : 
                         !canAfford ? 'Insufficient Funds' :
                         !hasEnergy ? 'Too Tired' : 
                         'Launch Event'}
                    </button>
                </div>
            );
        })}
      </div>
    </div>
  );
};
