import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Idol, Concept, IdolPosition, Competitor, SongRelease, ChartEntry, GroupType, FandomStats, ReleaseStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- SONG TITLE DATABASE ---
const SONG_TITLES_DB: Record<Concept, string[]> = {
  [Concept.CUTE]: [
    "Cheer Up", "Gee", "Candy Pop", "Heart Shaker", "Very Very Very", "Me Gustas Tu", "Pop!", "Smiley", "Rolling", "Bubble",
    "Ice Cream", "Glass Bead", "Secret Garden", "Coloring Book", "Knock Knock", "Likey", "What is Love?", "Signal", "TT", "Happy",
    "Mr. Chu", "NoNoNo", "LUV", "Remember", "Five", "Dumb Dumb", "Russian Roulette", "Rookie", "Power Up", "Umpah Umpah",
    "Queendom", "As If It's Your Last", "Forever Young", "Don't Know What To Do", "So Hot", "Tell Me", "Nobody", "2 Different Tears", "Be My Baby",
    "Love Bomb", "DKDK", "Fun!", "We Go", "Talk & Talk", "DM", "Stay This Way", "After School", "Weeekly", "Tag Me",
    "Zig Zag", "Hello", "Holiday Party", "Ven Para", "Bingle Bangle", "Excuse Me", "Heart Attack", "Short Hair", "Miniskirt", "Like a Cat",
    "Nonstop", "Dolphin", "Dun Dun Dance", "Real Love", "Summer Comes", "Bungee", "Fifth Season", "Windy Day", "Closer", "Cupid",
    "Hi High", "Butterfly", "So What", "Why Not?", "PTT (Paint The Town)", "Flip That", "Star", "Voice", "Hula Hoop", "Luminous",
    "Q&A", "Hands Up", "Bullet to the Heart", "Love So Sweet", "Ring Ring", "Bim Bam Bum", "Oopsy", "Crush", "Wannabe", "Dalla Dalla",
    "Icy", "Not Shy", "Mafia in the Morning", "Loco", "Sneakers", "Cheshire", "Cake", "Untouchable", "Algorhythm", "Gold"
  ],
  [Concept.GIRL_CRUSH]: [
    "I Am", "Kill This Love", "Next Level", "Savage", "Baddie", "Not Shy", "Mafia in the Morning", "Ddu-Du Ddu-Du", "How You Like That", "Spicy",
    "Black Mamba", "Hobgoblin", "Crazy", "Hate", "Adios", "Dun Dun", "La Di Da", "Bon Bon Chocolat", "Kill Bill", "Sixth Sense",
    "Abracadabra", "Sign", "Cleansing Cream", "Warm Hole", "Brave New World", "Kill Bill", "Wonder Woman", "Sixth Sense", "Hot Issue", "Muzik",
    "HuH", "Volume Up", "What's Your Name?", "Is It Poppin'?", "Red", "Roll Deep", "Babe", "Lip & Hip", "I'm Not Cool", "Ping Pong",
    "Nabillera", "Zoom", "Cold Blooded", "Gucci", "Nunu Nana", "What Type of X", "Maria", "Twit", "Eclipse", "Spit It Out",
    "Gotta Go", "Snapping", "Chica", "Stay Tonight", "Play", "Bicycle", "Killing Me", "Sparkling", "EENIE MEENIE", "I'm Ready",
    "Scream", "Boca", "Odd Eye", "BEcause", "Maison", "Vision", "Bonvoyage", "OOTD", "Justice", "Chase Me",
    "Good Night", "Fly High", "You and I", "What", "Piri", "Deja Vu", "Rose Blue", "R.o.S.E BLUE", "Full Moon", "Over the Sky",
    "Latata", "Hann (Alone)", "Senorita", "Uh-Oh", "Oh My God", "Dumdi Dumdi", "Hwaa", "Tomboy", "Nxde", "Queencard"
  ],
  [Concept.DARK]: [
    "Monster", "Psycho", "Voodoo Doll", "Chase Me", "Scream", "Tail", "Villain", "Tomboy", "Oh My God", "Lion",
    "Good Night", "Full Moon", "Hate You", "Abracadabra", "Volume Up", "Apple", "Witch", "Piri", "Deja Vu", "Sweet Crazy Love",
    "Bad Boy", "Peek-A-Boo", "Automatic", "Be Natural", "One of These Nights", "RBB (Really Bad Boy)", "Zimzalabim", "Chill Kill", "Cosmic", "28 Reasons",
    "Spider", "Anywhere But Home", "Crown", "Run Away", "Can't You See Me?", "Puma", "Blue Hour", "Frost", "Good Boy Gone Bad", "Sugar Rush Ride",
    "Chasing That Feeling", "Deja Vu", "Given-Taken", "Drunk-Dazed", "Tamed-Dashed", "Blessed-Cursed", "Future Perfect (Pass the MIC)", "Bite Me", "Sweet Venom", "Fatal Trouble",
    "Fear", "Hit", "Getting Closer", "Maestro", "Super", "Hot", "Rock with you", "Left & Right", "Home;Run", "Fearless",
    "Antifragile", "Unforgiven", "Eve, Psyche & The Bluebeard's wife", "Perfect Night", "Easy", "Smart", "Crazy", "Savage", "Drama", "Armageddon",
    "Supernova", "Girls", "Illusion", "Life's Too Short", "Welcome To MY World", "Spicy", "Better Things", "YOLO", "Tang! Tang! Tang!", "Hit Ya!"
  ],
  [Concept.FRESH]: [
    "Hype Boy", "Attention", "Ditto", "Love Dive", "After Like", "View", "Island", "Boogie Up", "Alcohol-Free", "Touch My Body",
    "Shake It", "Party", "Holiday", "Red Flavor", "Power Up", "Umpah Umpah", "Dance The Night Away", "Nonstop", "Dolphin", "Travel",
    "Rollin'", "We Ride", "Chi Mat Ba Ram", "After We Ride", "Thank You", "Up!", "Summer Rain", "Glassy", "Love Shhh!", "Smartphone",
    "Hate Rodrigo", "Taxi", "1/6", "Loveade", "Generation", "Rising", "Girls' Capitalism", "Invincible", "Assemble", "Colouring",
    "Bubble Gum", "How Sweet", "Super Shy", "ETA", "Cool With You", "Get Up", "ASAP", "Stereotype", "Run2U", "Beautiful Monster",
    "Teddy Bear", "Bubble", "Eleven", "Love Dive", "After Like", "Kitsch", "I Am", "Baddie", "Off The Record", "Either Way",
    "Heya", "Accendio", "Magnetic", "Lucky Girl Syndrome", "Spot!", "Sticky", "Over The Rainbow", "Summer Dream", "Love U", "I'm So Sick"
  ],
  [Concept.RETRO]: [
    "Tell Me", "Roly Poly", "Nobody", "Mago", "When We Disco", "Dynamite", "La Di Da", "Signal", "Alien", "Lady",
    "I Feel You", "Reboot", "Step", "Mamma Mia", "Bboom Bboom", "Lovey Dovey", "Shy Boy", "Magic", "Ring Ring", "Retro Future",
    "Disco", "Soul Lady", "Pporappippam", "Lilac", "Celebrity", "Coin", "Flu", "Ah Puh", "My Sea", "Epilogue",
    "Weekend", "INVU", "Can't Control Myself", "Some Nights", "Set Myself On Fire", "Toddler", "Cold As Hell", "Timeless", "Heart", "No Love Again",
    "You Better Not", "Ending Credits", "11:11", "I Got Love", "Fine", "Make Me Love You", "Four Seasons", "Spark", "Happy", "What Do I Call You",
    "To. X", "Fabulous", "Heaven", "Burn The Floor", "Siren", "Tail", "Gashina", "Heroine", "Noir", "Lalalay"
  ],
  [Concept.HIPHOP]: [
    "Mic Drop", "Dope", "Fire", "Boombayah", "Whistle", "Hard Carry", "God's Menu", "Back Door", "Maniac", "Shut Down",
    "Hello Bitches", "The Baddest Female", "Gucci", "Zoom", "Money", "Lalisa", "My Bag", "Uh-Oh", "Crazy Dog", "Nunu Nana",
    "Jikjin", "Darari", "Hello", "Bona Bona", "I Love You", "Boy", "Mmm", "My Treasure", "Orange", "Going Crazy",
    "Case 143", "S-Class", "Lalalala", "Chk Chk Boom", "Lose My Breath", "Megaverse", "Thunderous", "Domino", "Cheese", "The View",
    "Baggy Jeans", "Fact Check", "2 Baddies", "Kick It", "Cherry Bomb", "The 7th Sense", "Boss", "Make A Wish", "90's Love", "Resonance",
    "Sticker", "Lemonade", "Favorite", "Regular", "Simon Says", "Superhuman", "Highway to Heaven", "Punch", "Ridin'", "Boom"
  ],
  [Concept.BALLAD]: [
    "Through the Night", "Ending Scene", "Fine", "Stay", "Spring Day", "Missing You", "If You", "Eyes, Nose, Lips", "Breathe", "Downpour",
    "Universe", "Sing For You", "Miracles in December", "Goodbye", "Lonely", "Blue", "Palette", "Love Poem", "Eight", "Celebrity",
    "Knees", "The Shower", "Heart", "Twenty-Three", "Zeze", "Red Queen", "Shoes", "Jam Jam", "Glasses", "Dear Name",
    "Autumn Morning", "Sleepless Rainy Night", "Last Night Story", "Secret Garden", "Everyday with You", "My Old Story", "Love wins all", "Shopper", "Holssi", "Shh..",
    "Love lee", "Fry's Dream", "Either Way", "Off The Record", "Baddie", "Holy Moly", "Payback", "Lips", "Mine", "Tranquilizing",
    "Hero", "Love 119", "Get A Guitar", "Memories", "Talk Saxy", "Siren", "Impossible", "Boom Boom Bass", "Sudden Shower", "Eclipse"
  ]
};

