import { User, Job, Application, NotificationLog } from './types';

// Initial Mock Seed Data
const initialUsers: User[] = [
  {
    id: 'usr_emp_1',
    name: 'Sarah Jenkins',
    email: 'employer@techcorp.com',
    role: 'employer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    companyName: 'Nexus Tech Studios',
    companyWebsite: 'https://nexustech.io',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    headline: 'Senior Talent Acquisition Lead at Nexus Tech',
    bio: 'Building world-class engineering teams across AI, Cloud Infrastructure, and Modern Web Systems.',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'usr_cand_1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'candidate',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    headline: 'Full-Stack React & Node.js Engineer',
    bio: 'Passionate software engineer with 5+ years building scalable Web apps with React, Next.js, Node, and TypeScript.',
    skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'PostgreSQL', 'GraphQL'],
    resumeFileName: 'Alex_Rivera_Senior_FullStack_Resume.pdf',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const initialJobs: Job[] = [
  {
    id: 'job_1',
    employerId: 'usr_emp_1',
    companyName: 'Nexus Tech Studios',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    title: 'Senior Full Stack Engineer (React & Node.js)',
    department: 'Engineering',
    category: 'Software Engineering',
    location: 'San Francisco, CA',
    isRemote: true,
    type: 'Full-time',
    experienceLevel: 'Senior Level',
    salaryMin: 140000,
    salaryMax: 185000,
    salaryCurrency: 'USD',
    description: 'We are seeking an experienced Full Stack Engineer to lead the architecture of our cloud platform dashboard. You will work directly with our CTO to build high-throughput APIs in Node.js and rich interactive user experiences in React.',
    requirements: [
      '5+ years professional experience with React and Node.js in production environments.',
      'Deep understanding of TypeScript, RESTful API design, and asynchronous patterns.',
      'Hands-on experience with MongoDB, PostgreSQL, and Redis caching layers.',
      'Familiarity with Vercel deployment, CI/CD pipelines, and AWS cloud infrastructure.',
      'Strong focus on performance optimization, SEO, and web accessibility standards.'
    ],
    responsibilities: [
      'Architect, develop, and test scalable web applications using Next.js & Node.',
      'Collaborate with UI/UX designers to translate Figma wireframes into pixel-perfect code.',
      'Mentor junior software engineers and conduct code reviews.',
      'Optimize application load time and browser rendering efficiency.'
    ],
    perks: [
      '100% Remote flexibility with home office stipend ($1,500)',
      'Unlimited Paid Time Off (PTO) + wellness days',
      'Full Health, Dental, and Vision coverage for you and dependents',
      '$2,000 annual learning budget for courses and conferences'
    ],
    tags: ['React', 'Node.js', 'TypeScript', 'Next.js', 'Remote'],
    status: 'active',
    applicantCount: 14,
    featured: true,
    urgent: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job_2',
    employerId: 'usr_emp_1',
    companyName: 'Stripe Innovation Labs',
    companyLogo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&auto=format&fit=crop&q=80',
    title: 'Lead Frontend Developer - Design Systems',
    department: 'Product Design',
    category: 'Frontend Development',
    location: 'New York, NY',
    isRemote: true,
    type: 'Full-time',
    experienceLevel: 'Lead / Executive',
    salaryMin: 160000,
    salaryMax: 210000,
    salaryCurrency: 'USD',
    description: 'Join our Design Systems engineering team to build reusable React components, micro-animations, and themeable UI libraries used by millions of global developers daily.',
    requirements: [
      '7+ years experience specializing in modern CSS, Tailwind, Web Components, and React.',
      'Expertise in web animation libraries like Framer Motion or GSAP.',
      'Proven track record of maintaining open-source or enterprise design tokens.'
    ],
    responsibilities: [
      'Own the design system roadmap and library of accessible UI components.',
      'Write comprehensive developer documentation and component playgrounds.',
      'Ensure 100% WCAG 2.1 AA accessibility compliance across all components.'
    ],
    perks: [
      'Stock options (Equity grant)',
      'Competitive 401(k) matching up to 6%',
      'Top-tier Apple M3 Max Hardware setup provided'
    ],
    tags: ['Frontend', 'React', 'TailwindCSS', 'Framer Motion', 'Design System'],
    status: 'active',
    applicantCount: 22,
    featured: true,
    urgent: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job_3',
    employerId: 'usr_emp_1',
    companyName: 'HyperCloud AI',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
    title: 'Backend Node.js & Database Engineer',
    department: 'Platform Engineering',
    category: 'Backend & Cloud',
    location: 'Austin, TX',
    isRemote: false,
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryMin: 120000,
    salaryMax: 155000,
    salaryCurrency: 'USD',
    description: 'We are expanding our core backend team! You will design high-availability backend microservices using Express, Fastify, MongoDB, and PostgreSQL.',
    requirements: [
      '3+ years experience with Node.js backend development.',
      'Proficiency with database indexing, schema migrations, and ORMs (Mongoose, Prisma).',
      'Knowledge of Docker, Kubernetes, and gRPC microservices.'
    ],
    responsibilities: [
      'Develop robust REST & GraphQL APIs with JWT authentication.',
      'Monitor server health, latency, and implement automated regression testing.',
      'Maintain database connections and connection pooling in cloud clusters.'
    ],
    perks: [
      'Flexible hybrid schedule (2 days in Austin office)',
      'Catered lunch & organic barista bar on-site',
      'Annual company retreat in Hawaii'
    ],
    tags: ['Node.js', 'MongoDB', 'PostgreSQL', 'Express', 'API'],
    status: 'active',
    applicantCount: 9,
    featured: false,
    urgent: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job_4',
    employerId: 'usr_emp_1',
    companyName: 'Vercel Ecosystems',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    title: 'Developer Experience (DX) Specialist',
    department: 'Developer Relations',
    category: 'DevRel & Marketing',
    location: 'Remote Global',
    isRemote: true,
    type: 'Contract',
    experienceLevel: 'Mid Level',
    salaryMin: 90000,
    salaryMax: 130000,
    salaryCurrency: 'USD',
    description: 'Create world-class developer guides, sample repositories, and interactive tutorials for Next.js and serverless deployments.',
    requirements: [
      'Experience authoring technical documentation and blog articles for developers.',
      'Hands-on React & Next.js sample building experience.',
      'Active presence in developer communities (GitHub, Discord, X).'
    ],
    responsibilities: [
      'Build demo apps demonstrating edge functions and Server Actions.',
      'Interact with open-source contributors and resolve GitHub discussions.',
      'Host tech webinars and developer live-streams.'
    ],
    perks: [
      '100% async remote work setup',
      'Flexible contract schedule',
      'Global tech conference sponsorships'
    ],
    tags: ['DevRel', 'Next.js', 'Technical Writing', 'Open Source'],
    status: 'active',
    applicantCount: 18,
    featured: true,
    urgent: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job_5',
    employerId: 'usr_emp_1',
    companyName: 'FinPulse Systems',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
    title: 'UI/UX Product Designer & Prototyper',
    department: 'Product Design',
    category: 'UI/UX Design',
    location: 'Seattle, WA',
    isRemote: true,
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryMin: 115000,
    salaryMax: 145000,
    salaryCurrency: 'USD',
    description: 'Craft beautiful financial dashboards, trading interfaces, and mobile mobile-responsive components.',
    requirements: [
      '3+ years experience with Figma, design tokens, and user testing.',
      'Solid grasp of modern dark mode design aesthetics and micro-interactions.',
      'Basic knowledge of HTML/CSS to coordinate smoothly with front-end engineers.'
    ],
    responsibilities: [
      'Design user flows, wireframes, and high-fidelity interactive prototypes.',
      'Conduct user interviews and synthesize UX analytics data.',
      'Maintain design library consistency.'
    ],
    perks: [
      'Competitive salary + annual performance bonus',
      'Health savings account (HSA) with company contribution',
      'Wellness & fitness reimbursement'
    ],
    tags: ['Figma', 'UI/UX', 'Product Design', 'Prototyping'],
    status: 'active',
    applicantCount: 7,
    featured: false,
    urgent: false,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const initialApplications: Application[] = [
  {
    id: 'app_1',
    jobId: 'job_1',
    candidateId: 'usr_cand_1',
    candidateName: 'Alex Rivera',
    candidateEmail: 'alex.rivera@example.com',
    candidatePhone: '+1 (555) 234-5678',
    candidateHeadline: 'Full-Stack React & Node.js Engineer',
    coverLetter: 'Dear Hiring Manager,\n\nI am thrilled to apply for the Senior Full Stack Engineer position at Nexus Tech. Having built scalable React/Next.js interfaces with Node backends for 5+ years, I am confident I can make an immediate impact on your platform architecture.\n\nBest regards,\nAlex Rivera',
    resumeFileName: 'Alex_Rivera_Senior_FullStack_Resume.pdf',
    portfolioUrl: 'https://alexrivera.dev',
    expectedSalary: '$165,000 / year',
    status: 'Under Review',
    notes: 'Impressive GitHub portfolio and deep Next.js experience. Scheduled for initial screening.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    jobTitle: 'Senior Full Stack Engineer (React & Node.js)',
    companyName: 'Nexus Tech Studios',
  }
];

const initialSavedJobs: string[] = ['job_1', 'job_2'];
const initialNotifications: NotificationLog[] = [
  {
    id: 'notif_1',
    toEmail: 'alex.rivera@example.com',
    toName: 'Alex Rivera',
    subject: 'Application Confirmation: Senior Full Stack Engineer at Nexus Tech Studios',
    type: 'application_submitted',
    previewText: 'Thank you for submitting your application for Senior Full Stack Engineer.',
    bodyHtml: '<p>Hi Alex,</p><p>We received your application for <strong>Senior Full Stack Engineer (React & Node.js)</strong> at <strong>Nexus Tech Studios</strong>.</p><p>The hiring team is currently reviewing your resume. You can track your application status anytime in your JobConnect Candidate Dashboard.</p>',
    sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

class InMemoryDatabase {
  private users: User[] = [...initialUsers];
  private jobs: Job[] = [...initialJobs];
  private applications: Application[] = [...initialApplications];
  private savedJobsByUser: Record<string, string[]> = {
    'usr_cand_1': [...initialSavedJobs]
  };
  private notifications: NotificationLog[] = [...initialNotifications];

  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUserProfile(id: string, updates: Partial<User>): User | null {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates };
    return this.users[idx];
  }

  getAllJobs(): Job[] {
    return this.jobs;
  }

  getJobById(id: string): Job | undefined {
    return this.jobs.find((j) => j.id === id);
  }

  createJob(jobData: Omit<Job, 'id' | 'applicantCount' | 'createdAt'>): Job {
    const newJob: Job = {
      ...jobData,
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      applicantCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.jobs.unshift(newJob);
    return newJob;
  }

  updateJob(id: string, updates: Partial<Job>): Job | null {
    const idx = this.jobs.findIndex((j) => j.id === id);
    if (idx === -1) return null;
    this.jobs[idx] = { ...this.jobs[idx], ...updates };
    return this.jobs[idx];
  }

  deleteJob(id: string): boolean {
    const idx = this.jobs.findIndex((j) => j.id === id);
    if (idx === -1) return false;
    this.jobs.splice(idx, 1);
    return true;
  }

  getApplications(): Application[] {
    return this.applications;
  }

  getApplicationsForCandidate(candidateId: string): Application[] {
    return this.applications.filter((a) => a.candidateId === candidateId);
  }

  getApplicationsForEmployer(employerId: string): Application[] {
    const employerJobIds = this.jobs.filter((j) => j.employerId === employerId).map((j) => j.id);
    return this.applications.filter((a) => employerJobIds.includes(a.jobId));
  }

  createApplication(appData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Application {
    const job = this.getJobById(appData.jobId);
    const newApp: Application = {
      ...appData,
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      jobTitle: job ? job.title : 'Job Opening',
      companyName: job ? job.companyName : 'Company',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.applications.unshift(newApp);

    if (job) {
      this.updateJob(job.id, { applicantCount: job.applicantCount + 1 });
    }

    return newApp;
  }

  updateApplicationStatus(id: string, status: Application['status'], notes?: string): Application | null {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.applications[idx].status = status;
    if (notes !== undefined) this.applications[idx].notes = notes;
    this.applications[idx].updatedAt = new Date().toISOString();
    return this.applications[idx];
  }

  getSavedJobIds(userId: string): string[] {
    return this.savedJobsByUser[userId] || [];
  }

  toggleSaveJob(userId: string, jobId: string): boolean {
    if (!this.savedJobsByUser[userId]) {
      this.savedJobsByUser[userId] = [];
    }
    const list = this.savedJobsByUser[userId];
    const index = list.indexOf(jobId);
    if (index > -1) {
      list.splice(index, 1);
      return false;
    } else {
      list.push(jobId);
      return true;
    }
  }

  addNotification(log: Omit<NotificationLog, 'id' | 'sentAt'>): NotificationLog {
    const notif: NotificationLog = {
      ...log,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sentAt: new Date().toISOString()
    };
    this.notifications.unshift(notif);
    return notif;
  }

  getNotifications(email?: string): NotificationLog[] {
    if (!email) return this.notifications;
    return this.notifications.filter((n) => n.toEmail.toLowerCase() === email.toLowerCase());
  }
}

const globalForDb = global as unknown as { db: InMemoryDatabase };
export const db = globalForDb.db || new InMemoryDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
