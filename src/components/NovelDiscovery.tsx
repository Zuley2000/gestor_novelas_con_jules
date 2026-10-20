'use client';

import React, { useState, useEffect } from 'react';
import { Work } from '@/lib/types';
import {
  Search, Filter, Heart, Bookmark, MessageSquare, BookOpen, Sparkles, Tag, Users, Flame, ChevronRight, SlidersHorizontal
} from 'lucide-react';

interface NovelDiscoveryProps {
  onSelectWork: (workId: string) => void;
  onCreateNewWork: () => void;
}

export function NovelDiscovery({ onSelectWork, onCreateNewWork }: NovelDiscoveryProps) {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [rating, setRating] = useState('All');
  const [fandomFilter, setFandomFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');

  const fetchWorks = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (category !== 'All') params.set('category', category);
    if (rating !== 'All') params.set('rating', rating);
    if (fandomFilter) params.set('fandom', fandomFilter);
    if (tagFilter) params.set('tag', tagFilter);
    if (sortBy) params.set('sortBy', sortBy);

    try {
      const res = await fetch(`/api/works?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setWorks(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, [search, category, rating, fandomFilter, tagFilter, sortBy]);

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12">
      {/* Premium Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 border border-indigo-500/20 p-8 md:p-12 shadow-2xl overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Archive & Creative Writing Hub
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Craft Extraordinary Stories. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Explore Infinite Worlds.
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            AO3 tag filtering, Wavemaker plotting, Storycamp character decks, and Wattpad reader engagement fused into an elegant studio.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search works, authors, fandoms, tropes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition shadow-inner"
              />
            </div>
            <button
              onClick={onCreateNewWork}
              className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Start Writing
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Tag Search & Filter Bar */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" /> Advanced Tag Search & Filters
          </h3>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setRating('All');
              setFandomFilter('');
              setTagFilter('');
              setSortBy('updatedAt');
            }}
            className="text-xs text-slate-400 hover:text-indigo-400 transition font-medium"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Original">Original Work</option>
              <option value="Fanfiction">Fanfiction</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Ratings</option>
              <option value="General Audiences">General Audiences</option>
              <option value="Teen And Up Audiences">Teen And Up</option>
              <option value="Mature">Mature</option>
              <option value="Explicit">Explicit</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Fandom</label>
            <input
              type="text"
              placeholder="e.g. Harry Potter"
              value={fandomFilter}
              onChange={(e) => setFandomFilter(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Tags / Tropes</label>
            <input
              type="text"
              placeholder="e.g. Slow Burn, Cyberpunk"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="updatedAt">Date Updated</option>
              <option value="kudos">Most Kudos</option>
              <option value="bookmarks">Most Bookmarks</option>
              <option value="words">Word Count</option>
            </select>
          </div>
        </div>
      </div>

      {/* Works Archive Cards */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium">Loading works archive...</div>
      ) : works.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-slate-200 text-lg">No works match your current filters.</h3>
          <p className="text-xs">Try clearing your filters or creating a new work yourself!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {works.map((work) => (
            <div
              key={work.id}
              onClick={() => onSelectWork(work.id)}
              className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/60 rounded-3xl p-6 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-indigo-950/40 relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Cover Image */}
                {work.coverUrl && (
                  <div className="relative shrink-0 overflow-hidden rounded-2xl border border-slate-800 w-full md:w-36 h-48 bg-slate-950">
                    <img
                      src={work.coverUrl}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-2">
                      <span className="text-[10px] font-bold text-white bg-indigo-600/90 px-2 py-0.5 rounded-md flex items-center gap-1">
                        Read Story <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                )}

                {/* Content Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                      <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition leading-tight">
                        {work.title}
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        By <span className="text-slate-200 font-bold">{work.authorName}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800/60 rounded-lg">
                        {work.category}
                      </span>
                      <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg">
                        {work.rating}
                      </span>
                    </div>
                  </div>

                  {/* Fandoms & Relationships Tags */}
                  <div className="space-y-1.5 text-xs">
                    {work.fandoms.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-indigo-300">
                        <span className="font-semibold text-slate-400">Fandom:</span>
                        {work.fandoms.map((f) => (
                          <span key={f} className="bg-indigo-950/80 border border-indigo-800/50 px-2.5 py-0.5 rounded-md text-[11px] font-medium">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    {work.relationships.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-rose-300">
                        <Users className="w-3.5 h-3.5 text-rose-400" />
                        {work.relationships.map((r) => (
                          <span key={r} className="bg-rose-950/60 border border-rose-800/50 px-2.5 py-0.5 rounded-md text-[11px] font-semibold">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3">{work.summary}</p>

                  {/* Freeform Tags */}
                  {work.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {work.tags.map((t) => (
                        <span key={t} className="text-[11px] bg-slate-800/80 text-slate-300 px-3 py-0.5 rounded-full border border-slate-700/60 hover:border-indigo-500/40 transition">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bottom Stats Line */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 font-bold text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2.5 py-1 rounded-lg">
                        <Heart className="w-3.5 h-3.5 fill-rose-500/30" /> {work.kudosCount} Kudos
                      </span>
                      <span className="flex items-center gap-1.5 font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-lg">
                        <Bookmark className="w-3.5 h-3.5 fill-amber-500/30" /> {work.bookmarkCount} Bookmarks
                      </span>
                      <span className="flex items-center gap-1.5 font-bold text-slate-300 bg-slate-800/60 border border-slate-700/60 px-2.5 py-1 rounded-lg">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> {work.commentCount} Comments
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 font-semibold">
                      <span>{work.wordCount.toLocaleString()} words</span>
                      <span>• {work.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
