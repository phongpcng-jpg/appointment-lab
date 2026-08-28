import nodemailer from 'nodemailer';
import { config } from '../config.js';

function createTransport() {
  if (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASSWORD || !config.SMTP_FROM) {
    throw new Error('SMTP configuration is incomplete');
  }

  return nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_PORT === 465,
    auth: { user: config.SMTP_USER, pass: config.SMTP_PASSWORD }
  });
}

export async function sendMail({ to, subject, text }) {
  return createTransport().sendMail({ from: config.SMTP_FROM, to, subject, text });
}

export async function verifyMailer() {
  return createTransport().verify();
}
