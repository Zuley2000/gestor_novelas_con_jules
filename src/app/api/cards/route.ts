import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CreativeCard } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workId = searchParams.get('workId');

  let sql = 'SELECT * FROM creative_cards';
  const params: any[] = [];

  if (workId) {
    sql += ' WHERE workId = ?';
    params.push(workId);
  }

  sql += ' ORDER BY name ASC';

  const rows = db.prepare(sql).all(...params) as any[];

  const cards: CreativeCard[] = rows.map((c) => ({
    ...c,
    tags: JSON.parse(c.tags || '[]'),
    fields: JSON.parse(c.fields || '[]'),
    connections: JSON.parse(c.connections || '[]'),
  }));

  return NextResponse.json(cards);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const id = `card-${Date.now()}`;

    const newCard: CreativeCard = {
      id,
      workId: body.workId || undefined,
      type: body.type || 'character',
      name: body.name || 'New Card',
      subtitle: body.subtitle || '',
      avatarUrl: body.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      summary: body.summary || '',
      tags: body.tags || [],
      fields: body.fields || [],
      connections: body.connections || [],
      createdAt: now,
      updatedAt: now,
    };

    db.prepare(`
      INSERT INTO creative_cards (id, workId, type, name, subtitle, avatarUrl, summary, tags, fields, connections, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newCard.id,
      newCard.workId || null,
      newCard.type,
      newCard.name,
      newCard.subtitle,
      newCard.avatarUrl,
      newCard.summary,
      JSON.stringify(newCard.tags),
      JSON.stringify(newCard.fields),
      JSON.stringify(newCard.connections),
      newCard.createdAt,
      newCard.updatedAt
    );

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE creative_cards SET
        type = ?,
        name = ?,
        subtitle = ?,
        avatarUrl = ?,
        summary = ?,
        tags = ?,
        fields = ?,
        connections = ?,
        updatedAt = ?
      WHERE id = ?
    `).run(
      body.type,
      body.name,
      body.subtitle,
      body.avatarUrl,
      body.summary,
      JSON.stringify(body.tags || []),
      JSON.stringify(body.fields || []),
      JSON.stringify(body.connections || []),
      now,
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

    db.prepare('DELETE FROM creative_cards WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
