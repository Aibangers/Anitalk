import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ maxEpisode: 0 });
  }

  const { searchParams } = new URL(req.url);
  const animeId = parseInt(searchParams.get('animeId') || '0', 10);

  if (!animeId) {
    return NextResponse.json({ error: 'animeId is required' }, { status: 400 });
  }

  const progress = await prisma.watchProgress.findUnique({
    where: {
      userId_animeId: {
        userId: session.user.id,
        animeId,
      },
    },
  });

  return NextResponse.json({ maxEpisode: progress?.maxEpisode || 0 });
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { animeId, maxEpisode } = await req.json();

  if (!animeId || maxEpisode === undefined) {
    return NextResponse.json(
      { error: 'animeId and maxEpisode are required' },
      { status: 400 }
    );
  }

  const progress = await prisma.watchProgress.upsert({
    where: {
      userId_animeId: {
        userId: session.user.id,
        animeId,
      },
    },
    update: { maxEpisode },
    create: {
      userId: session.user.id,
      animeId,
      maxEpisode,
    },
  });

  return NextResponse.json(progress);
}
