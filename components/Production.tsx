import React, { useState } from 'react';
import { Concept, GameState, ReleaseStyle } from '../types';
import { generateSongTitle } from '../services/geminiService';

interface ProductionProps {
  gameState: GameState;
  onRelease: (title: string, concept: Concept, style: ReleaseStyle, marketFocus: 'Domestic' | 'Global' | 'Balanced', cost: number, type: 'Single' | 'Album', promo: 'None' | 'Teasing') => void;
  isProcessing: boolean;
}

export const Production: React.FC<ProductionProps> = ({ gameState, onRelease, isProcessing }) => {
  const [selectedConcept, setSelectedConcept] = useState<Concept>(Concept.CUTE);
  const [selectedStyle, setSelectedStyle] = useState<ReleaseStyle>(ReleaseStyle.COMMERCIAL);
  const [selectedMarket, setSelectedMarket] = useState<'Domestic' | 'Global' | 'Balanced'>('Balanced');
  const [releaseType, setReleaseType] = useState<'Single' | 'Album'>('Single');
  const [promoType, setPromoType] = useState<'None' | 'Teasing'>('None');
  const [generatedTitle, setGeneratedTitle] = useState<string>('');
  const [budgetLevel, setBudgetLevel] = useState<number>(1);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  // Budget multiplier
  const typeMultiplier = releaseType === 'Album' ? 2.5 : 1;
  const promoMultiplier = promoType === 'Teasing' ? 1.2 : 1; 

  const budgets = [
    { level: 1, baseCost: 5000000, label: "Budget", qualityBonus: 0 },
    { level: 2, baseCost: 20000000, label: "Standard", qualityBonus: 10 },
    { level: 3, baseCost: 100000000, label: "Blockbuster", qualityBonus: 25 },
  ];

  const handleGenerateTitle = async () => {
    setIsGeneratingTitle(true);
    const title = await generateSongTitle(selectedConcept);
    setGeneratedTitle(title);
    setIsGeneratingTitle(false);
  };

  const selectedBudget = budgets.find(b => b.level === budgetLevel) || budgets[0];
  const finalCost = selectedBudget.baseCost * typeMultiplier * promoMultiplier;
  const canAfford = gameState.money >= finalCost;
  const hasIdols = gameState.activeIdols.length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-violet-600 rounded-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">Production Studio</h2>
                <p className="text-slate-400">Plan your next comeback</p>
            </div>
        </div>

        {!hasIdols ? (
            <div className="p-6 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-center">
                You need to debut idols before producing a song! Go to the "Trainees" tab.
            </div>
        ) : (
        <div className="space-y-8">
          
          {/* Release Type */}
          <div className="grid grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">1. Release Type</label>
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => setReleaseType('Single')}
                        className={`py-3 px-4 rounded-lg font-bold text-sm text-left transition-all border ${releaseType === 'Single' ? 'bg-violet-600 border-violet-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                    >
                        Digital Single
                        <span className="block text-[10px] font-normal opacity-70 mt-1">Cheap. Good for momentum.</span>
                    </button>
                    <button 
                        onClick={() => setReleaseType('Album')}
                        className={`py-3 px-4 rounded-lg font-bold text-sm text-left transition-all border ${releaseType === 'Album' ? 'bg-violet-600 border-violet-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                    >
                        Full Album
                        <span className="block text-[10px] font-normal opacity-70 mt-1">x2.5 Cost. High Physical Sales.</span>
                    </button>
                </div>
             </div>
             
             <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">2. Market Strategy</label>
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => setSelectedMarket('Domestic')}
                        className={`py-3 px-4 rounded-lg font-bold text-sm text-left transition-all border ${selectedMarket === 'Domestic' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                    >
                        🇰🇷 Domestic Focus
                        <span className="block text-[10px] font-normal opacity-70 mt-1">Target Korea Charts. High Show Wins.</span>
                    </button>
                    <button 
                        onClick={() => setSelectedMarket('Global')}
                        className={`py-3 px-4 rounded-lg font-bold text-sm text-left transition-all border ${selectedMarket === 'Global' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                    >
                        🌍 Global Focus
                        <span className="block text-[10px] font-normal opacity-70 mt-1">Target Spotify/Billboard. Slower Start.</span>
                    </button>
                </div>
             </div>
          </div>

           {/* Style & Promo */}
           <div className="grid grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">3. Musical Style</label>
                  <div className="flex flex-col gap-2">
                      <button 
                          onClick={() => setSelectedStyle(ReleaseStyle.COMMERCIAL)}
                          className={`py-3 px-4 rounded-lg font-bold text-sm text-left transition-all border ${selectedStyle === ReleaseStyle.COMMERCIAL ? 'bg-pink-600 border-pink-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                      >
                          Commercial
                          <span className="block text-[10px] font-normal opacity-70 mt-1">TikTok Viral Potential. Fast Decay.</span>
                      </button>
                      <button 
                          onClick={() => setSelectedStyle(ReleaseStyle.CONCEPTUAL)}
                          className={`py-3 px-4 rounded-lg font-bold text-sm text-left transition-all border ${selectedStyle === ReleaseStyle.CONCEPTUAL ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                      >
                          Conceptual
                          <span className="block text-[10px] font-normal opacity-70 mt-1">Critic Acclaim, Long Tail.</span>
                      </button>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">4. Promotion</label>
                  <div className="flex flex-col gap-2">
                      <button 
                          onClick={() => setPromoType('None')}
                          className={`py-3 px-4 rounded-lg font-bold text-sm text-left transition-all border ${promoType === 'None' ? 'bg-slate-600 border-slate-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                      >
                          Immediate Drop
                          <span className="block text-[10px] font-normal opacity-70 mt-1">No hype buildup.</span>
                      </button>
                      <button 
                          onClick={() => setPromoType('Teasing')}
                          className={`py-3 px-4 rounded-lg font-bold text-sm text-left transition-all border ${promoType === 'Teasing' ? 'bg-yellow-600 border-yellow-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                      >
                          Teaser Campaign
                          <span className="block text-[10px] font-normal opacity-70 mt-1">+20% Cost. Higher Week 1.</span>
                      </button>
                  </div>
               </div>
           </div>


          {/* Concept Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3">5. Select Concept</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.values(Concept).map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedConcept(c)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                    selectedConcept === c
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Title Generation */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3">6. {releaseType === 'Album' ? 'Title Track' : 'Song'} Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={generatedTitle}
                onChange={(e) => setGeneratedTitle(e.target.value)}
                placeholder="Enter title or generate one..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500"
              />
              <button
                onClick={handleGenerateTitle}
                disabled={isGeneratingTitle}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium disabled:opacity-50"
              >
                {isGeneratingTitle ? '...' : 'AI Generate'}
              </button>
            </div>
          </div>

          {/* Budget */}
          <div>
             <label className="block text-sm font-bold text-slate-300 mb-3">7. Production Budget</label>
             <div className="grid grid-cols-1 gap-3">
                {budgets.map((b) => (
                    <button
                        key={b.level}
                        onClick={() => setBudgetLevel(b.level)}
                        className={`flex justify-between items-center p-4 rounded-lg border text-left transition-all ${
                            budgetLevel === b.level
                            ? 'bg-emerald-900/20 border-emerald-500 ring-1 ring-emerald-500'
                            : 'bg-slate-900 border-slate-700 hover:bg-slate-800'
                        }`}
                    >
                        <div>
                            <div className={`font-bold ${budgetLevel === b.level ? 'text-emerald-400' : 'text-slate-300'}`}>
                                {b.label} (¥{(b.baseCost * typeMultiplier * promoMultiplier).toLocaleString()})
                            </div>
                            <div className="text-xs text-slate-500">Expected Quality Boost: +{b.qualityBonus}</div>
                        </div>
                    </button>
                ))}
             </div>
          </div>

          {/* Summary & Action */}
          <div className="pt-6 border-t border-slate-700">
             <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400">Current Funds</span>
                <span className={canAfford ? 'text-white' : 'text-red-500'}>¥{gameState.money.toLocaleString()}</span>
             </div>
             <button
                disabled={!generatedTitle || !canAfford || isProcessing}
                onClick={() => onRelease(generatedTitle, selectedConcept, selectedStyle, selectedMarket, finalCost, releaseType, promoType)}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                    !generatedTitle || !canAfford || isProcessing
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white transform hover:scale-[1.02]'
                }`}
             >
                {isProcessing ? 'PRODUCING...' : `CONFIRM ${releaseType.toUpperCase()} (-¥${finalCost.toLocaleString()})`}
             </button>
             {!canAfford && <p className="text-red-500 text-center text-sm mt-2">Insufficient funds.</p>}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
