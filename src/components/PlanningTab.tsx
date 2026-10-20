'use client';

import React, { useState } from 'react';
import { PlanningCard, Chapter } from '@/lib/types';
import { Plus, Trash2, Edit2, Check, LayoutGrid, GitMerge, Clock, Sparkles } from 'lucide-react';

interface PlanningTabProps {
  workId: string;
  planningCards: PlanningCard[];
  chapters: Chapter[];
  onRefresh: () => void;
}

export function PlanningTab({ workId, planningCards, chapters, onRefresh }: PlanningTabProps) {
  const [boardType, setBoardType] = useState<'snowflake' | 'grid' | 'timeline'>('snowflake');
  const [editingCard, setEditingCard] = useState<PlanningCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [act, setAct] = useState('Act 1: Setup');
  const [chapterId, setChapterId] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idea' | 'drafting' | 'revised' | 'done'>('idea');
  const [color, setColor] = useState('bg-slate-500/10 border-slate-500/30');

  const openCreateModal = (defaultAct = 'Act 1: Setup') => {
    setEditingCard(null);
    setTitle('');
    setAct(defaultAct);
    setChapterId('');
    setContent('');
    setStatus('idea');
    setColor('bg-indigo-500/10 border-indigo-500/30');
    setIsModalOpen(true);
  };

  const openEditModal = (card: PlanningCard) => {
    setEditingCard(card);
    setTitle(card.title);
    setAct(card.act || 'Act 1: Setup');
    setChapterId(card.chapterId || '');
    setContent(card.content);
    setStatus(card.status);
    setColor(card.color || 'bg-slate-500/10 border-slate-500/30');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    if (editingCard) {
      await fetch('/api/planning', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCard.id,
          title,
          act,
          chapterId,
          content,
          status,
          position: editingCard.position,
          color,
        }),
      });
    } else {
      await fetch('/api/planning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workId,
          boardType,
          title,
          act,
          chapterId,
          content,
          status,
          position: planningCards.length + 1,
          color,
        }),
      });
    }

    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this plot card?')) return;
    await fetch(`/api/planning?id=${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const actsList = ['Act 1: Setup', 'Act 2: Confrontation', 'Act 3: Resolution'];

  return (
    <div className="space-y-6">
      {/* Top Header & View Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Story Outliner & Plot Lab
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize plot points with Snowflake method, scene grid cards, or linear story timeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 flex items-center text-xs">
            <button
              onClick={() => setBoardType('snowflake')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
                boardType === 'snowflake'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5" /> Snowflake Board
            </button>
            <button
              onClick={() => setBoardType('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
                boardType === 'grid'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Scene Grid
            </button>
            <button
              onClick={() => setBoardType('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
                boardType === 'timeline'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Timeline View
            </button>
          </div>

          <button
            onClick={() => openCreateModal()}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow transition"
          >
            <Plus className="w-4 h-4" /> Add Plot Card
          </button>
        </div>
      </div>

      {/* Snowflake / Columns View */}
      {boardType === 'snowflake' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {actsList.map((actName) => {
            const cardsInAct = planningCards.filter((c) => (c.act || 'Act 1: Setup') === actName);
            return (
              <div key={actName} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <h3 className="font-semibold text-slate-200 text-sm">{actName}</h3>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">
                    {cardsInAct.length} cards
                  </span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {cardsInAct.map((card) => (
                    <div
                      key={card.id}
                      className={`p-4 rounded-xl border transition shadow-sm hover:shadow-md ${card.color || 'bg-slate-800/60 border-slate-700/80'}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-slate-100 text-sm">{card.title}</h4>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(card)}
                            className="p-1 hover:bg-slate-700/50 rounded text-slate-400 hover:text-slate-200"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(card.id)}
                            className="p-1 hover:bg-red-900/30 rounded text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-3">{card.content || 'No details provided.'}</p>

                      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/40">
                        <span className="capitalize px-2 py-0.5 rounded-md bg-slate-950/60 border border-slate-800 text-indigo-300 font-medium">
                          {card.status}
                        </span>
                        {card.chapterId && (
                          <span className="text-slate-400">
                            Linked: {chapters.find((ch) => ch.id === card.chapterId)?.title || 'Chapter'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => openCreateModal(actName)}
                  className="mt-3 w-full py-2 border border-dashed border-slate-700 hover:border-indigo-500 hover:text-indigo-400 text-slate-400 text-xs rounded-lg flex items-center justify-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add card to {actName.split(':')[0]}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Grid View */}
      {boardType === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {planningCards.map((card) => (
            <div
              key={card.id}
              className={`p-4 rounded-xl border transition shadow-sm hover:shadow-md flex flex-col justify-between ${card.color || 'bg-slate-800/60 border-slate-700'}`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-indigo-400">{card.act}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEditModal(card)} className="hover:text-slate-200">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(card.id)} className="hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h4 className="font-semibold text-slate-100 text-sm mb-2">{card.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-4">{card.content || 'No details provided.'}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px]">
                <span className="capitalize text-slate-400">{card.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline View */}
      {boardType === 'timeline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative min-h-[400px]">
          <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-indigo-500/30"></div>
          <div className="space-y-8 pl-12 relative">
            {planningCards.map((card, idx) => (
              <div key={card.id} className="relative group">
                <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-slate-900 group-hover:scale-125 transition" />
                <div className="bg-slate-800/70 border border-slate-700/80 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-400">Step {idx + 1}</span>
                      <span className="text-xs text-slate-400">• {card.act}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(card)} className="text-xs text-slate-400 hover:text-slate-200">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(card.id)} className="text-xs text-red-400 hover:text-red-300">
                        Delete
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm mb-1">{card.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{card.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100">
              {editingCard ? 'Edit Plot Card' : 'Create Plot Card'}
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Inciting Incident / The Vault Break-in"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Act Structure</label>
                <select
                  value={act}
                  onChange={(e) => setAct(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                >
                  <option value="Act 1: Setup">Act 1: Setup</option>
                  <option value="Act 2: Confrontation">Act 2: Confrontation</option>
                  <option value="Act 3: Resolution">Act 3: Resolution</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                >
                  <option value="idea">Idea / Brainstorm</option>
                  <option value="drafting">Drafting</option>
                  <option value="revised">Revised</option>
                  <option value="done">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Link to Chapter (Optional)</label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              >
                <option value="">-- Unlinked --</option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    Ch {ch.chapterNumber}: {ch.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Plot Details & Notes</label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                placeholder="Detail what happens in this beat..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Card Accent Color</label>
              <div className="flex gap-2">
                {[
                  'bg-indigo-500/10 border-indigo-500/30',
                  'bg-amber-500/10 border-amber-500/30',
                  'bg-emerald-500/10 border-emerald-500/30',
                  'bg-purple-500/10 border-purple-500/30',
                  'bg-rose-500/10 border-rose-500/30',
                ].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-lg border ${c} ${color === c ? 'ring-2 ring-white' : ''}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow"
              >
                Save Plot Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