export const getRandomSongTitle = (concept: Concept): string => {
  const titles = SONG_TITLES_DB[concept] || SONG_TITLES_DB[Concept.CUTE];
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  if (Math.random() < 0.1) return `${randomTitle} (Ver. ${Math.floor(Math.random() * 2024)})`;
  return randomTitle;
};

// --- Schemas ---

const traineeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    trainees: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          age: { type: Type.INTEGER },
          vocal: { type: Type.INTEGER },
          dance: { type: Type.INTEGER },
          rap: { type: Type.INTEGER },
          visual: { type: Type.INTEGER },
          charisma: { type: Type.INTEGER },
          mainPosition: { type: Type.STRING },
        },
        required: ["name", "age", "vocal", "dance", "rap", "visual", "charisma", "mainPosition"],
      },
    },
  },
};

const comebackSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    qualityScore: { type: Type.INTEGER, description: "Song quality 1-100" },
    conceptMatch: { type: Type.INTEGER, description: "How well the concept fits trends (0-100)" },
    criticScore: { type: Type.INTEGER, description: "Metacritic score 0-100" },
    publicScore: { type: Type.INTEGER, description: "Public rating 0-100" },
    reviewSummary: { type: Type.STRING, description: "One sentence review from a critic" },
    tracklist: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 4-8 song titles including the title track" 
    },
    netizenComments: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 distinct netizen comments about the song/MV"
    }
  },
  required: ["qualityScore", "conceptMatch", "criticScore", "publicScore", "reviewSummary", "tracklist", "netizenComments"]
};

