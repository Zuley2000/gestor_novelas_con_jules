import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, mode, context } = body;

    if (!prompt && mode !== 'brainstorm') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let responseText = '';

    if (mode === 'expand') {
      responseText = `The air grew heavy with anticipation. ${prompt.trim()} Shadowy contours lengthened across the cobblestones as an eerie stillness settled over Sector 4. Every alleyway seemed to echo with hidden secrets waiting to be uncovered.`;
    } else if (mode === 'polish') {
      responseText = prompt
        .replace(/very /gi, '')
        .replace(/ nice /gi, ' exquisite ')
        .replace(/ walk /gi, ' stride ')
        .trim() + ' [Polished for active voice, vivid imagery, and pacing]';
    } else if (mode === 'brainstorm') {
      responseText = `1. **The Sudden Eclipse:** An unexpected lunar event disrupts the energy grid, causing magical wards to falter.\n2. **Double Agent Revelation:** A close ally drops a secret cipher revealing allegiance to the Guild.\n3. **Forgotten Artifact:** Deep inside the lower vaults, an ancient tome begins responding to Kaelen's spell signature.`;
    } else {
      responseText = `AI Suggestion: Continue building tension between characters by focusing on sensory details and subtle body language.`;
    }

    return NextResponse.json({ result: responseText });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
