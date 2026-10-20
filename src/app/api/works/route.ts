import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Work } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const fandom = searchParams.get('fandom');
  const rating = searchParams.get('rating');
  const warning = searchParams.get('warning');
  const tag = searchParams.get('tag');
  const status = searchParams.get('status');
  const sortBy = searchParams.get('sortBy') || 'updatedAt'; // 'updatedAt' | 'kudos' | 'bookmarks' | 'words'

  let sql = 'SELECT * FROM works WHERE 1=1';
  const params: any[] = [];

  if (q) {
    sql += ' AND (title LIKE ? OR summary LIKE ? OR authorName LIKE ?)';
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  if (category && category !== 'All') {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (rating && rating !== 'All') {
    sql += ' AND rating = ?';
    params.push(rating);
  }

  if (status && status !== 'All') {
    sql += ' AND status = ?';
    params.push(status);
  }

  if (sortBy === 'kudos') {
    sql += ' ORDER BY kudosCount DESC';
  } else if (sortBy === 'bookmarks') {
    sql += ' ORDER BY bookmarkCount DESC';
  } else if (sortBy === 'words') {
    sql += ' ORDER BY wordCount DESC';
  } else {
    sql += ' ORDER BY updatedAt DESC';
  }

  const rows = db.prepare(sql).all(...params) as any[];

  let works: Work[] = rows.map((r) => ({
    ...r,
    fandoms: JSON.parse(r.fandoms || '[]'),
    archiveWarnings: JSON.parse(r.archiveWarnings || '[]'),
    relationships: JSON.parse(r.relationships || '[]'),
    characters: JSON.parse(r.characters || '[]'),
    tags: JSON.parse(r.tags || '[]'),
  }));

  // Client-side / In-memory filter for array fields like fandom, tag, warning
  if (fandom) {
    works = works.filter((w) => w.fandoms.some((f) => f.toLowerCase().includes(fandom.toLowerCase())));
  }
  if (warning) {
    works = works.filter((w) => w.archiveWarnings.some((a) => a.toLowerCase().includes(warning.toLowerCase())));
  }
  if (tag) {
    works = works.filter((w) => w.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())));
  }

  return NextResponse.json(works);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const newId = `work-${Date.now()}`;

    const newWork: Work = {
      id: newId,
      title: body.title || 'Untitled Work',
      summary: body.summary || '',
      coverUrl: body.coverUrl || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop',
      category: body.category || 'Original',
      fandoms: body.fandoms || (body.category === 'Fanfiction' ? ['General'] : ['Original Work']),
      rating: body.rating || 'General Audiences',
      archiveWarnings: body.archiveWarnings || ['No Archive Warnings Apply'],
      relationships: body.relationships || [],
      characters: body.characters || [],
      tags: body.tags || [],
      status: 'In Progress',
      wordCount: 0,
      kudosCount: 0,
      bookmarkCount: 0,
      commentCount: 0,
      language: body.language || 'English',
      authorName: body.authorName || 'Anonymous Writer',
      authorAvatar: body.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      createdAt: now,
      updatedAt: now,
    };

    db.prepare(`
      INSERT INTO works (
        id, title, summary, coverUrl, category, fandoms, rating, archiveWarnings,
        relationships, characters, tags, status, wordCount, kudosCount, bookmarkCount, commentCount, language, authorName, authorAvatar, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newWork.id,
      newWork.title,
      newWork.summary,
      newWork.coverUrl,
      newWork.category,
      JSON.stringify(newWork.fandoms),
      newWork.rating,
      JSON.stringify(newWork.archiveWarnings),
      JSON.stringify(newWork.relationships),
      JSON.stringify(newWork.characters),
      JSON.stringify(newWork.tags),
      newWork.status,
      newWork.wordCount,
      newWork.kudosCount,
      newWork.bookmarkCount,
      newWork.commentCount,
      newWork.language,
      newWork.authorName,
      newWork.authorAvatar,
      newWork.createdAt,
      newWork.updatedAt
    );

    // Automatically create Chapter 1 for convenience
    db.prepare(`
      INSERT INTO chapters (id, workId, chapterNumber, title, content, summary, startNotes, endNotes, wordCount, publishedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `ch-${newId}-1`,
      newId,
      1,
      'Chapter 1',
      'Start writing your epic story here...',
      '',
      '',
      '',
      5,
      now
    );

    return NextResponse.json(newWork, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
