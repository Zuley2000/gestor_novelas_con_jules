'use client';

import React, { useState, useEffect } from 'react';
import { Work } from '@/lib/types';
import {
  BarChart3, BookOpen, Flame, Sparkles, TrendingUp, Award, Layers, Plus, Edit3, Heart, Bookmark, MessageSquare
} from 'lucide-react';

interface AuthorDashboardProps {
  onSelectWorkStudio: (workId: string) => void;
  onCreateNewWork: () => void;
}

export function AuthorDashboard({ onSelectWorkStudio, onCreateNewWork }: AuthorDashboardProps) {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorks = async () => {
    try {
      const res = await fetch('/api/works');
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
  }, []);

  const totalWords = works.reduce((sum, w) => sum + (w.wordCount || 0), 0);
  const totalKudos = works.reduce((sum, w) => sum + (w.kudosCount || 0), 0);
  const totalBookmarks = works.reduce((sum, w) => sum + (w.bookmarkCount || 0), 0);
  const totalComments = works.reduce((sum, w) => sum + (w.commentCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Words Written</span>
            <span className="text-2xl font-extrabold text-slate-100">{totalWords.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-950 border border-rose-800/60 flex items-center justify-center text-rose-400">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Kudos Received</span>
            <span className="text-2xl font-extrabold text-slate-100">{totalKudos.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-800/60 flex items-center justify-center text-amber-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Bookmarks</span>
            <span className="text-2xl font-extrabold text-slate-100">{totalBookmarks.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Writing Streak</span>
            <span className="text-2xl font-extrabold text-slate-100">7 Days 🔥</span>
          </div>
        </div>
      </div>

      {/* Projects Studio Switcher & Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" /> Active Works & Manuscripts
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a project to open in Writer Studio or manage metadata.
            </p>
          </div>

          <button
            onClick={onCreateNewWork}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition"
          >
            <Plus className="w-4 h-4" /> Create New Novel Work
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading author projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {works.map((work) => (
              <div
                key={work.id}
                className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/80 transition flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  {work.coverUrl && (
                    <img
                      src={work.coverUrl}
                      alt={work.title}
                      className="w-20 h-28 object-cover rounded-xl border border-slate-800 shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950 border border-indigo-800/60 px-2 py-0.5 rounded">
                        {work.category}
                      </span>
                      <span className="text-[10px] text-slate-400">• {work.status}</span>
                    </div>
                    <h3 className="font-bold text-slate-100 text-base truncate">{work.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">{work.summary}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-400 font-medium">
                    <span>{work.wordCount.toLocaleString()} words</span>
                    <span>• {work.kudosCount} kudos</span>
                  </div>

                  <button
                    onClick={() => onSelectWorkStudio(work.id)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs transition shadow"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Studio Editor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
