import nodemailer from 'nodemailer';
import { env } from '../config.js';

const transport = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
});

export async function sendMail({ to, subject, text }) {
  return transport.sendMail({ from: env.SMTP_FROM, to, subject, text });
}

export async function verifyMailer() {
  return transport.verify();
}
