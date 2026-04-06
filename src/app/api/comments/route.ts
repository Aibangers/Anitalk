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

  const comments = await prisma.comment.findMany({
    where: { animeId, episode },
    include: {
      user: {
        select: { id: true, username: true, name: true, image: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { content, animeId, episode } = await req.json();

  if (!content || !animeId || !episode) {
    return NextResponse.json(
      { error: 'content, animeId, and episode are required' },
      { status: 400 }
    );
  }

  if (content.length > 2000) {
    return NextResponse.json(
      { error: 'Comment must be 2000 characters or less' },
      { status: 400 }
    );
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      animeId,
      episode,
      userId: session.user.id,
    },
    include: {
      user: {
        select: { id: true, username: true, name: true, image: true },
      },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
