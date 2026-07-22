import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUserFromHeader } from '@/lib/auth';

export async function PUT(req: Request) {
  const authHeader = req.headers.get('authorization');
  const user = getAuthUserFromHeader(authHeader);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updates = await req.json();
  const updatedUser = db.updateUserProfile(user.id, updates);

  return NextResponse.json({ user: updatedUser, message: 'Profile updated successfully' });
}
