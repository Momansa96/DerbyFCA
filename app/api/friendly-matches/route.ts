import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const matches = await prisma.friendlyMatch.findMany({
      orderBy: { date: 'asc' },
      include: {
        compositions: {
          include: {
            player: {
              select: { id: true, fullName: true, alias: true, profilePhoto: true, number: true },
            },
          },
        },
        goals: {
          include: {
            player: { select: { id: true, fullName: true, alias: true, profilePhoto: true } },
            assistPlayer: { select: { id: true, fullName: true, alias: true, profilePhoto: true } },
          },
          orderBy: { minute: 'asc' },
        },
      },
    });
    return NextResponse.json(matches);
  } catch (error) {
    console.error('Erreur GET friendly-matches:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, date, time, location, place, opponent } = body;

    if (!type || !date || !time || !location || !place || !opponent) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const match = await prisma.friendlyMatch.create({
      data: { type, date, time, location, place, opponent },
    });

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error('Erreur POST friendly-matches:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
