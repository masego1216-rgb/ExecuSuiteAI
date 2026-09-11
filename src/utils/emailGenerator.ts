import type { EmailTone, EmailLength } from '@/types';

interface EmailParams {
  recipient: string;
  subject: string;
  purpose: string;
  tone: EmailTone;
  length: EmailLength;
}

const toneGreetings: Record<EmailTone, string[]> = {
  formal: ['Dear', 'Respected'],
  professional: ['Dear', 'Hello'],
  friendly: ['Hi', 'Hello', 'Hey'],
  persuasive: ['Dear', 'Hello'],
  concise: ['Hi', 'Hello'],
  apologetic: ['Dear', 'I sincerely apologize —'],
};

const toneClosings: Record<EmailTone, string[]> = {
  formal: ['Respectfully,', 'Sincerely yours,'],
  professional: ['Best regards,', 'Kind regards,', 'Best,'],
  friendly: ['Warmly,', 'Cheers,', 'Best,'],
  persuasive: ['Thank you for your consideration,', 'Looking forward to your positive response,'],
  concise: ['Best,', 'Thanks,'],
  apologetic: ['With sincere apologies,', 'Thank you for your understanding,'],
};

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function extractName(emailOrName: string): string {
  if (!emailOrName) return 'there';
  if (emailOrName.includes('@')) {
    const local = emailOrName.split('@')[0];
    return local
      .split(/[._-]/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }
  return emailOrName;
}

function buildBody(purpose: string, tone: EmailTone, length: EmailLength, seed: number): string {
  const lines: string[] = [];

  // Opening context line
  const openers: Record<EmailTone, string[]> = {
    formal: [
      'I hope this message finds you well.',
      'I trust this communication reaches you in good stead.',
    ],
    professional: [
      'I hope you are having a productive week.',
      'Thank you for your time and attention to this matter.',
    ],
    friendly: [
      'Hope you are doing great!',
      'Hope everything is going well on your end.',
    ],
    persuasive: [
      'I wanted to bring something important to your attention.',
      'I believe this is an opportunity worth discussing.',
    ],
    concise: ['', ''],
    apologetic: [
      'Please accept my sincere apologies for the inconvenience caused.',
      'I am truly sorry for any disruption this may have caused.',
    ],
  };

  const opener = pick(openers[tone], seed);
  if (opener) lines.push(opener);
  lines.push('');

  // Main purpose statement
  lines.push(purpose.trim());
  lines.push('');

  if (length === 'short') {
    lines.push('I would appreciate your guidance on how best to proceed.');
  } else if (length === 'medium') {
    lines.push('I would appreciate your guidance on how best to proceed. I am happy to provide any additional context or documentation that may be helpful.');
    lines.push('');
    lines.push('Please let me know if there is a convenient time to discuss this further. I am flexible and can adjust to your schedule.');
  } else {
    lines.push('I would appreciate your guidance on how best to proceed. Below are a few key points for your reference:');
    lines.push('');
    lines.push('  • Context: This aligns with our current priorities and objectives.');
    lines.push('  • Impact: Addressing this promptly will ensure smooth continuity.');
    lines.push('  • Next Steps: I am available to discuss at your earliest convenience.');
    lines.push('');
    lines.push('I am happy to provide any additional context, documentation, or data that may support this request. Please do not hesitate to reach out with any questions or concerns.');
    lines.push('');
    lines.push('I would welcome the opportunity to schedule a brief discussion at a time that works for you. I am flexible and can adjust to your preferred schedule.');
  }

  lines.push('');
  const closing = pick(toneClosings[tone], seed);
  lines.push(closing);

  return lines.join('\n');
}

export function generateEmail(params: EmailParams, seed = Date.now()): { subject: string; body: string } {
  const { recipient, subject, purpose, tone, length } = params;
  const name = extractName(recipient);
  const greeting = pick(toneGreetings[tone], seed);

  const greetingLine = tone === 'apologetic'
    ? `${greeting} ${name},`
    : `${greeting} ${name},`;

  const body = `${greetingLine}\n\n${buildBody(purpose, tone, length, seed)}\n\n[Your Name]\n[Your Title]\n[Your Contact]`;

  // Refine subject
  let finalSubject = subject;
  if (!subject) {
    const purposeWords = purpose.split(' ').slice(0, 6).join(' ');
    finalSubject = purposeWords.charAt(0).toUpperCase() + purposeWords.slice(1);
  }

  return { subject: finalSubject, body };
}

export function regenerateEmail(params: EmailParams): { subject: string; body: string } {
  return generateEmail(params, Date.now() + Math.floor(Math.random() * 100000));
}
