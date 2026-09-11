import type { ActivityStatus, ScheduledEmailStatus, TaskPriority, TaskStatus } from '@/types';

export function StatusBadge({ status }: { status: ActivityStatus | ScheduledEmailStatus }) {
  const map: Record<string, { className: string; label: string }> = {
    scheduled: { className: 'badge-scheduled', label: 'Scheduled' },
    pending: { className: 'badge-pending', label: 'Pending' },
    completed: { className: 'badge-completed', label: 'Completed' },
    'due-soon': { className: 'badge-due', label: 'Due Soon' },
    sent: { className: 'badge-sent', label: 'Sent' },
    cancelled: { className: 'badge-cancelled', label: 'Cancelled' },
  };
  const { className, label } = map[status] || map.pending;
  return <span className={`badge ${className}`}>{label}</span>;
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const map: Record<TaskPriority, string> = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-50 text-blue-700',
    high: 'bg-orange-50 text-orange-700',
    urgent: 'bg-red-50 text-red-600',
  };
  return <span className={`badge ${map[priority]}`}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>;
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, string> = {
    todo: 'bg-gray-100 text-gray-600',
    'in-progress': 'bg-blue-50 text-blue-700',
    completed: 'bg-green-50 text-green-700',
  };
  const labels: Record<TaskStatus, string> = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    completed: 'Completed',
  };
  return <span className={`badge ${map[status]}`}>{labels[status]}</span>;
}
