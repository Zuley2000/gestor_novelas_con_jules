'use client';

import React, { useState, useEffect } from 'react';
import { Work } from '@/lib/types';
import {
  Search, Filter, Heart, Bookmark, MessageSquare, BookOpen, Sparkles, Tag, Users, ShieldAlert, SortAsc
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
    <div className="space-y-8">
      {/* Search Header Banner */}
      <div className="relative bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/80 border border-indigo-800/60 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Archive & Library Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Discover Stories or Craft Your Next Masterpiece.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            AO3-style tag filtering, Wattpad community stats, FanFiction.net archives, and Wavemaker plot cards combined into one suite.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search works, authors, summaries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
              />
            </div>
            <button
              onClick={onCreateNewWork}
              className="w-full sm:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Start Writing
            </button>
          </div>
        </div>
      </div>

      {/* AO3-Style Tag & Filter Control Deck */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-400" /> Advanced Tag Search & Filter
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
            className="text-xs text-slate-400 hover:text-indigo-400 transition"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
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
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
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
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Tag / Tropes</label>
            <input
              type="text"
              placeholder="e.g. Slow Burn, Magic"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
            >
              <option value="updatedAt">Date Updated</option>
              <option value="kudos">Most Kudos</option>
              <option value="bookmarks">Most Bookmarks</option>
              <option value="words">Word Count</option>
            </select>
          </div>
        </div>
      </div>

      {/* Works Grid / Cards (AO3 / Wattpad Style Hybrid Card) */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading works archive...</div>
      ) : works.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-bold text-slate-200 text-lg">No works match your current filters.</h3>
          <p className="text-xs">Try clearing your filters or creating a new work yourself!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {works.map((work) => (
            <div
              key={work.id}
              onClick={() => onSelectWork(work.id)}
              className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-6 transition-all duration-200 cursor-pointer shadow-lg group relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Cover Image */}
                {work.coverUrl && (
                  <img
                    src={work.coverUrl}
                    alt={work.title}
                    className="w-full md:w-36 h-48 rounded-xl object-cover border border-slate-800 shrink-0 group-hover:scale-105 transition duration-300"
                  />
                )}

                {/* Content Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div>
                      <h2 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition">
                        {work.title}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        by <span className="text-slate-200 font-semibold">{work.authorName}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <span className="px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800/60 rounded-md">
                        {work.category}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-md">
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
                          <span key={f} className="bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded text-[11px]">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    {work.relationships.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-rose-300">
                        <Users className="w-3.5 h-3.5 text-rose-400" />
                        {work.relationships.map((r) => (
                          <span key={r} className="bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded text-[11px] font-medium">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{work.summary}</p>

                  {/* Freeform Tags */}
                  {work.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {work.tags.map((t) => (
                        <span key={t} className="text-[11px] bg-slate-800/80 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700/60">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bottom Stats Line (Wattpad & AO3 Stats) */}
                  <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 font-medium text-rose-400">
                        <Heart className="w-3.5 h-3.5 fill-rose-500/20" /> {work.kudosCount} Kudos
                      </span>
                      <span className="flex items-center gap-1 font-medium text-amber-400">
                        <Bookmark className="w-3.5 h-3.5 fill-amber-500/20" /> {work.bookmarkCount} Bookmarks
                      </span>
                      <span className="flex items-center gap-1 font-medium text-slate-300">
                        <MessageSquare className="w-3.5 h-3.5" /> {work.commentCount} Comments
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 font-medium">
                      <span>Words: {work.wordCount.toLocaleString()}</span>
                      <span>• Status: {work.status}</span>
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
