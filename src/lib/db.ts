import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Work, Chapter, CreativeCard, PlanningCard, Comment } from './types';

const dbPath = path.join(process.cwd(), 'data', 'novel_app.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize database schema
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS works (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      summary TEXT,
      coverUrl TEXT,
      category TEXT,
      fandoms TEXT, -- JSON string array
      rating TEXT,
      archiveWarnings TEXT, -- JSON string array
      relationships TEXT, -- JSON string array
      characters TEXT, -- JSON string array
      tags TEXT, -- JSON string array
      status TEXT,
      wordCount INTEGER DEFAULT 0,
      kudosCount INTEGER DEFAULT 0,
      bookmarkCount INTEGER DEFAULT 0,
      commentCount INTEGER DEFAULT 0,
      language TEXT DEFAULT 'English',
      authorName TEXT DEFAULT 'Anonymous Writer',
      authorAvatar TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS chapters (
      id TEXT PRIMARY KEY,
      workId TEXT NOT NULL,
      chapterNumber INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      summary TEXT,
      startNotes TEXT,
      endNotes TEXT,
      wordCount INTEGER DEFAULT 0,
      publishedAt TEXT,
      FOREIGN KEY (workId) REFERENCES works(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS creative_cards (
      id TEXT PRIMARY KEY,
      workId TEXT,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      subtitle TEXT,
      avatarUrl TEXT,
      summary TEXT,
      tags TEXT, -- JSON array
      fields TEXT, -- JSON array of CardField
      connections TEXT, -- JSON array of CardConnection
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS planning_cards (
      id TEXT PRIMARY KEY,
      workId TEXT NOT NULL,
      boardType TEXT NOT NULL,
      act TEXT,
      chapterId TEXT,
      title TEXT NOT NULL,
      content TEXT,
      status TEXT DEFAULT 'idea',
      position INTEGER DEFAULT 0,
      color TEXT,
      FOREIGN KEY (workId) REFERENCES works(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      workId TEXT NOT NULL,
      chapterId TEXT,
      username TEXT NOT NULL,
      userAvatar TEXT,
      content TEXT NOT NULL,
      createdAt TEXT,
      FOREIGN KEY (workId) REFERENCES works(id) ON DELETE CASCADE
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  const existingWorks = db.prepare('SELECT COUNT(*) as count FROM works').get() as { count: number };
  if (existingWorks.count > 0) return;

  const now = new Date().toISOString();

  // Seed Work 1: Cyberpunk / Urban Fantasy (Original)
  const work1Id = 'work-1';
  db.prepare(`
    INSERT INTO works (
      id, title, summary, coverUrl, category, fandoms, rating, archiveWarnings,
      relationships, characters, tags, status, wordCount, kudosCount, bookmarkCount, commentCount, language, authorName, authorAvatar, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    work1Id,
    'Chronicles of Aether & Steel',
    'In a rain-slicked metropolis where ancient magic bleeds into corporate cybernetics, a disgraced arcanist and a rogue street runner race to decipher a forgotten codex before the Neon Syndicate burns the city to ash.',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    'Original',
    JSON.stringify(['Original Work']),
    'Teen And Up Audiences',
    JSON.stringify(['Graphic Depictions Of Violence']),
    JSON.stringify(['Kaelen Vance/Lyra Mercer']),
    JSON.stringify(['Kaelen Vance', 'Lyra Mercer', 'Director Vane']),
    JSON.stringify(['Cyberpunk', 'Urban Fantasy', 'Slow Burn', 'Found Family', 'Magic System', 'Futuristic']),
    'In Progress',
    12450,
    342,
    89,
    24,
    'English',
    'AetheriumScribe',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    now,
    now
  );

  // Seed Chapters for Work 1
  db.prepare(`
    INSERT INTO chapters (id, workId, chapterNumber, title, content, summary, startNotes, endNotes, wordCount, publishedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'ch-1-1',
    work1Id,
    1,
    'Chapter 1: Neon Whispers in the Rain',
    `The neon glow of Sector 4 cut through the unrelenting rain like blood in water. Kaelen pulled the collar of his weathered leather coat higher against the chill, his fingers tracing the faint electric hum of the glyph stitched into his sleeve.

"You're running out of time, Arcanist," muttered a voice behind him.

Kaelen didn't turn. He already knew the distinct mechanical click of Lyra's cybernetic hand resting on her holster. "Time is an illusion in Sector 4, Lyra. You of all people should know that."

"Illusions don't stop the Syndicate's hit squads," she replied, stepping up alongside him under the flickering holographic billboard. "They found the vault entry code."

Kaelen stopped. The rain streamed off the brim of his hat. "How?"

"Someone leaked the encryption key. Someone inside the Guild."`,
    'Kaelen and Lyra meet under Sector 4 rains to discuss the breached vault.',
    'Welcome to Chapter 1! Feedback on the magic-tech blending is much appreciated.',
    'Thanks for reading! Chapter 2 updates every Friday.',
    1250,
    now
  );

  db.prepare(`
    INSERT INTO chapters (id, workId, chapterNumber, title, content, summary, startNotes, endNotes, wordCount, publishedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'ch-1-2',
    work1Id,
    2,
    'Chapter 2: The Vault beneath the Grid',
    `Descending into the under-grid was like stepping into the gullet of a dead leviathan. The air smelled of ozone, rust, and old decay.

Lyra sparked her forearm torch, throwing long, eerie shadows across the damp ferro-concrete walls. "The secondary terminal should be just ahead," she whispered, her voice tight.

"Keep your eyes peeled," Kaelen cautioned, adjusting the focus on his spell-tome tablet. "The warding runes down here haven't been maintained since the Collapse."

Suddenly, a metallic screech echoed from the gloom ahead. Lyra unholstered her sidearm in a single fluid movement, energy hum vibrating in the quiet corridors...`,
    'The duo delves into the ruined vault underneath Sector 4.',
    'Action picks up here!',
    'Drop a kudos if you enjoyed!',
    1800,
    now
  );

  // Seed Work 2: Fanfiction (Harry Potter / Alternate Universe)
  const work2Id = 'work-2';
  db.prepare(`
    INSERT INTO works (
      id, title, summary, coverUrl, category, fandoms, rating, archiveWarnings,
      relationships, characters, tags, status, wordCount, kudosCount, bookmarkCount, commentCount, language, authorName, authorAvatar, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    work2Id,
    'Echoes of the Starlight Observatory',
    'An alternate timeline where Hogwarts discovers an ancient astronomy tower hidden beneath the Black Lake, holding secrets about forgotten alchemy and stars that speak.',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
    'Fanfiction',
    JSON.stringify(['Harry Potter - J. K. Rowling']),
    'General Audiences',
    JSON.stringify(['No Archive Warnings Apply']),
    JSON.stringify(['Hermione Granger & Luna Lovegood']),
    JSON.stringify(['Hermione Granger', 'Luna Lovegood', 'Harry Potter', 'Severus Snape']),
    JSON.stringify(['Alternate Universe - Astronomy', 'Ancient Magic', 'Mystery', 'Friendship', 'Library Research']),
    'Complete',
    8500,
    1280,
    412,
    95,
    'English',
    'AstralWanderer',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    now,
    now
  );

  // Seed Chapter for Work 2
  db.prepare(`
    INSERT INTO chapters (id, workId, chapterNumber, title, content, summary, startNotes, endNotes, wordCount, publishedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'ch-2-1',
    work2Id,
    1,
    'Chapter 1: The Submerged Dome',
    `The Black Lake was unusually still tonight. Hermione pressed her palm against the enchanted glass of the submerged observatory, watching dark shapes glide through the murky depths.

"They swim according to the celestial alignment," Luna said quietly, sitting cross-legged on the brass-inlaid floor with a dusty star chart unfolded before her.

Hermione turned, her quill poised over her parchment. "You mean the Merpeople?"

"No," Luna smiled softly, pointing up at the domed ceiling where brass constellations rotated silently. "The stars themselves."`,
    'Hermione and Luna uncover the celestial secret of the Black Lake dome.',
    'A soft, atmospheric mystery fic!',
    'Thank you all for reading.',
    2100,
    now
  );

  // Seed Creative Cards
  db.prepare(`
    INSERT INTO creative_cards (id, workId, type, name, subtitle, avatarUrl, summary, tags, fields, connections, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'card-1',
    work1Id,
    'character',
    'Kaelen Vance',
    'Disgraced Arcanist & Code-Weaver',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    'Former high-ranking cipher scholar turned freelance mercenary after exposing corporate rune corruption.',
    JSON.stringify(['Protagonist', 'Arcane-Tech', 'Brooding']),
    JSON.stringify([
      { id: 'f1', label: 'Age', value: '29' },
      { id: 'f2', label: 'Abilities', value: 'Rune Inscription, Arcane Hacking, Flash Alchemy' },
      { id: 'f3', label: 'Motivation', value: 'Expose the Neon Syndicate and clear his late mentor\'s name.' },
      { id: 'f4', label: 'Flaw', value: 'Deeply distrustful, struggles to ask for assistance.' }
    ]),
    JSON.stringify([
      { targetCardId: 'card-2', targetCardName: 'Lyra Mercer', relation: 'Uneasy Partner & Covert Ally' },
      { targetCardId: 'card-3', targetCardName: 'Sector 4 Vault', relation: 'Target of Investigation' }
    ]),
    now,
    now
  );

  db.prepare(`
    INSERT INTO creative_cards (id, workId, type, name, subtitle, avatarUrl, summary, tags, fields, connections, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'card-2',
    work1Id,
    'character',
    'Lyra Mercer',
    'Rogue Street Runner',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
    'Master acrobat and cybernetic stealth specialist with deep ties to the underground resistance.',
    JSON.stringify(['Protagonist', 'Cybernetic', 'Agile']),
    JSON.stringify([
      { id: 'f1', label: 'Age', value: '26' },
      { id: 'f2', label: 'Augmentations', value: 'Monofilament whip, optical cloak, overclocked reflexes' },
      { id: 'f3', label: 'Quote', value: '"Rules are just suggestions written by people with money."' }
    ]),
    JSON.stringify([
      { targetCardId: 'card-1', targetCardName: 'Kaelen Vance', relation: 'Reluctant Comrade' }
    ]),
    now,
    now
  );

  db.prepare(`
    INSERT INTO creative_cards (id, workId, type, name, subtitle, avatarUrl, summary, tags, fields, connections, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'card-3',
    work1Id,
    'location',
    'Sector 4 Vault',
    'Subterranean Arcane Facility',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop',
    'A sealed pre-Collapse repository built 300 meters beneath Sector 4, rumored to contain uncorrupted ancient spell-matrices.',
    JSON.stringify(['Location', 'Vault', 'Pre-Collapse']),
    JSON.stringify([
      { id: 'f1', label: 'Security Level', value: 'Class-Omega Arcane Wards' },
      { id: 'f2', label: 'Current Owner', value: 'Disputed (Neon Syndicate Siege)' }
    ]),
    JSON.stringify([]),
    now,
    now
  );

  // Seed Planning Cards (Snowflake / Outlining)
  db.prepare(`
    INSERT INTO planning_cards (id, workId, boardType, act, chapterId, title, content, status, position, color)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'plan-1',
    work1Id,
    'snowflake',
    'Act 1: Setup',
    'ch-1-1',
    '1. The Inciting Incident',
    'Kaelen learns the vault encryption key has been stolen. He must form an alliance with Lyra before the Syndicate strikes.',
    'done',
    1,
    'bg-amber-500/10 border-amber-500/30'
  );

  db.prepare(`
    INSERT INTO planning_cards (id, workId, boardType, act, chapterId, title, content, status, position, color)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'plan-2',
    work1Id,
    'snowflake',
    'Act 1: Setup',
    'ch-1-2',
    '2. Descent into the Dark',
    'Kaelen & Lyra breach the under-grid security, encountering warding guardians.',
    'done',
    2,
    'bg-blue-500/10 border-blue-500/30'
  );

  db.prepare(`
    INSERT INTO planning_cards (id, workId, boardType, act, chapterId, title, content, status, position, color)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'plan-3',
    work1Id,
    'snowflake',
    'Act 2: Confrontation',
    '',
    '3. The Betrayal at Terminal 9',
    'A trusted contact in the Guild turns out to be on Director Vane\'s payroll, setting off alarms in the lower levels.',
    'drafting',
    3,
    'bg-purple-500/10 border-purple-500/30'
  );

  // Seed Comments
  db.prepare(`
    INSERT INTO comments (id, workId, chapterId, username, userAvatar, content, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'comm-1',
    work1Id,
    'ch-1-1',
    'CyberReader99',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    'The atmospheric writing in Sector 4 is so immersive! Love the dynamic between Kaelen and Lyra already.',
    now
  );

  db.prepare(`
    INSERT INTO comments (id, workId, chapterId, username, userAvatar, content, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'comm-2',
    work1Id,
    'ch-1-1',
    'AO3_Enthusiast',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop',
    'Leaving a kudos! Need chapter 2 ASAP please!',
    now
  );
}

// Ensure DB is initialized when file is loaded
initDb();