// --- API Calls ---

export const generateCompetitors = async (count: number): Promise<Competitor[]> => {
  const names = ["Starship", "SM", "HYBE", "JYP", "YG", "Cube"];
  const artistNames = ["IVE", "Aespa", "NewJeans", "Stray Kids", "BLACKPINK", "G-IDLE"];
  const concepts = Object.values(Concept);
  const types = [GroupType.GIRL_GROUP, GroupType.GIRL_GROUP, GroupType.GIRL_GROUP, GroupType.BOY_GROUP, GroupType.GIRL_GROUP, GroupType.GIRL_GROUP];

  return Array.from({ length: count }).map((_, i) => {
    const isBoyGroup = types[i] === GroupType.BOY_GROUP;
    return {
      id: `comp-${i}`,
      name: names[i] || `Agency ${i}`,
      reputation: 60 + Math.floor(Math.random() * 35),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      strategy: ['Aggressive', 'Quality', 'Viral'][Math.floor(Math.random() * 3)] as 'Aggressive' | 'Quality' | 'Viral',
      artists: [{
        id: `art-${i}`,
        name: artistNames[i] || `Artist ${i}`,
        type: types[i],
        concept: concepts[Math.floor(Math.random() * concepts.length)],
        skillLevel: 70 + Math.floor(Math.random() * 30),
        fandom: {
          size: 50000 + Math.floor(Math.random() * 500000),
          name: "Fans",
          buyingPower: isBoyGroup ? 90 : 40, 
          streamingPower: isBoyGroup ? 50 : 90, 
          loyalty: 70,
          type: isBoyGroup ? 'Global' : 'Domestic'
        }
      }]
    };
  });
};

