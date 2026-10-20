import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Work, Chapter, CreativeCard, PlanningCard, Comment } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const workId = resolvedParams.id;

  const row = db.prepare('SELECT * FROM works WHERE id = ?').get(workId) as any;
  if (!row) {
    return NextResponse.json({ error: 'Work not found' }, { status: 404 });
  }

  const work: Work = {
    ...row,
    fandoms: JSON.parse(row.fandoms || '[]'),
    archiveWarnings: JSON.parse(row.archiveWarnings || '[]'),
    relationships: JSON.parse(row.relationships || '[]'),
    characters: JSON.parse(row.characters || '[]'),
    tags: JSON.parse(row.tags || '[]'),
  };

  const chapterRows = db
    .prepare('SELECT * FROM chapters WHERE workId = ? ORDER BY chapterNumber ASC')
    .all(workId) as Chapter[];

  const cardRows = db
    .prepare('SELECT * FROM creative_cards WHERE workId = ?')
    .all(workId) as any[];

  const cards: CreativeCard[] = cardRows.map((c) => ({
    ...c,
    tags: JSON.parse(c.tags || '[]'),
    fields: JSON.parse(c.fields || '[]'),
    connections: JSON.parse(c.connections || '[]'),
  }));

  const planningRows = db
    .prepare('SELECT * FROM planning_cards WHERE workId = ? ORDER BY position ASC')
    .all(workId) as PlanningCard[];

  const commentRows = db
    .prepare('SELECT * FROM comments WHERE workId = ? ORDER BY createdAt DESC')
    .all(workId) as Comment[];

  return NextResponse.json({
    work,
    chapters: chapterRows,
    cards,
    planningCards: planningRows,
    comments: commentRows,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const workId = resolvedParams.id;
    const body = await request.json();
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE works SET
        title = ?,
        summary = ?,
        coverUrl = ?,
        category = ?,
        fandoms = ?,
        rating = ?,
        archiveWarnings = ?,
        relationships = ?,
        characters = ?,
        tags = ?,
        status = ?,
        updatedAt = ?
      WHERE id = ?
    `).run(
      body.title,
      body.summary,
      body.coverUrl,
      body.category,
      JSON.stringify(body.fandoms || []),
      body.rating,
      JSON.stringify(body.archiveWarnings || []),
      JSON.stringify(body.relationships || []),
      JSON.stringify(body.characters || []),
      JSON.stringify(body.tags || []),
      body.status,
      now,
      workId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const workId = resolvedParams.id;

    db.prepare('DELETE FROM works WHERE id = ?').run(workId);
    db.prepare('DELETE FROM chapters WHERE workId = ?').run(workId);
    db.prepare('DELETE FROM creative_cards WHERE workId = ?').run(workId);
    db.prepare('DELETE FROM planning_cards WHERE workId = ?').run(workId);
    db.prepare('DELETE FROM comments WHERE workId = ?').run(workId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
