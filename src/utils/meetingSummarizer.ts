import type { TranscriptSegment, MeetingSummary, MeetingActionItem } from '@/types';
import { uid } from './helpers';

export function summarizeMeeting(
  transcript: TranscriptSegment[],
  title: string,
  duration: string
): MeetingSummary {
  const fullText = transcript.map((s) => s.text).join(' ');
  const participants = extractParticipants(transcript);
  const keyPoints = extractKeyPoints(fullText);
  const actionItems = extractActionItems(fullText, transcript);
  const summary = buildSummary(fullText, keyPoints, actionItems, duration);

  return {
    id: uid('meeting'),
    title: title || 'Untitled Meeting',
    date: new Date().toISOString(),
    duration,
    transcript,
    summary,
    keyPoints,
    actionItems,
    participants,
    createdAt: new Date().toISOString(),
  };
}

function extractParticipants(transcript: TranscriptSegment[]): string[] {
  const speakers = new Set<string>();
  transcript.forEach((s) => {
    if (s.speaker && s.speaker !== 'Unknown') speakers.add(s.speaker);
  });
  return Array.from(speakers);
}

function extractKeyPoints(text: string): string[] {
  const points: string[] = [];

  // Look for common meeting patterns
  const patterns = [
    /(?:we (?:need to|should|will|must)|let's|I think we should)\s+([^.]*)/gi,
    /(?:decided|agreed|concluded)\s+(?:that\s+)?([^.]*)/gi,
    /(?:important|key|critical|priority)\s+(?:is\s+)?([^.]*)/gi,
    /(?:the goal|our objective|the target)\s+(?:is\s+)?([^.]*)/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null && points.length < 5) {
      const point = match[1]?.trim();
      if (point && point.length > 5) {
        points.push(point.charAt(0).toUpperCase() + point.slice(1));
      }
    }
  }

  // If not enough points, create general ones from the transcript
  if (points.length < 2) {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 15);
    const seen = new Set<string>();
    for (const s of sentences) {
      const trimmed = s.trim();
      if (trimmed.length > 15 && !seen.has(trimmed.toLowerCase()) && points.length < 4) {
        seen.add(trimmed.toLowerCase());
        points.push(trimmed.charAt(0).toUpperCase() + trimmed.slice(1) + '.');
      }
    }
  }

  return points.slice(0, 5);
}

function extractActionItems(text: string, transcript: TranscriptSegment[]): MeetingActionItem[] {
  const items: MeetingActionItem[] = [];
  const actionPatterns = [
    /(\w+)\s+(?:will|should|needs to|is going to|is responsible for)\s+([^.]*)/gi,
    /(?:action item|follow up|next step)[:\s]+([^.]*)/gi,
    /(\w+)\s+(?:to complete|to finish|to deliver|to send|to prepare|to review)\s+([^.]*)/gi,
    /(?:by|before)\s+(\w+day|next week|tomorrow|end of (?:day|week|month))/gi,
  ];

  const seen = new Set<string>();

  // Pattern 1: "X will/should/needs to Y"
  let match;
  while ((match = actionPatterns[0].exec(text)) !== null && items.length < 6) {
    const assignee = match[1]?.trim();
    const taskText = match[2]?.trim();
    if (assignee && taskText && taskText.length > 3) {
      const key = taskText.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        items.push({
          id: uid('action'),
          text: taskText.charAt(0).toUpperCase() + taskText.slice(1),
          assignee: assignee.charAt(0).toUpperCase() + assignee.slice(1),
          deadline: extractDeadline(text, taskText),
          done: false,
        });
      }
    }
  }

  // Pattern 2: "action item: X" or "follow up: X"
  while ((match = actionPatterns[1].exec(text)) !== null && items.length < 6) {
    const taskText = match[1]?.trim();
    if (taskText && taskText.length > 3) {
      const key = taskText.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        items.push({
          id: uid('action'),
          text: taskText.charAt(0).toUpperCase() + taskText.slice(1),
          assignee: 'Unassigned',
          deadline: 'This week',
          done: false,
        });
      }
    }
  }

  // Fallback: if no action items found, create from sentences with future-oriented verbs
  if (items.length === 0) {
    const sentences = text.split(/[.!?]+/).filter((s) =>
      /will|should|need to|going to|plan to|must|schedule|send|prepare|review|complete|follow up/i.test(s)
    );
    for (const s of sentences) {
      const trimmed = s.trim();
      if (trimmed.length > 10 && items.length < 3) {
        items.push({
          id: uid('action'),
          text: trimmed,
          assignee: 'Team',
          deadline: 'This week',
          done: false,
        });
      }
    }
  }

  return items;
}

function extractDeadline(text: string, context: string): string {
  const deadlineMatch = text.match(/by\s+(\w+day|next week|tomorrow|end of (?:day|week|month)|Friday|Monday|Tuesday|Wednesday|Thursday)/i);
  if (deadlineMatch) return deadlineMatch[1];
  return 'This week';
}

function buildSummary(
  text: string,
  keyPoints: string[],
  actionItems: MeetingActionItem[],
  duration: string
): string {
  const participantCount = actionItems.length > 0 ? new Set(actionItems.map((a) => a.assignee)).size : 2;

  let summary = `This ${duration} meeting covered several important topics. `;

  if (keyPoints.length > 0) {
    summary += `The discussion focused on ${keyPoints[0].toLowerCase()}`;
    if (keyPoints.length > 1) {
      summary += `, along with ${keyPoints.slice(1, 3).map((p) => p.toLowerCase()).join(' and ')}`;
    }
    summary += '. ';
  }

  if (actionItems.length > 0) {
    summary += `${actionItems.length} action item${actionItems.length > 1 ? 's were' : ' was'} identified, `;
    summary += `with ${new Set(actionItems.map((a) => a.assignee)).size} team member${new Set(actionItems.map((a) => a.assignee)).size > 1 ? 's' : ''} assigned to follow up. `;
  }

  summary += 'The meeting concluded with clear next steps and a shared understanding of priorities.';

  return summary;
}
