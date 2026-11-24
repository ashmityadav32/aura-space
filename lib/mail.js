import nodemailer from 'nodemailer';
// Sends via SMTP when SMTP_HOST is set; otherwise prints the email to the terminal (handy for demos).
export async function sendMail({ to, subject, text }) {
  if (!process.env.SMTP_HOST) { console.log(`\n[MAIL - SMTP not configured]\nTo: ${to}\nSubject: ${subject}\n${text}\n`); return false; }
  const t = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: +process.env.SMTP_PORT || 587, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  await t.sendMail({ from: process.env.MAIL_FROM || 'Aura Space <no-reply@aura.com>', to, subject, text }); return true;
}
