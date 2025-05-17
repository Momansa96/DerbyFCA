import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const matches = await prisma.friendlyMatch.findMany({
      orderBy: { date: 'asc' },
    });
    return NextResponse.json(matches);
  } catch (error) {
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
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
