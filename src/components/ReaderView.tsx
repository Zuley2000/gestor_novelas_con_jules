'use client';

import React, { useState, useEffect } from 'react';
import { Work, Chapter, Comment, CreativeCard } from '@/lib/types';
import {
  ArrowLeft, Heart, Bookmark, MessageSquare, Sun, Moon, Type, ChevronLeft, ChevronRight,
  Share2, Edit3, Check, User, Sparkles
} from 'lucide-react';

interface ReaderViewProps {
  workId: string;
  onBack: () => void;
  onOpenStudio: () => void;
}

export function ReaderView({ workId, onBack, onOpenStudio }: ReaderViewProps) {
  const [data, setData] = useState<{
    work: Work;
    chapters: Chapter[];
    comments: Comment[];
    cards: CreativeCard[];
  } | null>(null);

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  // Reading Mode States (Light, Dark, Sepia)
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [fontSize, setFontSize] = useState<number>(18); // px

  // Reader interactions state
  const [kudosCount, setKudosCount] = useState(0);
  const [hasGivenKudos, setHasGivenKudos] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [hasBookmarked, setHasBookmarked] = useState(false);

  // Comments state
  const [commentText, setCommentText] = useState('');
  const [commentUsername, setCommentUsername] = useState('');
  const [commentList, setCommentList] = useState<Comment[]>([]);

  // Mounting state to prevent hydration mismatch for dates
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchWorkData = async () => {
    try {
      const res = await fetch(`/api/works/${workId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setKudosCount(json.work.kudosCount || 0);
        setBookmarkCount(json.work.bookmarkCount || 0);
        setCommentList(json.comments || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchWorkData();
  }, [workId]);

  const handleGiveKudos = async () => {
    if (hasGivenKudos) return;
    const res = await fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workId, action: 'kudos' }),
    });
    if (res.ok) {
      const result = await res.json();
      setKudosCount(result.kudosCount);
      setHasGivenKudos(true);
    }
  };

  const handleBookmark = async () => {
    if (hasBookmarked) return;
    const res = await fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workId, action: 'bookmark' }),
    });
    if (res.ok) {
      const result = await res.json();
      setBookmarkCount(result.bookmarkCount);
      setHasBookmarked(true);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const currentChapter = data?.chapters[currentChapterIndex];

    const res = await fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workId,
        action: 'comment',
        chapterId: currentChapter?.id,
        username: commentUsername.trim() || 'Avid Reader',
        content: commentText,
      }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setCommentList([newComment, ...commentList]);
      setCommentText('');
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[500px] text-slate-400">
        Loading story manuscript...
      </div>
    );
  }

  const { work, chapters, cards } = data;
  const currentChapter = chapters[currentChapterIndex];

  // Theme styles
  const themeClasses = {
    dark: 'bg-slate-950 text-slate-200 border-slate-800',
    sepia: 'bg-[#fbf0d9] text-[#433422] border-[#e6d8be]',
    light: 'bg-slate-50 text-slate-900 border-slate-200',
  }[theme];

  const headerThemeClasses = {
    dark: 'bg-slate-900/90 border-slate-800 text-slate-100',
    sepia: 'bg-[#f4e4c1] border-[#e6d8be] text-[#332412]',
    light: 'bg-white border-slate-200 text-slate-900',
  }[theme];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${themeClasses}`}>
      {/* Reader Navbar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur px-4 py-3 flex items-center justify-between ${headerThemeClasses}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition text-xs font-semibold flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Library
          </button>
          <div>
            <h1 className="font-bold text-sm md:text-base leading-tight truncate max-w-xs md:max-w-md">
              {work.title}
            </h1>
            <p className="text-xs opacity-75">
              Chapter {currentChapterIndex + 1} of {chapters.length}
            </p>
          </div>
        </div>

        {/* Reader Customization Toolbar */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <div className="flex items-center border rounded-lg overflow-hidden p-0.5 text-xs">
            <button
              onClick={() => setTheme('dark')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'opacity-70'}`}
            >
              Dark
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${theme === 'sepia' ? 'bg-amber-700 text-white' : 'opacity-70'}`}
            >
              Sepia
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${theme === 'light' ? 'bg-slate-300 text-slate-900' : 'opacity-70'}`}
            >
              Light
            </button>
          </div>

          {/* Font Size controls */}
          <div className="hidden sm:flex items-center border rounded-lg px-2 py-1 gap-2 text-xs">
            <Type className="w-3.5 h-3.5 opacity-60" />
            <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="px-1.5 font-bold">
              A-
            </button>
            <span>{fontSize}px</span>
            <button onClick={() => setFontSize(Math.min(28, fontSize + 2))} className="px-1.5 font-bold">
              A+
            </button>
          </div>

          {/* Writer Mode button */}
          <button
            onClick={onOpenStudio}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow"
          >
            <Edit3 className="w-3.5 h-3.5" /> Open Studio
          </button>
        </div>
      </header>

      {/* Novel Reading Article View */}
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-8">
        {/* Work Header & AO3 Metadata Block */}
        <div className="border-b pb-6 space-y-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{work.title}</h1>
            <p className="text-sm opacity-80">
              Written by <span className="font-bold">{work.authorName}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-2 text-xs">
            <div className="flex flex-wrap gap-2">
              <span className="font-bold uppercase tracking-wider opacity-60">Rating:</span>
              <span className="font-semibold">{work.rating}</span>
            </div>
            {work.fandoms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="font-bold uppercase tracking-wider opacity-60">Fandoms:</span>
                <span>{work.fandoms.join(', ')}</span>
              </div>
            )}
            {work.relationships.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="font-bold uppercase tracking-wider opacity-60">Relationships:</span>
                <span className="font-semibold text-indigo-400">{work.relationships.join(', ')}</span>
              </div>
            )}
            {work.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {work.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full border bg-black/10 dark:bg-white/10">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chapter Selection Bar */}
        <div className="flex items-center justify-between border-y py-3">
          <button
            onClick={() => setCurrentChapterIndex(Math.max(0, currentChapterIndex - 1))}
            disabled={currentChapterIndex === 0}
            className="flex items-center gap-1 text-xs font-bold disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Chapter
          </button>

          <select
            value={currentChapterIndex}
            onChange={(e) => setCurrentChapterIndex(Number(e.target.value))}
            className="bg-transparent border rounded-lg px-3 py-1 text-xs font-semibold"
          >
            {chapters.map((ch, idx) => (
              <option key={ch.id} value={idx} className="bg-slate-900 text-white">
                Chapter {ch.chapterNumber}: {ch.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setCurrentChapterIndex(Math.min(chapters.length - 1, currentChapterIndex + 1))}
            disabled={currentChapterIndex === chapters.length - 1}
            className="flex items-center gap-1 text-xs font-bold disabled:opacity-30"
          >
            Next Chapter <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Chapter Prose Content */}
        {currentChapter ? (
          <article className="space-y-6">
            <h2 className="text-2xl font-bold border-b pb-2">
              Chapter {currentChapter.chapterNumber}: {currentChapter.title}
            </h2>

            {/* Author Start Notes */}
            {currentChapter.startNotes && (
              <div className="p-4 rounded-xl border bg-indigo-500/10 border-indigo-500/30 text-xs italic space-y-1">
                <span className="font-bold not-italic text-indigo-400 block">Author's Note:</span>
                <p>{currentChapter.startNotes}</p>
              </div>
            )}

            {/* Prose Body */}
            <div
              className="font-serif leading-relaxed tracking-wide space-y-4 whitespace-pre-line"
              style={{ fontSize: `${fontSize}px` }}
            >
              {currentChapter.content || 'This chapter has no prose content yet.'}
            </div>

            {/* Author End Notes */}
            {currentChapter.endNotes && (
              <div className="p-4 rounded-xl border bg-indigo-500/10 border-indigo-500/30 text-xs italic space-y-1 mt-8">
                <span className="font-bold not-italic text-indigo-400 block">End Note:</span>
                <p>{currentChapter.endNotes}</p>
              </div>
            )}
          </article>
        ) : (
          <div className="text-center py-10 opacity-60">No chapter found.</div>
        )}

        {/* Bottom Navigation & Kudos Bar */}
        <div className="pt-8 border-t space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleGiveKudos}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow ${
                  hasGivenKudos
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasGivenKudos ? 'fill-white' : ''}`} />
                {hasGivenKudos ? 'Kudos Left!' : 'Leave Kudos'} ({kudosCount})
              </button>

              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition border ${
                  hasBookmarked
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border-amber-500/40'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${hasBookmarked ? 'fill-white' : ''}`} />
                {hasBookmarked ? 'Bookmarked' : 'Bookmark'} ({bookmarkCount})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentChapterIndex(Math.max(0, currentChapterIndex - 1))}
                disabled={currentChapterIndex === 0}
                className="px-3 py-2 rounded-lg border text-xs font-bold disabled:opacity-30"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentChapterIndex(Math.min(chapters.length - 1, currentChapterIndex + 1))}
                disabled={currentChapterIndex === chapters.length - 1}
                className="px-3 py-2 rounded-lg border text-xs font-bold disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>

          {/* Reader Comments Section */}
          <div className="space-y-6 pt-6 border-t">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" /> Comments & Reviews ({commentList.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-3 p-4 rounded-xl border bg-black/5 dark:bg-white/5">
              <input
                type="text"
                placeholder="Your reader nickname (Optional)"
                value={commentUsername}
                onChange={(e) => setCommentUsername(e.target.value)}
                className="w-full bg-transparent border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
              <textarea
                rows={3}
                placeholder="Write a comment or feedback for the author..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-transparent border rounded-lg p-3 text-xs focus:outline-none focus:border-indigo-500"
              />
              <div className="text-right">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-xs transition"
                >
                  Post Comment
                </button>
              </div>
            </form>

            {/* Comment Feed */}
            <div className="space-y-3">
              {commentList.map((comm) => (
                <div key={comm.id} className="p-4 rounded-xl border bg-black/5 dark:bg-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-400" /> {comm.username}
                    </span>
                    <span className="opacity-50 text-[10px]">
                      {isMounted ? new Date(comm.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{comm.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
