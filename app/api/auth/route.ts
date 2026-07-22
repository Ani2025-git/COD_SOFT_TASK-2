import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateToken, getAuthUserFromHeader } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, role, name, companyName } = body;

    if (action === 'login') {
      const user = db.getUserByEmail(email);
      if (!user) {
        return NextResponse.json({ error: 'User not found. Try demo login buttons.' }, { status: 401 });
      }

      const token = generateToken(user);
      return NextResponse.json({ token, user });
    }

    if (action === 'register') {
      if (!email || !name) {
        return NextResponse.json({ error: 'Email and Name are required' }, { status: 400 });
      }

      const existing = db.getUserByEmail(email);
      if (existing) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }

      const newUser = db.createUser({
        email,
        name,
        role: role || 'candidate',
        companyName: companyName || (role === 'employer' ? 'Company Inc.' : undefined),
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff`,
      });

      const token = generateToken(newUser);
      return NextResponse.json({ token, user: newUser });
    }

    return NextResponse.json({ error: 'Invalid auth action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const user = getAuthUserFromHeader(authHeader);

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user });
}
