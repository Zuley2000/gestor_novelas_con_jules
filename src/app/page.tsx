'use client';

import React, { useState } from 'react';
import { NovelDiscovery } from '@/components/NovelDiscovery';
import { ReaderView } from '@/components/ReaderView';
import { WriterStudio } from '@/components/WriterStudio';
import { AuthorDashboard } from '@/components/AuthorDashboard';
import {
  BookOpen, Edit3, Compass, BarChart3, Plus, Sparkles
} from 'lucide-react';

export default function Home() {
  // Navigation states: 'discovery' | 'reader' | 'studio' | 'dashboard'
  const [view, setView] = useState<'discovery' | 'reader' | 'studio' | 'dashboard'>('discovery');
  const [selectedWorkId, setSelectedWorkId] = useState<string>('work-1');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Work Form
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newCategory, setNewCategory] = useState<'Original' | 'Fanfiction'>('Original');
  const [newRating, setNewRating] = useState('Teen And Up Audiences');
  const [newAuthor, setNewAuthor] = useState('AetheriumScribe');

  const handleCreateWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const res = await fetch('/api/works', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        summary: newSummary,
        category: newCategory,
        rating: newRating,
        authorName: newAuthor || 'Anonymous Writer',
      }),
    });

    if (res.ok) {
      const created = await res.json();
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewSummary('');
      setSelectedWorkId(created.id);
      setView('studio');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Main Navigation (When not in studio or full-screen reader) */}
      {view !== 'studio' && (
        <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">
              N
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-100 block leading-none">
                NovelCraft <span className="text-indigo-400 font-semibold text-xs">Studio</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Archive & Writing Suite</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setView('discovery')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition ${
                view === 'discovery' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> Library Archive
            </button>
            <button
              onClick={() => setView('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition ${
                view === 'dashboard' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Author Dashboard
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" /> New Novel
          </button>
        </header>
      )}

      {/* Main Container */}
      <div className="flex-1">
        {view === 'discovery' && (
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <NovelDiscovery
              onSelectWork={(id) => {
                setSelectedWorkId(id);
                setView('reader');
              }}
              onCreateNewWork={() => setIsCreateModalOpen(true)}
            />
          </div>
        )}

        {view === 'reader' && (
          <ReaderView
            workId={selectedWorkId}
            onBack={() => setView('discovery')}
            onOpenStudio={() => setView('studio')}
          />
        )}

        {view === 'studio' && (
          <WriterStudio
            workId={selectedWorkId}
            onBack={() => setView('dashboard')}
          />
        )}

        {view === 'dashboard' && (
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <AuthorDashboard
              onSelectWorkStudio={(id) => {
                setSelectedWorkId(id);
                setView('studio');
              }}
              onCreateNewWork={() => setIsCreateModalOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Modal Dialog for New Novel Creation */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Start New Novel or Fanfiction
            </h3>

            <form onSubmit={handleCreateWork} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Novel Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Chronicles of Aether & Steel"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Author Pen Name</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Your Pen Name"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="Original">Original Work</option>
                    <option value="Fanfiction">Fanfiction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rating</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="General Audiences">General Audiences</option>
                    <option value="Teen And Up Audiences">Teen And Up</option>
                    <option value="Mature">Mature</option>
                    <option value="Explicit">Explicit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Summary / Blurb</label>
                <textarea
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="What is your story about?"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow"
                >
                  Create & Launch Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
