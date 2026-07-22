import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUserFromHeader } from '@/lib/auth';
import { sendApplicationSubmittedEmail } from '@/lib/email';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get('admin') === 'true';

  const authHeader = req.headers.get('authorization');
  const user = getAuthUserFromHeader(authHeader);

  if (!user || isAdmin) {
    const applications = db.getApplications();
    return NextResponse.json({ applications });
  }

  if (user.role === 'candidate') {
    const applications = db.getApplicationsForCandidate(user.id);
    return NextResponse.json({ applications });
  } else {
    const applications = db.getApplicationsForEmployer(user.id);
    return NextResponse.json({ applications });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const user = getAuthUserFromHeader(authHeader);

    const body = await req.json();
    const {
      jobId,
      candidateName,
      candidateEmail,
      candidatePhone,
      candidateHeadline,
      coverLetter,
      resumeFileName,
      resumeFileBase64,
      portfolioUrl,
      expectedSalary
    } = body;

    if (!jobId || !candidateName || !candidateEmail) {
      return NextResponse.json({ error: 'Job ID, Name, and Email are required' }, { status: 400 });
    }

    const job = db.getJobById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job opening no longer exists' }, { status: 404 });
    }

    const candidateId = user ? user.id : `guest_${Date.now()}`;

    const existingApps = db.getApplicationsForCandidate(candidateId);
    const alreadyApplied = existingApps.some((a) => a.jobId === jobId);
    if (alreadyApplied) {
      return NextResponse.json({ error: 'You have already applied for this position.' }, { status: 400 });
    }

    const newApplication = db.createApplication({
      jobId,
      candidateId,
      candidateName,
      candidateEmail,
      candidatePhone: candidatePhone || '',
      candidateHeadline: candidateHeadline || user?.headline || 'Job Seeker',
      coverLetter: coverLetter || '',
      resumeFileName: resumeFileName || user?.resumeFileName || 'Resume.pdf',
      resumeFileBase64: resumeFileBase64 || '',
      portfolioUrl: portfolioUrl || '',
      expectedSalary: expectedSalary || '',
      status: 'Submitted',
    });

    sendApplicationSubmittedEmail(
      candidateEmail,
      candidateName,
      job.title,
      job.companyName
    );

    return NextResponse.json({
      application: newApplication,
      message: 'Application submitted successfully!'
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to submit job application.' }, { status: 500 });
  }
}
