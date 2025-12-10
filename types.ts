export enum IdolPosition {
  LEADER = 'Leader',
  VOCAL = 'Vocal',
  DANCE = 'Dance',
  RAP = 'Rap',
  VISUAL = 'Visual',
  CENTER = 'Center',
  MAKNAE = 'Maknae'
}

export enum Concept {
  CUTE = 'Cute',
  GIRL_CRUSH = 'Girl Crush',
  DARK = 'Dark',
  FRESH = 'Fresh',
  RETRO = 'Retro',
  HIPHOP = 'Hip Hop',
  BALLAD = 'Ballad'
}

export enum GroupType {
  BOY_GROUP = 'Boy Group',
  GIRL_GROUP = 'Girl Group',
  COED = 'Co-ed / Solo'
}

export enum ReleaseStyle {
  COMMERCIAL = 'Commercial',
  CONCEPTUAL = 'Conceptual'
}

export interface Idol {
  id: string;
  name: string;
  age: number;
  stats: {
    vocal: number;
    dance: number;
    rap: number;
    visual: number;
    charisma: number;
  };
  energy: number; // 0-100
  stress: number; // 0-100
  positions: IdolPosition[];
  imageSeed: number; 
}

export interface ChartEntry {
  week: number;
  rank: number;
  listeners?: number; 
}

export interface Certification {
  region: 'Korea' | 'Global';
  type: 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Million';
  dateEarned: number;
}

export interface MusicShowCandidate {
  artistName: string;
  songTitle: string;
  score: number;
  isUser: boolean;
  breakdown: {
    digital: number;
    physical: number;
    sns: number;
    votes: number;
    broadcast: number;
  }
}

export interface MusicShowResult {
  showName: string;
  week: number;
  rank: number;
  score: number;
  won: boolean;
  candidates: MusicShowCandidate[]; // Top 3 nominees for this show/week
}

export interface SongRelease {
  id: string;
  artistId: string; 
  artistName: string;
  artistType: GroupType; 
  title: string;
  concept: Concept;
  style: ReleaseStyle; 
  marketFocus: 'Domestic' | 'Global' | 'Balanced'; // New: Strategy
  releaseType: 'Single' | 'Album'; 
  quality: number; 
  dateReleased: number; // Turn number

  // --- Detailed Sales & Streaming ---
  stats: {
    weeklyPhysical: number;
    totalPhysical: number;
    weeklyDigitalDownloads: number;
    totalDigitalDownloads: number;
    
    weeklyStreamsKR: number; // Melon
    totalStreamsKR: number;
    uniqueListenersKR: number; 

    weeklyStreamsBugs: number; // Bugs
    totalStreamsBugs: number;

    weeklyStreamsGlobal: number; // Spotify
    totalStreamsGlobal: number;
    
    mvViews: number; // YouTube
  };
  
  // --- Marketing Stats ---
  marketingStats: {
    playlistReach: number; 
    publicInterest: number; 
    adSpend: number;
  };

  // --- TikTok & Social ---
  tiktokStats: {
    totalVideos: number;
    weeklyVideos: number;
    totalViews: number;
    challengeName: string;
    isTrending: boolean;
  };

  // --- Critical Reception ---
  reviews: {
    criticScore: number; // 0-100 (Metacritic)
    publicScore: number; // 0-100
    summary: string;
  };

  // --- Album Details ---
  tracklist: string[];
  bSides: { title: string, rank: number | null }[]; 

  // --- States ---
  isViral: boolean; 
  promotionalStatus: 'None' | 'Teasing' | 'Active' | 'Done';
  certifications: Certification[];

  // --- Chart Logic ---
  currentRankKorea: number | null; // Melon
  peakRankKorea: number;
  chartRunKorea: ChartEntry[]; 

  currentRankBugs: number | null; // Bugs
  peakRankBugs: number;
  chartRunBugs: ChartEntry[];

  currentRankGlobal: number | null; // Spotify
  peakRankGlobal: number;
  chartRunGlobal: ChartEntry[];

  musicShowWins: number;
  musicShowHistory: MusicShowResult[]; 
  netizenComments: string[];
  isUser: boolean;
  
  votesAllocated: number; 
}

export interface FandomStats {
  size: number;
  name: string;
  buyingPower: number; // 0-100
  streamingPower: number; // 0-100
  loyalty: number; // 0-100
  type: 'Domestic' | 'Global' | 'Balanced';
}

export interface Competitor {
  id: string;
  name: string;
  reputation: number;
  color: string;
  strategy: 'Aggressive' | 'Quality' | 'Viral'; // New: Bot behavior
  artists: {
    id: string;
    name: string;
    type: GroupType;
    concept: Concept;
    fandom: FandomStats;
    skillLevel: number; 
  }[];
}

export interface AwardNomination {
  id: string;
  awardShow: string; 
  category: string; 
  nomineeName: string; 
  artistId: string;
  releaseId?: string;
  isUser: boolean;
  score: number; 
}

export interface GroupHistoryEntry {
  week: number;
  totalStreams: number;
  fans: number;
  money: number;
}

export interface GameState {
  companyName: string;
  groupName: string;
  groupType: GroupType;
  money: number;
  fandom: FandomStats;
  fanVotes: number; 
  reputation: number;
  turn: number;
  currentTrend: Concept; 
  trainees: Idol[];
  activeIdols: Idol[];
  releases: SongRelease[]; 
  competitors: Competitor[];
  notifications: GameNotification[];
  awards: string[]; 
  currentNominations: AwardNomination[]; 
  groupHistory: GroupHistoryEntry[];
}

export interface GameNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  date: number;
}