# NovelCraft Studio 📚✨

A comprehensive, full-stack **Novel Management & Creative Writing Application** integrating feature sets from **Wattpad, FanFiction.net, Archive of Our Own (AO3), Storycamp, Wavemaker**, and custom **Character/World-Building Card Systems**.

---

## 🚀 Key Features

### 📖 Reader & Discovery Suite (AO3, Wattpad & FanFiction.net Inspired)
- **Advanced AO3-Style Search & Tag Filter**: Multi-attribute filtering across Fandoms, Character Pairings/Relationships, Freeform Tags, Content Ratings (`General Audiences`, `Teen And Up`, `Mature`, `Explicit`), Archive Warnings, and Word Count.
- **Customizable Reader View**: Toggleable reading modes (**Dark Mode**, **Sepia**, **Light Mode**), adjustable font sizes (`A-` / `A+`), and chapter navigation dropdown.
- **Community Reader Engagement**: Leave Kudos ❤️, Bookmark works 🔖, and post chapter-specific review comments.

### ✍️ Writer Studio & Focus Editor
- **Focus Writing Mode**: Clean, distraction-free prose editor with live session word counter and goal progress bar.
- **Quick Reference Lore Deck**: Pull-out sidebar displaying character profiles and world lore while writing.
- **Author Notes**: Dedicated input for Chapter Start Notes and End Notes.
- **AI Creative Co-Pilot**: In-editor AI writing assistant supporting prose continuation, text polishing, and plot brainstorming.

### 🃏 Creative World & Character Cards (Storycamp & Card System Inspired)
- **Visual Card Deck**: Interactive deck builder for Characters, Locations, Factions, Magic Systems, Items, and Lore.
- **Custom Key-Value Attributes**: Define custom properties (e.g. *Age*, *Abilities*, *Flaws*, *Security Level*).
- **Relational Network Graphs**: Link cards together with relationship labels (e.g. *Kaelen Vance* ➔ *Uneasy Partner & Covert Ally* ➔ *Lyra Mercer*).

### 📐 Plot Outliner & Story Lab (Wavemaker Inspired)
- **Snowflake Board**: 3-Act column structure (`Act 1: Setup`, `Act 2: Confrontation`, `Act 3: Resolution`) with drag/card positioning.
- **Scene Card Grid**: Visual card grid for scene organization and chapter linking.
- **Linear Timeline**: Step-by-step visual story arc timeline.

### 📤 Multi-Format Export Suite
- **Markdown (`.md`)**: Formatted document output ready for web posting.
- **HTML / Printable EPUB (`.html`)**: Styled eBook layout with embedded typography and chapter breaks.
- **Project Backup (`.json`)**: Raw backup containing all chapters, metadata, and lore cards.

---

## 🛠️ Local Setup Instructions

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Installation & Launch

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Access Application**:
   Open your browser and navigate to `http://localhost:3000`.

---

## 🧪 Running Integration Tests

Run the database and API models test suite with:
```bash
npx tsx src/lib/test-runner.ts
```

---

## 📁 Project Architecture

```
├── data/                    # SQLite database persistence directory (novel_app.db)
├── public/                  # Public assets & user uploaded media
├── src/
│   ├── app/
│   │   ├── api/             # REST API endpoints (works, chapters, cards, planning, upload, ai)
│   │   ├── page.tsx         # Main entry point & view switcher
│   ├── components/          # UI Components
│   │   ├── WriterStudio.tsx        # Focus Editor & Studio Workspace
│   │   ├── CreativeCardsTab.tsx    # Character & Lore Matrix Builder
│   │   ├── PlanningTab.tsx         # Snowflake / Scene Grid / Timeline Outliner
│   │   ├── NovelDiscovery.tsx      # AO3-style Tag Search & Archive
│   │   ├── ReaderView.tsx          # Reader Mode (Dark/Sepia/Light + Kudos)
│   │   ├── AuthorDashboard.tsx     # Author Stats & Writing Streak
│   │   └── ExportModal.tsx         # Markdown / HTML / JSON Exporter
│   └── lib/                 # Database schema (better-sqlite3) & TypeScript types
```
