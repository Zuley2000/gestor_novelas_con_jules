'use client';

import React, { useState, useEffect } from 'react';
import { Work, Chapter, CreativeCard, PlanningCard } from '@/lib/types';
import { CreativeCardsTab } from '@/components/CreativeCardsTab';
import { PlanningTab } from '@/components/PlanningTab';
import { ExportModal } from '@/components/ExportModal';
import {
  FileText, Sparkles, LayoutGrid, Download, Plus, Save, Trash2, ArrowLeft,
  Settings, Target, RefreshCw, BookOpen, Clock, Tag
} from 'lucide-react';

interface WriterStudioProps {
  workId: string;
  onBack: () => void;
}

export function WriterStudio({ workId, onBack }: WriterStudioProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'cards' | 'planning' | 'settings'>('editor');
  const [work, setWork] = useState<Work | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [cards, setCards] = useState<CreativeCard[]>([]);
  const [planningCards, setPlanningCards] = useState<PlanningCard[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  // Editor states
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorStartNotes, setEditorStartNotes] = useState('');
  const [editorEndNotes, setEditorEndNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Focus mode
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Quick Reference Sidebar in Editor
  const [showRefSidebar, setShowRefSidebar] = useState(true);

  // Export Modal State
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Target word count goal
  const [dailyGoal, setDailyGoal] = useState<number>(1000);

  const fetchWorkDetails = async () => {
    try {
      const res = await fetch(`/api/works/${workId}`);
      if (res.ok) {
        const data = await res.json();
        setWork(data.work);
        setChapters(data.chapters || []);
        setCards(data.cards || []);
        setPlanningCards(data.planningCards || []);

        if (data.chapters && data.chapters.length > 0 && !selectedChapter) {
          setSelectedChapter(data.chapters[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchWorkDetails();
  }, [workId]);

  useEffect(() => {
    if (selectedChapter) {
      setEditorTitle(selectedChapter.title);
      setEditorContent(selectedChapter.content || '');
      setEditorStartNotes(selectedChapter.startNotes || '');
      setEditorEndNotes(selectedChapter.endNotes || '');
    }
  }, [selectedChapter]);

  const handleSaveChapter = async () => {
    if (!selectedChapter) return;
    setIsSaving(true);
    setSaveStatus('Saving...');

    try {
      const res = await fetch(`/api/works/${workId}/chapters`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: selectedChapter.id,
          title: editorTitle,
          content: editorContent,
          startNotes: editorStartNotes,
          endNotes: editorEndNotes,
        }),
      });

      if (res.ok) {
        setSaveStatus('Saved!');
        fetchWorkDetails();
        setTimeout(() => setSaveStatus(null), 2000);
      } else {
        setSaveStatus('Error saving');
      }
    } catch (e) {
      setSaveStatus('Error saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddChapter = async () => {
    const res = await fetch(`/api/works/${workId}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `Chapter ${chapters.length + 1}`,
        content: '',
      }),
    });

    if (res.ok) {
      const newCh = await res.json();
      fetchWorkDetails();
      setSelectedChapter(newCh);
    }
  };

  const currentWordCount = editorContent ? editorContent.trim().split(/\s+/).filter(Boolean).length : 0;

  if (!work) {
    return (
      <div className="flex items-center justify-center min-h-[600px] text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading Studio...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Works List
          </button>
          <div>
            <h1 className="font-bold text-slate-100 text-lg flex items-center gap-2 leading-tight">
              {work.title}
            </h1>
            <p className="text-xs text-slate-400">
              {work.category} • {work.wordCount.toLocaleString()} total words
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'editor' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> Focus Editor
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'cards' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Lore & Cards ({cards.length})
          </button>
          <button
            onClick={() => setActiveTab('planning')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'planning' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Outline Lab
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" /> Metadata & Tags
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-semibold transition"
          >
            <Download className="w-4 h-4 text-indigo-400" /> Export
          </button>
          <button
            onClick={handleSaveChapter}
            disabled={isSaving || !selectedChapter}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition shadow"
          >
            <Save className="w-4 h-4" /> {saveStatus || 'Save Chapter'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
        {/* Editor Tab */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
            {/* Chapter Navigator Sidebar */}
            <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-full">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" /> Chapters ({chapters.length})
                </h3>
                <button
                  onClick={handleAddChapter}
                  className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs transition"
                  title="Add Chapter"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {chapters.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChapter(ch)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      selectedChapter?.id === ch.id
                        ? 'bg-indigo-950/60 border-indigo-500/80 text-white shadow-sm'
                        : 'bg-slate-800/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-xs text-indigo-300 mb-0.5">
                        Chapter {ch.chapterNumber}
                      </div>
                      <div className="font-medium text-sm truncate">{ch.title}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {ch.wordCount || 0} w
                    </span>
                  </button>
                ))}
              </div>

              {/* Goal Progress widget */}
              <div className="mt-4 pt-3 border-t border-slate-800 bg-slate-950/60 p-3 rounded-xl border">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span className="font-semibold flex items-center gap-1 text-slate-200">
                    <Target className="w-3.5 h-3.5 text-indigo-400" /> Session Goal
                  </span>
                  <span>{currentWordCount} / {dailyGoal} w</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (currentWordCount / dailyGoal) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Main Writing Workspace */}
            <div className={`flex flex-col bg-slate-900 border border-slate-800 rounded-2xl h-full overflow-hidden ${showRefSidebar ? 'md:col-span-6' : 'md:col-span-9'}`}>
              {selectedChapter ? (
                <div className="flex flex-col h-full p-6">
                  {/* Title & Controls */}
                  <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
                    <input
                      type="text"
                      value={editorTitle}
                      onChange={(e) => setEditorTitle(e.target.value)}
                      className="bg-transparent text-xl font-bold text-slate-100 focus:outline-none focus:border-b border-indigo-500 w-full"
                      placeholder="Chapter Title..."
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setShowRefSidebar(!showRefSidebar)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          showRefSidebar
                            ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {showRefSidebar ? 'Hide Lore Sidebar' : 'Show Lore Sidebar'}
                      </button>
                    </div>
                  </div>

                  {/* Writing Area */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {/* Author Start Notes */}
                    <details className="group bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs">
                      <summary className="cursor-pointer font-semibold text-indigo-400 flex items-center justify-between">
                        <span>Author Start Notes (Optional)</span>
                        <span className="text-[10px] text-slate-500 group-open:hidden">Click to open</span>
                      </summary>
                      <textarea
                        rows={2}
                        value={editorStartNotes}
                        onChange={(e) => setEditorStartNotes(e.target.value)}
                        placeholder="Notes shown before the chapter begins..."
                        className="w-full mt-2 bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </details>

                    {/* Main Content Area */}
                    <textarea
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                      placeholder="Begin writing your chapter..."
                      className="w-full h-[calc(100%-120px)] min-h-[400px] bg-transparent text-slate-200 placeholder-slate-600 focus:outline-none resize-none leading-relaxed font-serif text-lg tracking-wide p-2"
                    />

                    {/* Author End Notes */}
                    <details className="group bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs">
                      <summary className="cursor-pointer font-semibold text-indigo-400 flex items-center justify-between">
                        <span>Author End Notes (Optional)</span>
                        <span className="text-[10px] text-slate-500 group-open:hidden">Click to open</span>
                      </summary>
                      <textarea
                        rows={2}
                        value={editorEndNotes}
                        onChange={(e) => setEditorEndNotes(e.target.value)}
                        placeholder="Notes shown after chapter ends..."
                        className="w-full mt-2 bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </details>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>{currentWordCount} words</span>
                    <span>Auto-sync ready</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  Select or create a chapter to begin writing.
                </div>
              )}
            </div>

            {/* Quick Reference Side Deck */}
            {showRefSidebar && (
              <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-full overflow-hidden">
                <h3 className="font-semibold text-slate-200 text-sm mb-3 pb-2 border-b border-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> Quick Reference Deck
                </h3>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {cards.map((card) => (
                    <div key={card.id} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-200">{card.name}</span>
                        <span className="text-[10px] text-indigo-400 uppercase font-semibold">{card.type}</span>
                      </div>
                      <p className="text-slate-400 line-clamp-3 leading-relaxed">{card.summary}</p>
                    </div>
                  ))}
                  {cards.length === 0 && (
                    <p className="text-slate-500 text-xs text-center py-6">
                      No cards created yet. Switch to "Lore & Cards" tab to build your deck!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cards Tab */}
        {activeTab === 'cards' && (
          <CreativeCardsTab workId={workId} cards={cards} onRefresh={fetchWorkDetails} />
        )}

        {/* Planning Tab */}
        {activeTab === 'planning' && (
          <PlanningTab workId={workId} planningCards={planningCards} chapters={chapters} onRefresh={fetchWorkDetails} />
        )}

        {/* Settings & Tag Metadata Tab (AO3 Style Tagging) */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings className="w-5 h-5 text-indigo-400" /> Novel Metadata & AO3-Style Tagging
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Work Title</label>
                <input
                  type="text"
                  value={work.title}
                  onChange={(e) => setWork({ ...work, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Summary / Blurb</label>
                <textarea
                  rows={4}
                  value={work.summary}
                  onChange={(e) => setWork({ ...work, summary: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Category</label>
                  <select
                    value={work.category}
                    onChange={(e) => setWork({ ...work, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                  >
                    <option value="Original">Original Work</option>
                    <option value="Fanfiction">Fanfiction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Content Rating</label>
                  <select
                    value={work.rating}
                    onChange={(e) => setWork({ ...work, rating: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                  >
                    <option value="General Audiences">General Audiences</option>
                    <option value="Teen And Up Audiences">Teen And Up Audiences</option>
                    <option value="Mature">Mature</option>
                    <option value="Explicit">Explicit</option>
                    <option value="Not Rated">Not Rated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Fandoms (comma separated)</label>
                <input
                  type="text"
                  value={work.fandoms.join(', ')}
                  onChange={(e) => setWork({ ...work, fandoms: e.target.value.split(',').map((s) => s.trim()) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Relationships / Ships (comma separated)</label>
                <input
                  type="text"
                  value={work.relationships.join(', ')}
                  onChange={(e) => setWork({ ...work, relationships: e.target.value.split(',').map((s) => s.trim()) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                  placeholder="e.g. Kaelen Vance/Lyra Mercer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Freeform Additional Tags (comma separated)</label>
                <input
                  type="text"
                  value={work.tags.join(', ')}
                  onChange={(e) => setWork({ ...work, tags: e.target.value.split(',').map((s) => s.trim()) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                  placeholder="e.g. Cyberpunk, Magic System, Slow Burn, Found Family"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 text-right">
                <button
                  onClick={async () => {
                    await fetch(`/api/works/${workId}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(work),
                    });
                    alert('Metadata updated!');
                  }}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow"
                >
                  Save Metadata
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Export Modal */}
      <ExportModal
        work={work}
        chapters={chapters}
        cards={cards}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
