import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || undefined;
  const notifications = db.getNotifications(email);
  return NextResponse.json({ notifications });
}
