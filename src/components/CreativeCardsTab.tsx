'use client';

import React, { useState, useEffect } from 'react';
import { Work, Chapter, CreativeCard } from '@/lib/types';
import {
  Plus, Trash2, Edit3, Save, RefreshCw, FileText, Sparkles, BookOpen, UserCheck, Tag, Link2, Upload
} from 'lucide-react';

interface CreativeCardsTabProps {
  workId: string;
  cards: CreativeCard[];
  onRefresh: () => void;
}

export function CreativeCardsTab({ workId, cards, onRefresh }: CreativeCardsTabProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<CreativeCard | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<'character' | 'location' | 'faction' | 'magic' | 'item' | 'lore'>('character');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editFields, setEditFields] = useState<{ id: string; label: string; value: string }[]>([]);
  const [editConnections, setEditConnections] = useState<{ targetCardId: string; targetCardName: string; relation: string }[]>([]);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (cards.length > 0 && !selectedCard) {
      setSelectedCard(cards[0]);
    }
  }, [cards]);

  useEffect(() => {
    if (selectedCard) {
      setEditName(selectedCard.name);
      setEditType(selectedCard.type);
      setEditSubtitle(selectedCard.subtitle || '');
      setEditAvatarUrl(selectedCard.avatarUrl || '');
      setEditSummary(selectedCard.summary || '');
      setEditTags(selectedCard.tags.join(', '));
      setEditFields(selectedCard.fields || []);
      setEditConnections(selectedCard.connections || []);
    }
  }, [selectedCard]);

  const filteredCards = cards.filter((c) => {
    const matchesType = filterType === 'all' || c.type === filterType;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.summary.toLowerCase().includes(search.toLowerCase()) ||
                          c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setEditAvatarUrl(data.url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCreateCard = async () => {
    const res = await fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workId,
        type: 'character',
        name: 'New Character / Lore Card',
        subtitle: 'Role or Title',
        summary: 'Brief description...',
        tags: ['Draft'],
        fields: [
          { id: '1', label: 'Age', value: '' },
          { id: '2', label: 'Personality', value: '' }
        ],
        connections: []
      })
    });

    if (res.ok) {
      const created = await res.json();
      onRefresh();
      setSelectedCard(created);
      setIsEditing(true);
    }
  };

  const handleSaveCard = async () => {
    if (!selectedCard) return;

    const updatedTags = editTags.split(',').map(t => t.trim()).filter(Boolean);

    const res = await fetch('/api/cards', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedCard.id,
        type: editType,
        name: editName,
        subtitle: editSubtitle,
        avatarUrl: editAvatarUrl,
        summary: editSummary,
        tags: updatedTags,
        fields: editFields,
        connections: editConnections
      })
    });

    if (res.ok) {
      onRefresh();
      setIsEditing(false);
      setSelectedCard({
        ...selectedCard,
        type: editType,
        name: editName,
        subtitle: editSubtitle,
        avatarUrl: editAvatarUrl,
        summary: editSummary,
        tags: updatedTags,
        fields: editFields,
        connections: editConnections
      });
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;
    const res = await fetch(`/api/cards?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      onRefresh();
      setSelectedCard(null);
      setIsEditing(false);
    }
  };

  const addField = () => {
    setEditFields([...editFields, { id: String(Date.now()), label: 'Field Name', value: '' }]);
  };

  const updateField = (index: number, key: 'label' | 'value', val: string) => {
    const next = [...editFields];
    next[index][key] = val;
    setEditFields(next);
  };

  const removeField = (index: number) => {
    setEditFields(editFields.filter((_, i) => i !== index));
  };

  const addConnection = () => {
    setEditConnections([...editConnections, { targetCardId: '', targetCardName: '', relation: 'Ally / Related' }]);
  };

  const updateConnection = (index: number, key: 'targetCardName' | 'relation', val: string) => {
    const next = [...editConnections];
    next[index][key] = val;
    setEditConnections(next);
  };

  const removeConnection = (index: number) => {
    setEditConnections(editConnections.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-180px)] min-h-[600px]">
      {/* Sidebar List */}
      <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> World & Character Cards
          </h3>
          <button
            onClick={handleCreateCard}
            className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg transition"
          >
            <Plus className="w-4 h-4" /> New Card
          </button>
        </div>

        {/* Filters & Search */}
        <div className="space-y-2 mb-4">
          <input
            type="text"
            placeholder="Search cards or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex flex-wrap gap-1 text-xs">
            {['all', 'character', 'location', 'faction', 'magic', 'item', 'lore'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-full capitalize transition ${
                  filterType === t
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Card List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredCards.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No cards found. Click "New Card" to add one!
            </div>
          ) : (
            filteredCards.map((card) => (
              <div
                key={card.id}
                onClick={() => {
                  setSelectedCard(card);
                  setIsEditing(false);
                }}
                className={`p-3 rounded-lg cursor-pointer border transition flex items-center gap-3 ${
                  selectedCard?.id === card.id
                    ? 'bg-slate-800 border-indigo-500/80 shadow-md shadow-indigo-950'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50'
                }`}
              >
                {card.avatarUrl ? (
                  <img src={card.avatarUrl} alt={card.name} className="w-11 h-11 rounded-lg object-cover bg-slate-800" />
                ) : (
                  <div className="w-11 h-11 rounded-lg bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400 font-semibold text-lg">
                    {card.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-200 text-sm truncate">{card.name}</h4>
                    <span className="text-[10px] uppercase font-semibold text-indigo-400 bg-indigo-950/80 border border-indigo-800/40 px-1.5 py-0.5 rounded">
                      {card.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{card.subtitle || card.summary || 'No details'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Detail / Edit Panel */}
      <div className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 h-full overflow-y-auto">
        {selectedCard ? (
          <div>
            {/* Header controls */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-semibold uppercase bg-indigo-950 text-indigo-400 border border-indigo-800/60 rounded-md">
                  {selectedCard.type} Card
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveCard}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition"
                    >
                      <Save className="w-4 h-4" /> Save Card
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition"
                    >
                      <Edit3 className="w-4 h-4 text-indigo-400" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCard(selectedCard.id)}
                      className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* View or Edit mode */}
            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  {selectedCard.avatarUrl && (
                    <img
                      src={selectedCard.avatarUrl}
                      alt={selectedCard.name}
                      className="w-28 h-28 rounded-xl object-cover border border-slate-700 bg-slate-800 shadow-lg"
                    />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">{selectedCard.name}</h2>
                    {selectedCard.subtitle && (
                      <p className="text-indigo-400 font-medium mt-0.5">{selectedCard.subtitle}</p>
                    )}
                    <p className="text-slate-300 mt-3 text-sm leading-relaxed">{selectedCard.summary}</p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {selectedCard.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Custom Attribute Fields */}
                {selectedCard.fields && selectedCard.fields.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-800 pb-1">
                      Attributes & Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedCard.fields.map((field) => (
                        <div key={field.id} className="bg-slate-800/60 border border-slate-800 p-3 rounded-lg">
                          <span className="text-xs font-semibold text-indigo-400 block">{field.label}</span>
                          <span className="text-sm text-slate-200 mt-0.5 block">{field.value || 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relational Connections */}
                {selectedCard.connections && selectedCard.connections.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-800 pb-1 flex items-center gap-1.5">
                      <Link2 className="w-4 h-4 text-indigo-400" /> Relational Network
                    </h3>
                    <div className="space-y-2">
                      {selectedCard.connections.map((conn, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-800/40 border border-slate-800/80 px-4 py-2.5 rounded-lg text-sm">
                          <span className="font-medium text-slate-200">{conn.targetCardName}</span>
                          <span className="text-xs text-indigo-300 bg-indigo-950 border border-indigo-800/40 px-2.5 py-1 rounded-full">
                            {conn.relation}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Edit Form */
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Card Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Card Type</label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                    >
                      <option value="character">Character</option>
                      <option value="location">Location</option>
                      <option value="faction">Faction</option>
                      <option value="magic">Magic System</option>
                      <option value="item">Item / Artifact</option>
                      <option value="lore">Lore / History</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Subtitle / Role</label>
                    <input
                      type="text"
                      value={editSubtitle}
                      onChange={(e) => setEditSubtitle(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                      placeholder="e.g., Disgraced Arcanist"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Card Image File or URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editAvatarUrl}
                        onChange={(e) => setEditAvatarUrl(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                        placeholder="https://..."
                      />
                      <label className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingAvatar ? '...' : 'Upload'}
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Overview / Summary</label>
                  <textarea
                    rows={3}
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                    placeholder="Protagonist, Arcane, Solitary"
                  />
                </div>

                {/* Edit Fields */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-300">Custom Attributes</label>
                    <button
                      type="button"
                      onClick={addField}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Attribute
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editFields.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={f.label}
                          onChange={(e) => updateField(idx, 'label', e.target.value)}
                          placeholder="Label (e.g., Age)"
                          className="w-1/3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                        />
                        <input
                          type="text"
                          value={f.value}
                          onChange={(e) => updateField(idx, 'value', e.target.value)}
                          placeholder="Value"
                          className="w-2/3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                        />
                        <button
                          type="button"
                          onClick={() => removeField(idx)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Connections */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-300">Relational Network</label>
                    <button
                      type="button"
                      onClick={addConnection}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Connection
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editConnections.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={c.targetCardName}
                          onChange={(e) => updateConnection(idx, 'targetCardName', e.target.value)}
                          placeholder="Target Character/Place Name"
                          className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                        />
                        <input
                          type="text"
                          value={c.relation}
                          onChange={(e) => updateConnection(idx, 'relation', e.target.value)}
                          placeholder="Relationship (e.g. Rival, Sister)"
                          className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                        />
                        <button
                          type="button"
                          onClick={() => removeConnection(idx)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            Select a card from the left or create a new one to begin editing.
          </div>
        )}
      </div>
    </div>
  );
}
