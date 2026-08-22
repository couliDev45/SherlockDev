import { env } from './env.ts';

// Échappe les caractères spéciaux du mode Markdown de Telegram pour éviter
// qu'un message contenant des caractères comme _ * [ ] ne casse le format.
function escapeMarkdown(text: string): string {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

async function sendTelegramMessage(text: string): Promise<void> {
  const { botToken, chatId } = env.telegram;
  if (!botToken || !chatId) return; // Non configuré : on ne fait rien, silencieusement.

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[telegram] Échec envoi notification :', res.status, body);
  }
}

interface ContactPayload {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

export async function notifyNewContactMessage(data: ContactPayload): Promise<void> {
  const text = [
    '📬 *Nouveau message de contact*',
    '',
    `*Nom :* ${escapeMarkdown(data.nom)}`,
    `*Email :* ${escapeMarkdown(data.email)}`,
    `*Sujet :* ${escapeMarkdown(data.sujet)}`,
    '',
    escapeMarkdown(data.message),
  ].join('\n');

  await sendTelegramMessage(text);
}

export async function notifyServerError(context: {
  method: string;
  path: string;
  message: string;
}): Promise<void> {
  const text = [
    '🐛 *Erreur serveur sur le portfolio*',
    '',
    `*Route :* ${escapeMarkdown(`${context.method} ${context.path}`)}`,
    `*Erreur :* ${escapeMarkdown(context.message)}`,
  ].join('\n');

  await sendTelegramMessage(text);
}

export async function notifyFailedAdminLogin(ip: string): Promise<void> {
  const text = [
    '🔒 *Tentative de connexion admin échouée*',
    '',
    `*IP :* ${escapeMarkdown(ip)}`,
  ].join('\n');

  await sendTelegramMessage(text);
}
