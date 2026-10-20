'use client';

import React, { useState } from 'react';
import { Work, Chapter, CreativeCard } from '@/lib/types';
import { Download, FileText, Code, Check, Sparkles, BookOpen } from 'lucide-react';

interface ExportModalProps {
  work: Work;
  chapters: Chapter[];
  cards: CreativeCard[];
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ work, chapters, cards, isOpen, onClose }: ExportModalProps) {
  const [includeCards, setIncludeCards] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const exportAsMarkdown = () => {
    let md = `# ${work.title}\n\n`;
    md += `**Author:** ${work.authorName}\n`;
    md += `**Category:** ${work.category}\n`;
    if (work.fandoms.length) md += `**Fandoms:** ${work.fandoms.join(', ')}\n`;
    md += `**Rating:** ${work.rating}\n`;
    if (work.tags.length) md += `**Tags:** ${work.tags.join(', ')}\n`;
    md += `\n---\n\n### Summary\n${work.summary}\n\n---\n\n`;

    if (includeCards && cards.length > 0) {
      md += `## Creative Cards & Lore Matrix\n\n`;
      cards.forEach((card) => {
        md += `### [${card.type.toUpperCase()}] ${card.name}\n`;
        if (card.subtitle) md += `*${card.subtitle}*\n\n`;
        md += `${card.summary}\n\n`;
        if (card.fields && card.fields.length > 0) {
          card.fields.forEach((f) => {
            md += `- **${f.label}:** ${f.value}\n`;
          });
          md += `\n`;
        }
      });
      md += `---\n\n`;
    }

    md += `## Manuscript\n\n`;
    chapters.forEach((ch) => {
      md += `### Chapter ${ch.chapterNumber}: ${ch.title}\n\n`;
      if (includeNotes && ch.startNotes) md += `*Author's Note:* ${ch.startNotes}\n\n`;
      md += `${ch.content}\n\n`;
      if (includeNotes && ch.endNotes) md += `*End Note:* ${ch.endNotes}\n\n`;
      md += `---\n\n`;
    });

    triggerDownload(`${work.title.toLowerCase().replace(/\s+/g, '_')}_manuscript.md`, md, 'text/markdown');
    setDownloadedFormat('Markdown (.md)');
  };

  const exportAsHTML = () => {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${work.title}</title>
  <style>
    body { font-family: Georgia, serif; line-height: 1.8; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1e293b; background: #fafafa; }
    h1 { font-size: 2.5rem; text-align: center; margin-bottom: 0.5rem; color: #0f172a; }
    .meta { text-align: center; color: #64748b; font-size: 0.95rem; margin-bottom: 2rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 1.5rem; }
    .summary { font-style: italic; background: #f1f5f9; padding: 1.5rem; border-radius: 8px; margin-bottom: 3rem; }
    .chapter { margin-bottom: 4rem; page-break-after: always; }
    .chapter-title { font-size: 1.75rem; border-bottom: 1px solid #cbd5e1; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
    .author-note { font-size: 0.875rem; background: #e0e7ff; padding: 1rem; border-left: 4px solid #4f46e5; border-radius: 4px; margin: 1.5rem 0; }
    .card-box { border: 1px solid #cbd5e1; background: #fff; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <h1>${work.title}</h1>
  <div class="meta">
    By <strong>${work.authorName}</strong> | ${work.category} | Rating: ${work.rating} <br>
    Word Count: ${work.wordCount.toLocaleString()} words
  </div>
  <div class="summary">
    <strong>Summary:</strong> ${work.summary}
  </div>`;

    if (includeCards && cards.length > 0) {
      html += `<h2>World & Character Deck</h2>`;
      cards.forEach((c) => {
        html += `<div class="card-box">
          <h3>[${c.type.toUpperCase()}] ${c.name}</h3>
          <p><em>${c.subtitle || ''}</em></p>
          <p>${c.summary}</p>
        </div>`;
      });
    }

    html += `<h2>Manuscript</h2>`;
    chapters.forEach((ch) => {
      html += `<div class="chapter">
        <h2 class="chapter-title">Chapter ${ch.chapterNumber}: ${ch.title}</h2>`;
      if (includeNotes && ch.startNotes) html += `<div class="author-note"><strong>Note:</strong> ${ch.startNotes}</div>`;
      html += `<div>${ch.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</div>`;
      if (includeNotes && ch.endNotes) html += `<div class="author-note"><strong>End Note:</strong> ${ch.endNotes}</div>`;
      html += `</div>`;
    });

    html += `</body></html>`;

    triggerDownload(`${work.title.toLowerCase().replace(/\s+/g, '_')}_epub_ready.html`, html, 'text/html');
    setDownloadedFormat('HTML / Printable EPUB-Ready (.html)');
  };

  const exportAsJSON = () => {
    const data = {
      work,
      chapters,
      cards,
      exportedAt: new Date().toISOString(),
    };
    triggerDownload(`${work.title.toLowerCase().replace(/\s+/g, '_')}_backup.json`, JSON.stringify(data, null, 2), 'application/json');
    setDownloadedFormat('Complete Project Backup (.json)');
  };

  const triggerDownload = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-400" /> Export Work
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-sm">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Export Options</label>
          <label className="flex items-center gap-2.5 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCards}
              onChange={(e) => setIncludeCards(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            Include Character & Lore Cards
          </label>
          <label className="flex items-center gap-2.5 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNotes}
              onChange={(e) => setIncludeNotes(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            Include Author Start & End Notes
          </label>
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Download Format</label>

          <button
            onClick={exportAsMarkdown}
            className="w-full flex items-center justify-between p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="font-semibold text-slate-100 text-sm block">Markdown Document (.md)</span>
                <span className="text-xs text-slate-400">Clean text format ideal for Wattpad/AO3 posting</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={exportAsHTML}
            className="w-full flex items-center justify-between p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="font-semibold text-slate-100 text-sm block">EPUB / HTML eBook (.html)</span>
                <span className="text-xs text-slate-400">Formatted with elegant typography & chapter breaks</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={exportAsJSON}
            className="w-full flex items-center justify-between p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition"
          >
            <div className="flex items-center gap-3">
              <Code className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-semibold text-slate-100 text-sm block">Project Backup (.json)</span>
                <span className="text-xs text-slate-400">Complete raw project state including all cards & metadata</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {downloadedFormat && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            Downloaded <strong>{downloadedFormat}</strong> successfully!
          </div>
        )}

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
