import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUserFromHeader } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const job = db.getJobById(params.id);
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }
  return NextResponse.json({ job });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const authHeader = req.headers.get('authorization');
  const user = getAuthUserFromHeader(authHeader);

  if (!user || user.role !== 'employer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const job = db.getJobById(params.id);
  if (!job || job.employerId !== user.id) {
    return NextResponse.json({ error: 'Job not found or permission denied' }, { status: 404 });
  }

  const body = await req.json();
  const updatedJob = db.updateJob(params.id, body);
  return NextResponse.json({ job: updatedJob });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authHeader = req.headers.get('authorization');
  const user = getAuthUserFromHeader(authHeader);

  if (!user || user.role !== 'employer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const job = db.getJobById(params.id);
  if (!job || job.employerId !== user.id) {
    return NextResponse.json({ error: 'Job not found or permission denied' }, { status: 404 });
  }

  db.deleteJob(params.id);
  return NextResponse.json({ success: true, message: 'Job deleted successfully' });
}
