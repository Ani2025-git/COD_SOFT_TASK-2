import { db } from './db';
import { NotificationLog } from './types';

export function sendApplicationSubmittedEmail(
  candidateEmail: string,
  candidateName: string,
  jobTitle: string,
  companyName: string
): NotificationLog {
  const subject = `Application Received: ${jobTitle} at ${companyName}`;
  const previewText = `We received your application for ${jobTitle}.`;
  const bodyHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #059669;">Application Successfully Submitted 🎉</h2>
      <p>Hi <strong>${candidateName}</strong>,</p>
      <p>Thank you for applying for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> through JobConnect.</p>
      <p>Your application and resume have been forwarded directly to the hiring manager. You will receive email notifications as soon as there are updates to your status.</p>
      <div style="margin: 20px 0; background-color: #f3f4f6; padding: 15px; border-radius: 6px;">
        <p style="margin: 0; font-size: 14px; color: #4b5563;">Track progress live from your candidate dashboard at any time.</p>
      </div>
      <p style="color: #6b7280; font-size: 12px;">JobConnect Notifications &bull; Next.js Job Portal System</p>
    </div>
  `;

  return db.addNotification({
    toEmail: candidateEmail,
    toName: candidateName,
    subject,
    type: 'application_submitted',
    previewText,
    bodyHtml,
  });
}

export function sendStatusUpdatedEmail(
  candidateEmail: string,
  candidateName: string,
  jobTitle: string,
  companyName: string,
  newStatus: string,
  employerNotes?: string
): NotificationLog {
  const subject = `Status Update: ${jobTitle} at ${companyName}`;
  const previewText = `Your application status has been updated to "${newStatus}".`;
  const bodyHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #0284c7;">Application Status Update 📌</h2>
      <p>Hi <strong>${candidateName}</strong>,</p>
      <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated to:</p>
      <div style="display: inline-block; padding: 8px 16px; background-color: #dbeafe; color: #1e40af; font-weight: bold; border-radius: 20px; margin: 10px 0;">
        ${newStatus}
      </div>
      ${employerNotes ? `<div style="margin-top: 15px; padding: 12px; background-color: #f8fafc; border-left: 4px solid #0284c7; color: #334155;"><p style="margin: 0;"><strong>Note from Employer:</strong> ${employerNotes}</p></div>` : ''}
      <p style="margin-top: 20px;">Please check your Candidate Dashboard for complete details.</p>
      <p style="color: #6b7280; font-size: 12px;">JobConnect Platform Notifications</p>
    </div>
  `;

  return db.addNotification({
    toEmail: candidateEmail,
    toName: candidateName,
    subject,
    type: 'status_updated',
    previewText,
    bodyHtml,
  });
}

export function sendJobPostedEmail(
  employerEmail: string,
  employerName: string,
  jobTitle: string
): NotificationLog {
  const subject = `Job Published: ${jobTitle}`;
  const previewText = `Your job opening for ${jobTitle} is now live on JobConnect.`;
  const bodyHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #10b981;">Your Job is Live! 🚀</h2>
      <p>Hi <strong>${employerName}</strong>,</p>
      <p>Your job posting <strong>${jobTitle}</strong> has been published and is now accepting candidate applications.</p>
      <p>You can manage applications, view candidate resumes, and update recruitment pipeline statuses directly from your Employer Dashboard.</p>
    </div>
  `;

  return db.addNotification({
    toEmail: employerEmail,
    toName: employerName,
    subject,
    type: 'job_posted',
    previewText,
    bodyHtml,
  });
}
