export type UserRole = 'employer' | 'candidate';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  companyName?: string;
  companyWebsite?: string;
  companyLogo?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  resumeUrl?: string;
  resumeFileName?: string;
  createdAt: string;
}

export type JobType = 'Full-time' | 'Part-time' | 'Remote' | 'Contract' | 'Internship';
export type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Lead / Executive';

export interface Job {
  id: string;
  employerId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  department: string;
  category: string;
  location: string;
  isRemote: boolean;
  type: JobType;
  experienceLevel: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  perks: string[];
  tags: string[];
  status: 'active' | 'closed' | 'draft';
  applicantCount: number;
  featured?: boolean;
  urgent?: boolean;
  createdAt: string;
}

export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Interviewing' | 'Accepted' | 'Rejected';

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  candidateHeadline?: string;
  coverLetter?: string;
  resumeFileName: string;
  resumeFileBase64?: string;
  portfolioUrl?: string;
  expectedSalary?: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  jobTitle?: string;
  companyName?: string;
}

export interface NotificationLog {
  id: string;
  toEmail: string;
  toName: string;
  subject: string;
  type: 'application_submitted' | 'status_updated' | 'job_posted' | 'welcome';
  previewText: string;
  bodyHtml: string;
  sentAt: string;
}
