import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUserFromHeader } from '@/lib/auth';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const user = getAuthUserFromHeader(authHeader);

  if (!user) {
    return NextResponse.json({ savedJobIds: [] });
  }

  const savedJobIds = db.getSavedJobIds(user.id);
  const allJobs = db.getAllJobs();
  const savedJobs = allJobs.filter((j) => savedJobIds.includes(j.id));

  return NextResponse.json({ savedJobIds, savedJobs });
}

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  const user = getAuthUserFromHeader(authHeader);

  if (!user) {
    return NextResponse.json({ error: 'Please log in to save jobs.' }, { status: 401 });
  }

  const body = await req.json();
  const { jobId } = body;

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
  }

  const isSaved = db.toggleSaveJob(user.id, jobId);
  return NextResponse.json({ isSaved, savedJobIds: db.getSavedJobIds(user.id) });
}
