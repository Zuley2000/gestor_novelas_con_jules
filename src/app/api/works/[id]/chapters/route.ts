import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Chapter } from '@/lib/types';

function calculateWordCount(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function updateWorkWordCount(workId: string) {
  const result = db
    .prepare('SELECT SUM(wordCount) as total FROM chapters WHERE workId = ?')
    .get(workId) as { total: number };

  const totalWords = result.total || 0;
  const now = new Date().toISOString();
  db.prepare('UPDATE works SET wordCount = ?, updatedAt = ? WHERE id = ?').run(totalWords, now, workId);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const workId = resolvedParams.id;
    const body = await request.json();
    const now = new Date().toISOString();

    // Determine next chapter number
    const maxCh = db
      .prepare('SELECT MAX(chapterNumber) as maxNum FROM chapters WHERE workId = ?')
      .get(workId) as { maxNum: number };
    const nextNum = (maxCh.maxNum || 0) + 1;

    const chapterId = `ch-${workId}-${Date.now()}`;
    const wordCount = calculateWordCount(body.content || '');

    const newChapter: Chapter = {
      id: chapterId,
      workId,
      chapterNumber: nextNum,
      title: body.title || `Chapter ${nextNum}`,
      content: body.content || '',
      summary: body.summary || '',
      startNotes: body.startNotes || '',
      endNotes: body.endNotes || '',
      wordCount,
      publishedAt: now,
    };

    db.prepare(`
      INSERT INTO chapters (id, workId, chapterNumber, title, content, summary, startNotes, endNotes, wordCount, publishedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newChapter.id,
      newChapter.workId,
      newChapter.chapterNumber,
      newChapter.title,
      newChapter.content,
      newChapter.summary,
      newChapter.startNotes,
      newChapter.endNotes,
      newChapter.wordCount,
      newChapter.publishedAt
    );

    updateWorkWordCount(workId);

    return NextResponse.json(newChapter, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const workId = resolvedParams.id;
    const body = await request.json(); // expected { chapterId, title, content, summary, startNotes, endNotes }

    if (!body.chapterId) {
      return NextResponse.json({ error: 'chapterId required' }, { status: 400 });
    }

    const wordCount = calculateWordCount(body.content || '');

    db.prepare(`
      UPDATE chapters SET
        title = ?,
        content = ?,
        summary = ?,
        startNotes = ?,
        endNotes = ?,
        wordCount = ?
      WHERE id = ? AND workId = ?
    `).run(
      body.title,
      body.content,
      body.summary,
      body.startNotes,
      body.endNotes,
      wordCount,
      body.chapterId,
      workId
    );

    updateWorkWordCount(workId);

    return NextResponse.json({ success: true, wordCount });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
