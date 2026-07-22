import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUserFromHeader } from '@/lib/auth';
import { sendStatusUpdatedEmail } from '@/lib/email';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const authHeader = req.headers.get('authorization');
  const user = getAuthUserFromHeader(authHeader);

  if (!user || user.role !== 'employer') {
    return NextResponse.json({ error: 'Unauthorized. Employer role required.' }, { status: 403 });
  }

  const body = await req.json();
  const { status, notes } = body;

  if (!status) {
    return NextResponse.json({ error: 'Status is required' }, { status: 400 });
  }

  const updatedApp = db.updateApplicationStatus(params.id, status, notes);

  if (!updatedApp) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  const job = db.getJobById(updatedApp.jobId);

  sendStatusUpdatedEmail(
    updatedApp.candidateEmail,
    updatedApp.candidateName,
    job ? job.title : 'Job Opening',
    job ? job.companyName : 'Employer',
    status,
    notes
  );

  return NextResponse.json({ application: updatedApp, message: `Status updated to ${status}` });
}