export const generateTrainees = async (count: number): Promise<Partial<Idol>[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate ${count} fictional K-pop trainee profiles. Names should be realistic Korean or English stage names. Stats should be between 10 and 70.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: traineeSchema,
        temperature: 1.0, 
      },
    });

    const data = JSON.parse(response.text || "{}");
    return data.trainees.map((t: any) => ({
      name: t.name,
      age: t.age,
      stats: {
        vocal: t.vocal,
        dance: t.dance,
        rap: t.rap,
        visual: t.visual,
        charisma: t.charisma,
      },
      positions: [t.mainPosition as IdolPosition],
    }));
  } catch (error) {
    return [
      {
        name: "Minji", age: 16, stats: { vocal: 40, dance: 50, rap: 20, visual: 60, charisma: 45 }, positions: [IdolPosition.VISUAL]
      }
    ];
  }
};

export const generateComebackOutcome = async (
  groupName: string,
  concept: Concept,
  style: ReleaseStyle,
  songTitle: string,
  avgStats: number,
  fandomSize: number,
  productionBudget: number
): Promise<{ qualityScore: number; conceptMatch: number; criticScore: number; publicScore: number; reviewSummary: string; tracklist: string[]; netizenComments: string[] }> => {
  
  const prompt = `
    Simulate K-pop release reception.
    Group: ${groupName}
    Song: "${songTitle}"
    Concept: ${concept}
    Style: ${style} (Conceptual implies high critic score, Commercial implies mass appeal)
    Avg Skill: ${avgStats}
    Budget: ${productionBudget}

    Return JSON with:
    - qualityScore (1-100)
    - conceptMatch (1-100)
    - criticScore (Metacritic style, 0-100)
    - publicScore (0-100)
    - reviewSummary (1 short sentence critic review)
    - tracklist (Array of 3-6 random B-side song titles fitting the concept)
    - netizenComments (3 realistic Korean netizen comments)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: comebackSchema,
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    return {
      qualityScore: 60,
      conceptMatch: 70,
      criticScore: 65,
      publicScore: 70,
      reviewSummary: "A standard release that plays it safe.",
      tracklist: ["Intro", "B-side 1", "B-side 2", "Outro"],
      netizenComments: ["Not bad!", "Expected more...", "The beat is catchy."]
    };
  }
};

export const generateSongTitle = async (concept: Concept): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a catchy K-pop song title for a ${concept} concept. Return ONLY the title string, nothing else. No quotes.`,
    });
    return response.text.trim().replace(/"/g, '');
  } catch (e) {
    return getRandomSongTitle(concept); 
  }
};

