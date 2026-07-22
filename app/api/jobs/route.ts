import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUserFromHeader } from '@/lib/auth';
import { sendJobPostedEmail } from '@/lib/email';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const location = searchParams.get('location')?.toLowerCase() || '';
  const category = searchParams.get('category');
  const type = searchParams.get('type');
  const expLevel = searchParams.get('experience');
  const minSalary = searchParams.get('minSalary') ? parseInt(searchParams.get('minSalary')!) : 0;
  const isRemoteOnly = searchParams.get('remote') === 'true';
  const featuredOnly = searchParams.get('featured') === 'true';
  const employerId = searchParams.get('employerId');

  let jobs = db.getAllJobs();

  if (employerId) {
    jobs = jobs.filter((j) => j.employerId === employerId);
    return NextResponse.json({ jobs });
  }

  if (q) {
    jobs = jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.companyName.toLowerCase().includes(q) ||
        j.tags.some((t) => t.toLowerCase().includes(q)) ||
        j.description.toLowerCase().includes(q)
    );
  }

  if (location) {
    jobs = jobs.filter((j) => j.location.toLowerCase().includes(location));
  }

  if (category && category !== 'All Categories') {
    jobs = jobs.filter((j) => j.category === category);
  }

  if (type && type !== 'All Types') {
    jobs = jobs.filter((j) => j.type === type);
  }

  if (expLevel && expLevel !== 'All Levels') {
    jobs = jobs.filter((j) => j.experienceLevel === expLevel);
  }

  if (minSalary > 0) {
    jobs = jobs.filter((j) => j.salaryMax >= minSalary);
  }

  if (isRemoteOnly) {
    jobs = jobs.filter((j) => j.isRemote);
  }

  if (featuredOnly) {
    jobs = jobs.filter((j) => j.featured);
  }

  return NextResponse.json({ jobs, total: jobs.length });
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const user = getAuthUserFromHeader(authHeader);

    if (!user || user.role !== 'employer') {
      return NextResponse.json({ error: 'Unauthorized. Employer access required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      department,
      category,
      location,
      isRemote,
      type,
      experienceLevel,
      salaryMin,
      salaryMax,
      salaryCurrency,
      description,
      requirements,
      responsibilities,
      perks,
      tags,
      featured,
      urgent
    } = body;

    if (!title || !category || !description) {
      return NextResponse.json({ error: 'Title, category, and description are required.' }, { status: 400 });
    }

    const newJob = db.createJob({
      employerId: user.id,
      companyName: user.companyName || 'Company Inc.',
      companyLogo: user.companyLogo || user.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      title,
      department: department || 'Engineering',
      category,
      location: location || 'Remote',
      isRemote: Boolean(isRemote),
      type: type || 'Full-time',
      experienceLevel: experienceLevel || 'Mid Level',
      salaryMin: Number(salaryMin) || 80000,
      salaryMax: Number(salaryMax) || 120000,
      salaryCurrency: salaryCurrency || 'USD',
      description,
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n').filter(Boolean) : []),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n').filter(Boolean) : []),
      perks: Array.isArray(perks) ? perks : (perks ? perks.split('\n').filter(Boolean) : []),
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []),
      status: 'active',
      featured: Boolean(featured),
      urgent: Boolean(urgent)
    });

    sendJobPostedEmail(user.email, user.name, newJob.title);

    return NextResponse.json({ job: newJob, message: 'Job posted successfully!' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create job posting.' }, { status: 500 });
  }
}
