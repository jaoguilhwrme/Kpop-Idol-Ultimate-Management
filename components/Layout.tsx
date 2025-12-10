import React from 'react';
import { GameState } from '../types';

interface LayoutProps {
  gameState: GameState;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  advanceTurn: () => void;
  isProcessing: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  gameState, 
  children, 
  activeTab, 
  setActiveTab,
  advanceTurn,
  isProcessing
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'group', label: 'My Group', icon: '✨' },
    { id: 'trainees', label: 'Trainees', icon: '👯‍♀️' },
    { id: 'studio', label: 'Studio', icon: '🎧' },
    { id: 'marketing', label: 'Marketing', icon: '📢' },
    { id: 'streaming', label: 'Streaming', icon: '📱' },
    { id: 'musicshows', label: 'Music Shows', icon: '🎤' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'charts', label: 'Charts & News', icon: '🏆' },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            K-POP CEO
          </h1>
          <p className="text-xs text-slate-400 mt-1">{gameState.companyName} Ent.</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Week {gameState.turn}</span>
            <div className="text-right">
                <div className="text-xs text-yellow-400 font-mono">¥{gameState.money.toLocaleString()}</div>
                <div className="text-xs text-pink-300 font-bold">Vote: {gameState.fanVotes}</div>
            </div>
          </div>
          <button
            onClick={advanceTurn}
            disabled={isProcessing}
            className={`w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all ${
              isProcessing 
                ? 'bg-slate-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white shadow-lg'
            }`}
          >
            {isProcessing ? 'PROCESSING...' : 'NEXT WEEK >>'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-950 relative">
        <div className="max-w-6xl mx-auto p-8">
           {children}
        </div>
      </main>
    </div>
  );
};
