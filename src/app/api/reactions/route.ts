import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const animeId = parseInt(searchParams.get('animeId') || '0', 10);
  const episode = parseInt(searchParams.get('episode') || '0', 10);

  if (!animeId || !episode) {
    return NextResponse.json({ error: 'animeId and episode are required' }, { status: 400 });
  }

  const session = await auth();

  // Get all reactions for this episode, grouped by emoji
  const reactions = await prisma.reaction.groupBy({
    by: ['emoji'],
    where: { animeId, episode },
    _count: { emoji: true },
  });

  // Get user's reaction if logged in
  let userReaction: string | null = null;
  if (session?.user?.id) {
    const existing = await prisma.reaction.findUnique({
      where: {
        userId_animeId_episode: {
          userId: session.user.id,
          animeId,
          episode,
        },
      },
    });
    userReaction = existing?.emoji || null;
  }

  // Build counts map
  const countsMap: Record<string, number> = {};
  for (const r of reactions) {
    countsMap[r.emoji] = r._count.emoji;
  }

  return NextResponse.json({ counts: countsMap, userReaction });
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { emoji, animeId, episode } = await req.json();

  if (!emoji || !animeId || !episode) {
    return NextResponse.json(
      { error: 'emoji, animeId, and episode are required' },
      { status: 400 }
    );
  }

  const existing = await prisma.reaction.findUnique({
    where: {
      userId_animeId_episode: {
        userId: session.user.id,
        animeId,
        episode,
      },
    },
  });

  if (existing) {
    if (existing.emoji === emoji) {
      // Same emoji — remove (toggle off)
      await prisma.reaction.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ action: 'removed', emoji });
    } else {
      // Different emoji — update
      await prisma.reaction.update({
        where: { id: existing.id },
        data: { emoji },
      });
      return NextResponse.json({ action: 'updated', emoji });
    }
  } else {
    // No existing reaction — create
    await prisma.reaction.create({
      data: {
        emoji,
        animeId,
        episode,
        userId: session.user.id,
      },
    });
    return NextResponse.json({ action: 'created', emoji });
  }
}
