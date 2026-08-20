import nodemailer from 'nodemailer';
import { env } from './env.ts';

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass || !env.smtp.to) {
    return null; // SMTP non configuré : on se contente du stockage en base.
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port ?? 587,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user, pass: env.smtp.pass },
    });
  }
  return transporter;
}

interface ContactPayload {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

export async function sendContactNotification(data: ContactPayload) {
  const t = getTransporter();
  if (!t) return; // Pas de config SMTP -> pas d'envoi, ce n'est pas une erreur.

  await t.sendMail({
    from: `"Portfolio - Formulaire de contact" <${env.smtp.user}>`,
    to: env.smtp.to,
    replyTo: data.email,
    subject: `[Portfolio] ${data.sujet} — ${data.nom}`,
    text: `De : ${data.nom} <${data.email}>\nSujet : ${data.sujet}\n\n${data.message}`,
  });
}
