import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { IdolCard } from './components/IdolCard';
import { Production } from './components/Production';
import { ChartPage } from './components/ChartPage';
import { ArtistDetail } from './components/ArtistDetail';
import { SingleDetail } from './components/SingleDetail'; 
import { GroupPage } from './components/GroupPage';
import { MusicShows } from './components/MusicShows';
import { Business } from './components/Business';
import { Marketing } from './components/Marketing';
import { StreamingPage } from './components/StreamingPage';
import { GameState, Idol, Concept, SongRelease, GameNotification, IdolPosition, GroupType, FandomStats, ReleaseStyle, MusicShowResult, MusicShowCandidate } from './types';
import { generateTrainees, generateComebackOutcome, generateCompetitors, generateHistoricalData, getRandomSongTitle } from './services/geminiService';

const INITIAL_MONEY = 50000000;

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null); 
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>({
    companyName: "Gemini",
    groupName: "Your Group",
    groupType: GroupType.GIRL_GROUP, 
    money: INITIAL_MONEY,
    fandom: {
        size: 5000,
        name: "Stars",
        buyingPower: 60,
        streamingPower: 80,
        loyalty: 90,
        type: 'Domestic'
    },
    fanVotes: 500,
    reputation: 10,
    turn: 1,
    currentTrend: Concept.CUTE, 
    trainees: [],
    activeIdols: [],
    releases: [],
    competitors: [],
    notifications: [{
        id: 'init',
        title: 'Welcome CEO',
        message: 'The industry awaits. Scout trainees and debut your group!',
        type: 'info',
        date: 1
    }],
    awards: [],
    currentNominations: [],
    groupHistory: []
  });

  // Initialization
  useEffect(() => {
    const initGame = async () => {
      if (gameState.trainees.length === 0 && gameState.turn === 1) {
         const newTrainees = await generateTrainees(3);
         const completeTrainees: Idol[] = newTrainees.map((t, i) => ({
             ...t,
             id: `init-${i}`,
             energy: 100,
             stress: 0,
             imageSeed: Math.floor(Math.random() * 1000)
         } as Idol));

         const competitors = await generateCompetitors(5);
         const historicalReleases = generateHistoricalData(competitors);

         setGameState(prev => ({
             ...prev,
             trainees: completeTrainees,
             competitors: competitors,
             releases: historicalReleases
         }));
      }
    };
    initGame();
  }, []);

  const addNotification = (title: string, message: string, type: GameNotification['type'] = 'info') => {
    setGameState(prev => ({
        ...prev,
        notifications: [
            ...prev.notifications,
            { id: Date.now().toString(), title, message, type, date: prev.turn }
        ]
    }));
  };

  const handleRecruit = async () => {
    setIsProcessing(true);
    const cost = 1000000;
    if (gameState.money < cost) {
        addNotification("Recruitment Failed", "Not enough money.", "danger");
        setIsProcessing(false);
        return;
    }
    try {
        const newTrainees = await generateTrainees(1);
        const trainee = newTrainees[0];
        const newIdol: Idol = {
            ...trainee,
            id: `recruit-${Date.now()}`,
            energy: 100,
            stress: 0,
            imageSeed: Math.floor(Math.random() * 1000)
        } as Idol;

        setGameState(prev => ({
            ...prev,
            money: prev.money - cost,
            trainees: [...prev.trainees, newIdol]
        }));
        addNotification("Scout Successful", `Recruited ${newIdol.name}!`, "success");
    } catch (e) {
        addNotification("Error", "Scouting failed.", "danger");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleReleaseSong = async (title: string, concept: Concept, style: ReleaseStyle, marketFocus: 'Domestic' | 'Global' | 'Balanced', cost: number, type: 'Single' | 'Album', promo: 'None' | 'Teasing') => {
      setIsProcessing(true);
      const avgStats = gameState.activeIdols.reduce((acc, idol) => {
          return acc + (idol.stats.vocal + idol.stats.dance + idol.stats.rap + idol.stats.charisma + idol.stats.visual) / 5;
      }, 0) / (gameState.activeIdols.length || 1);

      // Check for oversaturation (release within last 4 weeks)
      const recentRelease = gameState.releases.find(r => r.isUser && (gameState.turn - r.dateReleased) < 4);
      const fatigue = recentRelease ? 0.8 : 1.0; 

      const outcome = await generateComebackOutcome(gameState.groupName, concept, style, title, avgStats, gameState.fandom.size, cost);

      const newRelease: SongRelease = {
          id: `rel-${Date.now()}`,
          artistId: "user-group",
          artistName: gameState.groupName,
          artistType: gameState.groupType,
          title,
          concept,
          style, 
          marketFocus,
          releaseType: type,
          quality: Math.floor(outcome.qualityScore * fatigue),
          dateReleased: gameState.turn + (promo === 'Teasing' ? 1 : 0), 
          
          stats: {
             weeklyPhysical: 0, weeklyDigitalDownloads: 0, weeklyStreamsKR: 0, weeklyStreamsGlobal: 0,
             totalPhysical: 0, totalDigitalDownloads: 0, totalStreamsKR: 0, totalStreamsGlobal: 0,
             uniqueListenersKR: 0, mvViews: 0, weeklyStreamsBugs: 0, totalStreamsBugs: 0
          },
          marketingStats: {
             playlistReach: 0,
             publicInterest: promo === 'Teasing' ? 20 : 0, 
             adSpend: 0
          },
          tiktokStats: {
              totalVideos: 0,
              weeklyVideos: 0,
              totalViews: 0,
              challengeName: `#${title.replace(/\s/g, '')}Challenge`,
              isTrending: false
          },
          reviews: {
              criticScore: outcome.criticScore,
              publicScore: outcome.publicScore,
              summary: outcome.reviewSummary
          },
          tracklist: outcome.tracklist || [],
          bSides: (outcome.tracklist || []).map(t => ({ title: t, rank: null })),
          musicShowHistory: [],
          isViral: false,
          promotionalStatus: promo,
          certifications: [],
          currentRankKorea: null, peakRankKorea: 201, chartRunKorea: [],
          currentRankBugs: null, peakRankBugs: 201, chartRunBugs: [],
          currentRankGlobal: null, peakRankGlobal: 201, chartRunGlobal: [],
          musicShowWins: 0,
          netizenComments: outcome.netizenComments,
          isUser: true,
          votesAllocated: 0
      };

      setGameState(prev => ({
          ...prev,
          money: prev.money - cost,
          releases: [newRelease, ...prev.releases]
      }));
      
      if (fatigue < 1.0) {
          addNotification("Oversaturation", "Fans are tired from recent releases. Initial impact reduced by 20%.", "warning");
      }
      addNotification("Comeback Set", `${title} scheduled. Strategy: ${marketFocus}.`, "success");
      setIsProcessing(false);
      setActiveTab('dashboard');
  };

  // --- REFINED SIMULATION ENGINE ---

  const simulateCharts = async (currentGameState: GameState) => {
    let releases = [...currentGameState.releases];
    let notifications = [...currentGameState.notifications];
    let newMoney = currentGameState.money;
    let newFandom = { ...currentGameState.fandom };
    let currentTrend = currentGameState.currentTrend;
    let awards = [...currentGameState.awards];
    let currentNominations = [...currentGameState.currentNominations];
    const currentWeek = currentGameState.turn + 1;

    // 0. Smart Bot Logic
    // If #1 song is weak (e.g., < 1M streams), bots see opportunity
    const topSong = releases.find(r => r.currentRankKorea === 1);
    const topSongWeak = topSong && topSong.stats.weeklyStreamsKR < 1000000;
    
    // Bot Releases
    for (const comp of currentGameState.competitors) {
        for (const artist of comp.artists) {
            const lastRelease = releases.find(r => r.artistId === artist.id);
            const weeksSince = lastRelease ? currentWeek - lastRelease.dateReleased : 99;
            
            let baseChance = 0.05;
            if (weeksSince > 20) baseChance += 0.2;
            if (topSongWeak && weeksSince > 10) baseChance += 0.3; // Attack weak chart

            if (Math.random() < baseChance) {
                const concepts = Object.values(Concept);
                const concept = Math.random() > 0.6 ? currentTrend : concepts[Math.floor(Math.random() * concepts.length)];
                const title = getRandomSongTitle(concept);
                
                const aiRelease: SongRelease = {
                    id: `ai-${Date.now()}-${artist.id}`,
                    artistId: artist.id, artistName: artist.name, artistType: artist.type,
                    title, concept, style: ReleaseStyle.COMMERCIAL, marketFocus: 'Balanced',
                    releaseType: 'Single', quality: artist.skillLevel + Math.floor(Math.random() * 20),
                    dateReleased: currentWeek,
                    stats: { weeklyPhysical: 0, weeklyDigitalDownloads: 0, weeklyStreamsKR: 0, weeklyStreamsGlobal: 0, totalPhysical: 0, totalDigitalDownloads: 0, totalStreamsKR: 0, totalStreamsGlobal: 0, uniqueListenersKR: 0, mvViews: 0, weeklyStreamsBugs: 0, totalStreamsBugs: 0 },
                    marketingStats: { playlistReach: 0, publicInterest: 0, adSpend: 0 },
                    tiktokStats: { totalVideos: 0, weeklyVideos: 0, totalViews: 0, challengeName: `#${title}Challenge`, isTrending: false },
                    reviews: { criticScore: 50, publicScore: 50, summary: "Generated" },
                    tracklist: [], bSides: [], musicShowHistory: [], isViral: false, promotionalStatus: 'Done', certifications: [],
                    currentRankKorea: null, peakRankKorea: 201, chartRunKorea: [], currentRankBugs: null, peakRankBugs: 201, chartRunBugs: [], currentRankGlobal: null, peakRankGlobal: 201, chartRunGlobal: [],
                    musicShowWins: 0, netizenComments: [], isUser: false, votesAllocated: 0
                };
                releases.unshift(aiRelease);
            }
        }
    }

    // 1. Process All Releases
    releases = releases.map(r => {
        let fandom = r.isUser ? newFandom : currentGameState.competitors.find(c => c.artists.some(a => a.id === r.artistId))?.artists.find(a => a.id === r.artistId)?.fandom;
        if (!fandom) fandom = { size: 1000, name: 'Unknown', buyingPower: 50, streamingPower: 50, loyalty: 50, type: 'Balanced' };

        const weeksOld = currentWeek - r.dateReleased;
        if (weeksOld < 0) return r; 

        let decayMod = r.style === ReleaseStyle.COMMERCIAL ? 1.2 : 0.8;
        let streamMod = r.style === ReleaseStyle.COMMERCIAL ? 1.2 : 0.9;
        const criticFactor = r.reviews.criticScore > 80 ? 0.7 : (r.reviews.criticScore < 50 ? 1.3 : 1.0);
        
        let timeRetention = 0;
        if (weeksOld <= 4) timeRetention = 1.0 - (weeksOld * 0.03 * decayMod); 
        else if (weeksOld <= 12) timeRetention = 0.88 * Math.pow(0.85 * decayMod, weeksOld - 4); 
        else timeRetention = 0.25 * Math.pow(0.98 * criticFactor, weeksOld - 12); 

        // TikTok Logic
        const tiktokGrowthBase = r.style === ReleaseStyle.COMMERCIAL ? 500 : 100;
        const weeklyVideos = Math.floor(tiktokGrowthBase * Math.random() * (r.isViral ? 5.0 : 1.0) * timeRetention);
        const newTikTokStats = { ...r.tiktokStats, totalVideos: r.tiktokStats.totalVideos + weeklyVideos, weeklyVideos, totalViews: r.tiktokStats.totalViews + (weeklyVideos * 500) };
        let isNowViral = r.isViral || (!r.isViral && weeklyVideos > 2000);

        // STREAMS & MARKET FOCUS
        const qualityResilience = (r.quality / 100) * 0.4; 
        const isTrending = r.concept === currentTrend ? 1.2 : 1.0;
        const viralBoost = isNowViral ? 4.0 : 1.0;
        const marketingInterestMultiplier = 1 + (r.marketingStats.publicInterest / 25);
        
        let domesticMult = 1.0;
        let globalMult = 1.0;
        if (r.marketFocus === 'Domestic') { domesticMult = 1.3; globalMult = 0.7; }
        else if (r.marketFocus === 'Global') { domesticMult = 0.7; globalMult = 1.3; }

        const publicMultiplier = Math.max(0.01, (timeRetention + qualityResilience) * isTrending * viralBoost * marketingInterestMultiplier * streamMod);
        
        const baseStreamsKR = fandom.size * (fandom.streamingPower / 50) * 10;
        const weeklyStreamsKR = Math.floor(baseStreamsKR * publicMultiplier * domesticMult);
        
        const tiktokStreamBonus = Math.floor(newTikTokStats.weeklyVideos * 100); 
        const playlistStreamBonus = (r.marketingStats.playlistReach || 0) * 0.05; 
        const weeklyStreamsGlobal = Math.floor(((baseStreamsKR * publicMultiplier * 2.0) + playlistStreamBonus + tiktokStreamBonus) * globalMult);
        const weeklyStreamsBugs = Math.floor(baseStreamsKR * publicMultiplier * 0.5 * domesticMult);

        // Streaming Equivalent Sales (1500 streams = 1 unit)
        const streamingSales = Math.floor((weeklyStreamsKR + weeklyStreamsGlobal) / 1500);

        // Physical
        let weeklyPhysical = 0;
        if (r.releaseType === 'Album' && weeksOld < 8) {
             const decay = Math.pow(0.5, weeksOld);
             weeklyPhysical = Math.floor(fandom.size * (fandom.buyingPower/100) * r.quality/50 * decay);
        }

        const totalPhysical = r.stats.totalPhysical + weeklyPhysical + streamingSales; // Add SEA to total physical for chart purposes? Or keep separate?
        // Let's keep SEA separate in logic but add to a "sales" metric for charts if needed. 
        // For simplicity in this game, we treat `totalPhysical` as "Sales Points" which now includes SEA.
        
        return {
            ...r,
            isViral: isNowViral,
            tiktokStats: newTikTokStats,
            stats: {
                ...r.stats,
                weeklyPhysical: weeklyPhysical + streamingSales, // Visual combo
                totalPhysical: totalPhysical,
                weeklyStreamsKR, totalStreamsKR: r.stats.totalStreamsKR + weeklyStreamsKR,
                uniqueListenersKR: Math.floor(weeklyStreamsKR * 0.3),
                weeklyStreamsBugs, totalStreamsBugs: (r.stats.totalStreamsBugs || 0) + weeklyStreamsBugs,
                weeklyStreamsGlobal, totalStreamsGlobal: r.stats.totalStreamsGlobal + weeklyStreamsGlobal,
                mvViews: r.stats.mvViews + weeklyStreamsGlobal
            },
            marketingStats: { ...r.marketingStats, publicInterest: Math.max(0, r.marketingStats.publicInterest - 5) }
        };
    });

    // 2. Ranking Logic
    const sortedMelon = [...releases].sort((a, b) => b.stats.uniqueListenersKR - a.stats.uniqueListenersKR);
    const sortedBugs = [...releases].sort((a, b) => b.stats.weeklyStreamsBugs - a.stats.weeklyStreamsBugs);
    const sortedGlobal = [...releases].sort((a, b) => b.stats.weeklyStreamsGlobal - a.stats.weeklyStreamsGlobal);

    releases = releases.map(r => {
        const mIdx = sortedMelon.findIndex(s => s.id === r.id);
        const bIdx = sortedBugs.findIndex(s => s.id === r.id);
        const gIdx = sortedGlobal.findIndex(s => s.id === r.id);

        const updateRank = (idx: number, peak: number, history: any[]) => idx < 200 && idx !== -1 ? { current: idx + 1, peak: Math.min(peak, idx + 1), history: [...history, { week: currentWeek, rank: idx + 1 }] } : { current: null, peak, history };

        const m = updateRank(mIdx, r.peakRankKorea, r.chartRunKorea);
        const b = updateRank(bIdx, r.peakRankBugs, r.chartRunBugs);
        const g = updateRank(gIdx, r.peakRankGlobal, r.chartRunGlobal);

        return { ...r, currentRankKorea: m.current, peakRankKorea: m.peak, chartRunKorea: m.history, currentRankBugs: b.current, peakRankBugs: b.peak, chartRunBugs: b.history, currentRankGlobal: g.current, peakRankGlobal: g.peak, chartRunGlobal: g.history };
    });

    // 3. Competitive Music Show Logic
    const shows = [
        { name: 'The Show', weights: { digital: 0.4, physical: 0.1, sns: 0.2, vote: 0.15 } },
        { name: 'Show Champion', weights: { digital: 0.35, physical: 0.15, sns: 0.2, vote: 0.15 } },
        { name: 'M Countdown', weights: { digital: 0.45, physical: 0.15, sns: 0.15, vote: 0.1 } },
        { name: 'Music Bank', weights: { digital: 0.6, physical: 0.05, sns: 0, vote: 0.1 } },
        { name: 'Inkigayo', weights: { digital: 0.55, physical: 0.1, sns: 0.3, vote: 0.05 } },
    ];

    // Identify Top 3 candidates across ALL releases (User + Bot) based on Melon chart
    // We use chart performance as eligibility
    const topCandidates = releases
        .filter(r => (currentWeek - r.dateReleased) < 8 && r.currentRankKorea !== null)
        .sort((a, b) => (a.currentRankKorea || 999) - (b.currentRankKorea || 999)) // Lower rank is better
        .slice(0, 3);

    // Normalize stats for scoring
    const maxDig = Math.max(...topCandidates.map(n => n.stats.weeklyStreamsKR)) || 1;
    const maxPhy = Math.max(...topCandidates.map(n => n.stats.weeklyPhysical)) || 1;
    const maxSNS = Math.max(...topCandidates.map(n => n.stats.mvViews)) || 1;
    const maxVote = Math.max(...topCandidates.map(n => n.votesAllocated)) || 1;

    for (const show of shows) {
        // Calculate scores for top candidates
        const scoredCandidates: MusicShowCandidate[] = topCandidates.map(r => {
             const scoreDig = (r.stats.weeklyStreamsKR / maxDig) * 10000 * show.weights.digital;
             const scorePhy = (r.stats.weeklyPhysical / maxPhy) * 10000 * show.weights.physical;
             const scoreSNS = (r.stats.mvViews / maxSNS) * 10000 * show.weights.sns;
             const scoreVote = (r.votesAllocated / maxVote) * 10000 * show.weights.vote;
             const scoreBroadcast = Math.random() * 2000;
             const totalScore = Math.floor(scoreDig + scorePhy + scoreSNS + scoreVote + scoreBroadcast);

             return {
                 artistName: r.artistName,
                 songTitle: r.title,
                 score: totalScore,
                 isUser: r.isUser,
                 breakdown: { digital: scoreDig, physical: scorePhy, sns: scoreSNS, votes: scoreVote, broadcast: scoreBroadcast }
             };
        });

        // Determine Winner
        if (scoredCandidates.length > 0) {
            const winner = scoredCandidates.reduce((prev, current) => (prev.score > current.score) ? prev : current);
            
            // Push result to EVERYONE involved (so user sees it even if they lost)
            // But we primarily attach it to the candidate songs so we can find it later
            releases = releases.map(r => {
                 // Is this release one of the candidates?
                 const candidateInfo = scoredCandidates.find(c => c.songTitle === r.title && c.artistName === r.artistName);
                 
                 if (candidateInfo) {
                     const history = [...r.musicShowHistory];
                     const result: MusicShowResult = {
                         showName: show.name,
                         week: currentWeek,
                         rank: winner === candidateInfo ? 1 : 2,
                         score: candidateInfo.score,
                         won: winner === candidateInfo,
                         candidates: scoredCandidates // Save full context
                     };
                     history.push(result);
                     
                     let wins = r.musicShowWins;
                     if (winner === candidateInfo) {
                         wins++;
                         if (r.isUser) {
                             notifications.push({ id: `win-${show.name}-${currentWeek}`, title: "Music Show Win", message: `Won ${show.name} with ${r.title}!`, type: 'success', date: currentWeek });
                             newFandom.size += 200;
                         }
                     }
                     return { ...r, musicShowWins: wins, musicShowHistory: history };
                 }
                 return r;
            });
        }
    }

    releases.sort((a, b) => b.dateReleased - a.dateReleased);

    // Update Money (Physical Sales only - Streaming is separate revenue usually but simplified here)
    // We already added streaming sales to 'weeklyPhysical' for chart logic. 
    // Let's assume physical portion generates high revenue, streaming low.
    const userActiveReleases = releases.filter(r => r.isUser && (currentWeek - r.dateReleased) === 0);
    userActiveReleases.forEach(r => {
        // Approximate real physical vs streaming
        const realPhysical = r.stats.weeklyPhysical - Math.floor((r.stats.weeklyStreamsKR + r.stats.weeklyStreamsGlobal)/1500);
        newMoney += (realPhysical * 1500); 
    });
    // Streaming Revenue
    const userStreams = releases.filter(r => r.isUser).reduce((acc, r) => acc + r.stats.weeklyStreamsGlobal + r.stats.weeklyStreamsKR, 0);
    newMoney += (userStreams * 0.15); 

    return {
        releases, notifications, money: Math.floor(newMoney), fandom: newFandom, currentTrend, awards, currentNominations
    };
  };

  const advanceTurn = async () => {
      setIsProcessing(true);
      const nextTurn = gameState.turn + 1;
      const simResult = await simulateCharts(gameState);
      const maintenance = 500000 + (gameState.activeIdols.length * 100000);
      const recover = (i: Idol) => ({ ...i, energy: Math.min(100, i.energy + 20), stress: Math.max(0, i.stress - 10) });

      // Track Weekly Group Progress
      const totalStreams = simResult.releases.filter(r => r.isUser).reduce((acc, r) => acc + r.stats.totalStreamsKR + r.stats.totalStreamsGlobal, 0);
      const historyEntry = {
          week: nextTurn,
          totalStreams: totalStreams,
          fans: simResult.fandom.size,
          money: simResult.money
      };

      setGameState(prev => ({
          ...prev,
          turn: nextTurn,
          money: simResult.money - maintenance,
          fandom: simResult.fandom,
          fanVotes: prev.fanVotes + 100, 
          releases: simResult.releases,
          notifications: simResult.notifications,
          currentTrend: simResult.currentTrend,
          awards: simResult.awards,
          activeIdols: prev.activeIdols.map(recover),
          trainees: prev.trainees.map(recover),
          groupHistory: [...prev.groupHistory, historyEntry]
      }));
      setIsProcessing(false);
  };

  const handleUpdateGroupName = (name: string) => {
    setGameState(prev => ({ ...prev, groupName: name }));
  };

  const handleDebutTrainee = (id: string) => {
      setGameState(prev => {
          const trainee = prev.trainees.find(t => t.id === id);
          if (!trainee) return prev;
          return {
              ...prev,
              trainees: prev.trainees.filter(t => t.id !== id),
              activeIdols: [...prev.activeIdols, trainee]
          };
      });
      addNotification("Debut", "A new star is born!", "success");
  };

  const handleMarketingAction = (songId: string, type: 'public' | 'global' | 'playlist', actionName: string, cost: number, effectValue: number, energyCost: number) => {
      setGameState(prev => {
          const updatedReleases = prev.releases.map(r => {
              if (r.id === songId) {
                  const newStats = { ...r.marketingStats };
                  if (type === 'public') newStats.publicInterest += effectValue;
                  if (type === 'playlist') newStats.playlistReach += effectValue;
                  // simplified global/viral logic handled in simulation usually, but we can set flags or stats here
                  return { ...r, marketingStats: newStats };
              }
              return r;
          });
          const updatedIdols = prev.activeIdols.map(i => ({...i, energy: Math.max(0, i.energy - energyCost)}));
          return { ...prev, money: prev.money - cost, releases: updatedReleases, activeIdols: updatedIdols };
      });
      addNotification("Marketing", `${actionName} executed.`, "success");
  };

  const handleVote = (songId: string, amount: number) => {
      setGameState(prev => {
          const updatedReleases = prev.releases.map(r => {
              if (r.id === songId) return { ...r, votesAllocated: r.votesAllocated + amount };
              return r;
          });
          return { ...prev, releases: updatedReleases, fanVotes: prev.fanVotes - amount };
      });
  };

  const handleBusinessAction = (action: string, cost: number, rewardMoney: number, rewardFans: number, energyCost: number) => {
      setGameState(prev => {
          const updatedIdols = prev.activeIdols.map(i => ({...i, energy: Math.max(0, i.energy - energyCost)}));
          return {
              ...prev,
              money: prev.money - cost + rewardMoney,
              fandom: { ...prev.fandom, size: prev.fandom.size + rewardFans },
              activeIdols: updatedIdols
          };
      });
      addNotification("Business", `${action} completed.`, "success");
  };

  const renderContent = () => {
    if (selectedSongId) {
        return <SingleDetail songId={selectedSongId} gameState={gameState} onBack={() => setSelectedSongId(null)} />;
    }
    if (selectedArtistId) {
      return <ArtistDetail artistId={selectedArtistId} gameState={gameState} onBack={() => setSelectedArtistId(null)} />;
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard gameState={gameState} />;
      case 'group': return (
        <GroupPage 
            gameState={gameState} 
            onUpdateName={handleUpdateGroupName} 
            onToggleRole={(id, role) => {
                setGameState(prev => {
                    const updated = prev.activeIdols.map(i => i.id === id ? {...i, positions: i.positions.includes(role) ? i.positions.filter(p=>p!==role) : [...i.positions, role]} : i);
                    return {...prev, activeIdols: updated};
                })
            }} 
        />
      );
      case 'trainees': return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Trainee Roster</h2>
                <button onClick={handleRecruit} disabled={isProcessing} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold">Scout (-¥1M)</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gameState.trainees.map(trainee => (
                    <div key={trainee.id} className="relative">
                        <IdolCard idol={trainee} onTrain={(id, stat) => {
                             setGameState(prev => {
                                 // Simple train logic for UI responsiveness
                                 const updated = prev.trainees.map(t => t.id === id ? {...t, stats: {...t.stats, [stat]: t.stats[stat]+1}} : t);
                                 return {...prev, trainees: updated, money: prev.money - 100000};
                             })
                        }} showTraining={true} />
                        <button onClick={() => handleDebutTrainee(trainee.id)} className="absolute top-4 right-4 bg-violet-600 text-xs text-white px-3 py-1 rounded-full">Promote</button>
                    </div>
                ))}
            </div>
        </div>
      );
      case 'studio': return <Production gameState={gameState} onRelease={handleReleaseSong} isProcessing={isProcessing} />;
      case 'marketing': return <Marketing gameState={gameState} onPromote={handleMarketingAction} isProcessing={isProcessing} />;
      case 'charts': return <ChartPage gameState={gameState} onArtistClick={(id) => {
          setSelectedArtistId(id);
      }} />;
      case 'musicshows': return <MusicShows gameState={gameState} onVote={handleVote} />;
      case 'business': return <Business gameState={gameState} onAction={handleBusinessAction} isProcessing={isProcessing} />;
      case 'streaming': return <StreamingPage gameState={gameState} />;
      default: return null;
    }
  };

  return (
    <Layout 
      gameState={gameState} 
      activeTab={activeTab} 
      setActiveTab={(tab) => { setActiveTab(tab); setSelectedArtistId(null); setSelectedSongId(null); }}
      advanceTurn={advanceTurn}
      isProcessing={isProcessing}
    >
      {activeTab === 'dashboard' && gameState.releases.length > 0 && gameState.releases[0].isUser && (
          <div className="mb-4">
              <button onClick={() => setSelectedSongId(gameState.releases[0].id)} className="text-sm text-slate-400 hover:text-white underline">
                  View Latest Single Details &gt;
              </button>
          </div>
      )}
      {renderContent()}
    </Layout>
  );
}