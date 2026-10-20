import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PlanningCard } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workId = searchParams.get('workId');

  if (!workId) {
    return NextResponse.json({ error: 'workId required' }, { status: 400 });
  }

  const rows = db
    .prepare('SELECT * FROM planning_cards WHERE workId = ? ORDER BY position ASC')
    .all(workId) as PlanningCard[];

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = `plan-${Date.now()}`;

    const newCard: PlanningCard = {
      id,
      workId: body.workId,
      boardType: body.boardType || 'snowflake',
      act: body.act || 'Act 1: Setup',
      chapterId: body.chapterId || '',
      title: body.title || 'New Scene / Plot Point',
      content: body.content || '',
      status: body.status || 'idea',
      position: body.position || 99,
      color: body.color || 'bg-slate-500/10 border-slate-500/30',
    };

    db.prepare(`
      INSERT INTO planning_cards (id, workId, boardType, act, chapterId, title, content, status, position, color)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newCard.id,
      newCard.workId,
      newCard.boardType,
      newCard.act,
      newCard.chapterId,
      newCard.title,
      newCard.content,
      newCard.status,
      newCard.position,
      newCard.color
    );

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    db.prepare(`
      UPDATE planning_cards SET
        act = ?,
        chapterId = ?,
        title = ?,
        content = ?,
        status = ?,
        position = ?,
        color = ?
      WHERE id = ?
    `).run(
      body.act,
      body.chapterId,
      body.title,
      body.content,
      body.status,
      body.position,
      body.color,
      body.id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    db.prepare('DELETE FROM planning_cards WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
