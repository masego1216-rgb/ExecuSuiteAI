import type { Task, TaskPriority } from '@/types';
import { uid, todayISO } from './helpers';

interface PlanParams {
  goal: string;
  date: string;
  priorities: string[];
  availableHours: number;
}

export function planTasks(params: PlanParams): Task[] {
  const { goal, date, priorities, availableHours } = params;
  const tasks: Task[] = [];

  // Parse the goal and create tasks
  const goalTasks = parseGoalIntoTasks(goal, date);
  tasks.push(...goalTasks);

  // Add priority-based tasks
  for (const priority of priorities) {
    const priorityTasks = createPriorityTasks(priority, date);
    tasks.push(...priorityTasks);
  }

  // Add routine tasks based on available hours
  if (availableHours >= 4) {
    tasks.push(createTask('Review and respond to important emails', date, 'medium', '09:00', 'Communication'));
    tasks.push(createTask('Quick team check-in or standup', date, 'medium', '10:00', 'Meeting'));
  }
  if (availableHours >= 6) {
    tasks.push(createTask('Focused deep-work session on priority project', date, 'high', '14:00', 'Deep Work'));
  }
  if (availableHours >= 8) {
    tasks.push(createTask('End-of-day review and tomorrow preparation', date, 'low', '17:00', 'Planning'));
  }

  // Sort by time
  tasks.sort((a, b) => a.dueTime.localeCompare(b.dueTime));

  return tasks;
}

function parseGoalIntoTasks(goal: string, date: string): Task[] {
  const tasks: Task[] = [];
  const sentences = goal.split(/[;,.]/).map((s) => s.trim()).filter((s) => s.length > 5);

  if (sentences.length <= 1) {
    // Single goal — break into phases
    tasks.push(createTask(`Prepare for: ${goal}`, date, 'high', '09:00', 'Planning', true));
    tasks.push(createTask(`Execute: ${goal}`, date, 'high', '11:00', 'Execution', true));
    tasks.push(createTask(`Review and follow up: ${goal}`, date, 'medium', '15:00', 'Review', true));
  } else {
    sentences.slice(0, 4).forEach((sentence, idx) => {
      const times = ['09:00', '11:00', '13:00', '15:00'];
      const priorityMap: TaskPriority[] = ['high', 'medium', 'medium', 'low'];
      tasks.push(createTask(sentence, date, priorityMap[idx] || 'low', times[idx] || '16:00', 'AI Planned', true));
    });
  }

  return tasks;
}

function createPriorityTasks(priority: string, date: string): Task[] {
  const priorityMap: Record<string, { title: string; time: string; category: string; priority: TaskPriority }> = {
    emails: { title: 'Clear inbox and respond to pending emails', time: '09:30', category: 'Communication', priority: 'medium' },
    meetings: { title: 'Prepare for scheduled meetings', time: '10:30', category: 'Meeting', priority: 'medium' },
    'deep work': { title: 'Dedicated deep-work block — no interruptions', time: '14:00', category: 'Deep Work', priority: 'high' },
    'project work': { title: 'Advance current project milestones', time: '13:00', category: 'Project', priority: 'high' },
    admin: { title: 'Handle administrative tasks and documentation', time: '16:00', category: 'Admin', priority: 'low' },
    review: { title: 'Review progress and plan next steps', time: '17:00', category: 'Review', priority: 'medium' },
  };

  const match = priorityMap[priority.toLowerCase()];
  if (match) {
    return [createTask(match.title, date, match.priority, match.time, match.category, true)];
  }
  return [];
}

function createTask(
  title: string,
  date: string,
  priority: TaskPriority,
  time: string,
  category: string,
  aiSuggested = false
): Task {
  return {
    id: uid('task'),
    title,
    description: '',
    priority,
    status: 'todo',
    dueDate: date,
    dueTime: time,
    category,
    aiSuggested,
    createdAt: new Date().toISOString(),
  };
}

export function getSmartSuggestions(existingTasks: Task[]): string[] {
  const suggestions: string[] = [];
  const highPriorityCount = existingTasks.filter((t) => t.priority === 'high' || t.priority === 'urgent').length;
  const hasDeepWork = existingTasks.some((t) => t.category === 'Deep Work');

  if (highPriorityCount > 3) {
    suggestions.push('You have many high-priority tasks today. Consider deferring non-critical items to tomorrow.');
  }
  if (!hasDeepWork) {
    suggestions.push('Consider adding a dedicated deep-work block for focused, uninterrupted work.');
  }
  if (existingTasks.length > 8) {
    suggestions.push('Your day looks full. Make sure to schedule short breaks between tasks.');
  } else if (existingTasks.length < 3) {
    suggestions.push('Your schedule has room. Consider tackling a stretch goal or learning task.');
  }

  suggestions.push('Tip: Group similar tasks together (all emails at once, all meetings in a block) for better focus.');

  return suggestions;
}
