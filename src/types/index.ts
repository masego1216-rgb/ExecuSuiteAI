export type PageId =
  | 'dashboard'
  | 'execumail'
  | 'execurizer'
  | 'execuplanner'
  | 'upcoming'
  | 'completed'
  | 'settings'
  | 'help';

export type EmailTone = 'formal' | 'professional' | 'friendly' | 'persuasive' | 'concise' | 'apologetic';
export type EmailLength = 'short' | 'medium' | 'detailed';

export interface GeneratedEmail {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  tone: EmailTone;
  length: EmailLength;
  purpose: string;
  createdAt: string;
}

export type ScheduledEmailStatus = 'scheduled' | 'sent' | 'cancelled';

export interface ScheduledEmail {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  date: string;
  time: string;
  timezone: string;
  reminder: string;
  status: ScheduledEmailStatus;
  createdAt: string;
}

export interface TranscriptSegment {
  id: string;
  text: string;
  timestamp: string;
  speaker: string;
}

export interface MeetingSummary {
  id: string;
  title: string;
  date: string;
  duration: string;
  transcript: TranscriptSegment[];
  summary: string;
  keyPoints: string[];
  actionItems: MeetingActionItem[];
  participants: string[];
  createdAt: string;
}

export interface MeetingActionItem {
  id: string;
  text: string;
  assignee: string;
  deadline: string;
  done: boolean;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  dueTime: string;
  category: string;
  aiSuggested: boolean;
  createdAt: string;
}

export type ActivityCategory = 'email' | 'meeting' | 'task' | 'deadline' | 'reminder';
export type ActivityStatus = 'scheduled' | 'pending' | 'completed' | 'due-soon';

export interface UpcomingActivity {
  id: string;
  title: string;
  date: string;
  time: string;
  category: ActivityCategory;
  status: ActivityStatus;
  detail?: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
