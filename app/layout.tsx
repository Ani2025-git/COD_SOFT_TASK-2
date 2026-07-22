import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EmailModal from '@/components/EmailModal';

export const metadata: Metadata = {
  title: 'JobConnect | Modern Full-Stack Tech Job Board',
  description: 'Connect with top engineering, design, and product opportunities. Employers post job openings, candidate applicants track applications and upload resumes.',
  keywords: ['Job Board', 'React Jobs', 'Node.js Jobs', 'Software Engineer Jobs', 'Tech Careers', 'Vercel'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <EmailModal />
        </AuthProvider>
      </body>
    </html>
  );
}
