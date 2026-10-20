import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workId, action, chapterId, username, content } = body;

    if (!workId || !action) {
      return NextResponse.json({ error: 'workId and action are required' }, { status: 400 });
    }

    if (action === 'kudos') {
      db.prepare('UPDATE works SET kudosCount = kudosCount + 1 WHERE id = ?').run(workId);
      const row = db.prepare('SELECT kudosCount FROM works WHERE id = ?').get(workId) as { kudosCount: number };
      return NextResponse.json({ success: true, kudosCount: row.kudosCount });
    }

    if (action === 'bookmark') {
      db.prepare('UPDATE works SET bookmarkCount = bookmarkCount + 1 WHERE id = ?').run(workId);
      const row = db.prepare('SELECT bookmarkCount FROM works WHERE id = ?').get(workId) as { bookmarkCount: number };
      return NextResponse.json({ success: true, bookmarkCount: row.bookmarkCount });
    }

    if (action === 'comment') {
      if (!content) {
        return NextResponse.json({ error: 'Comment content required' }, { status: 400 });
      }

      const commentId = `comm-${Date.now()}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO comments (id, workId, chapterId, username, userAvatar, content, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        commentId,
        workId,
        chapterId || null,
        username || 'Anonymous Reader',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
        content,
        now
      );

      db.prepare('UPDATE works SET commentCount = commentCount + 1 WHERE id = ?').run(workId);

      return NextResponse.json({
        id: commentId,
        workId,
        chapterId,
        username: username || 'Anonymous Reader',
        content,
        createdAt: now,
      }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