// New: Preload Data with new stats
export const generateHistoricalData = (competitors: Competitor[]): SongRelease[] => {
  const releases: SongRelease[] = [];
  const concepts = Object.values(Concept);
  
  for (let i = 0; i < 40; i++) {
    const comp = competitors[Math.floor(Math.random() * competitors.length)];
    const artist = comp.artists[0];
    const isAlbum = Math.random() > 0.6;
    const weeksAgo = Math.floor(Math.random() * 20) + 1;
    const concept = concepts[Math.floor(Math.random() * concepts.length)];
    
    const quality = 60 + Math.floor(Math.random() * 40);
    const startRank = Math.max(1, 100 - quality - Math.floor(Math.random() * 20));
    const history: ChartEntry[] = [];
    
    for(let w = weeksAgo; w >= 0; w--) {
         const rank = Math.min(200, startRank + Math.floor(Math.abs(w - weeksAgo/2) * 8));
         history.push({ week: 1 - w, rank, listeners: (101 - rank) * 5000 });
    }

    const totalStreams = artist.fandom.size * (weeksAgo * 5);
    const totalSales = Math.floor(artist.fandom.size * (artist.fandom.buyingPower / 100) * (isAlbum ? 1.5 : 0.5));

    releases.push({
        id: `hist-${i}`,
        artistId: artist.id,
        artistName: artist.name,
        artistType: artist.type,
        title: getRandomSongTitle(concept),
        concept: concept,
        style: Math.random() > 0.5 ? ReleaseStyle.COMMERCIAL : ReleaseStyle.CONCEPTUAL,
        marketFocus: ['Domestic', 'Global', 'Balanced'][Math.floor(Math.random() * 3)] as 'Domestic' | 'Global' | 'Balanced',
        releaseType: isAlbum ? 'Album' : 'Single',
        quality: quality,
        dateReleased: 1 - weeksAgo, 
        stats: {
            weeklyPhysical: 0,
            totalPhysical: totalSales,
            weeklyDigitalDownloads: 0,
            totalDigitalDownloads: totalSales * 2,
            weeklyStreamsKR: 0,
            totalStreamsKR: totalStreams,
            uniqueListenersKR: (201 - startRank) * 2000,
            weeklyStreamsBugs: 0,
            totalStreamsBugs: totalStreams * 0.8,
            weeklyStreamsGlobal: 0,
            totalStreamsGlobal: totalStreams * 2,
            mvViews: totalStreams * 0.5
        },
        marketingStats: {
            playlistReach: 0,
            publicInterest: 0,
            adSpend: 0
        },
        tiktokStats: {
            totalVideos: Math.floor(totalStreams * 0.01),
            weeklyVideos: 0,
            totalViews: Math.floor(totalStreams * 0.5),
            challengeName: `#${concept}Challenge`,
            isTrending: false
        },
        reviews: {
            criticScore: 60 + Math.floor(Math.random() * 30),
            publicScore: 70 + Math.floor(Math.random() * 20),
            summary: "A solid release from the archives."
        },
        tracklist: [],
        bSides: [],
        isViral: false,
        promotionalStatus: 'Done',
        certifications: [],
        currentRankKorea: history.length > 0 ? history[history.length -1].rank : null,
        peakRankKorea: startRank,
        chartRunKorea: history,
        currentRankBugs: Math.random() > 0.4 ? Math.min(200, startRank + 5) : null,
        peakRankBugs: startRank,
        chartRunBugs: [],
        currentRankGlobal: Math.random() > 0.5 ? Math.min(200, startRank + 10) : null,
        peakRankGlobal: startRank + 10,
        chartRunGlobal: [],
        musicShowWins: quality > 90 ? Math.floor(Math.random() * 3) : 0,
        musicShowHistory: [],
        netizenComments: [],
        isUser: false,
        votesAllocated: 0
    });
  }
  return releases;
};