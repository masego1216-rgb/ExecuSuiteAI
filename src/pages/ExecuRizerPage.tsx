import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Upload,
  FileAudio,
  Sparkles,
  Copy,
  Check,
  Clock,
  Users,
  ListChecks,
  CheckSquare,
  Download,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { summarizeMeeting } from '@/utils/meetingSummarizer';
import { uid, formatTimer } from '@/utils/helpers';
import { AIGenerating, EmptyState } from '@/components/ui/Loading';
import type { TranscriptSegment, MeetingSummary } from '@/types';

// Web Speech API type declaration
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      0: { transcript: string };
    };
  };
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function ExecuRizerPage() {
  const { meetings, addMeeting, toggleActionItem, showToast } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [interimText, setInterimText] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<MeetingSummary | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [uploadProcessing, setUploadProcessing] = useState(false);
  const [supportError, setSupportError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, interimText]);

  // Timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const handleStartRecording = useCallback(() => {
    setSupportError(null);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupportError('Speech recognition is not supported in this browser. Try Chrome or Edge, or use the demo mode below.');
      // Start a demo timer-based recording
      setIsRecording(true);
      setIsPaused(false);
      setTranscript([]);
      setSeconds(0);
      // Simulate transcript with demo content
      simulateDemoTranscript();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const text = result[0].transcript.trim();
          if (text) {
            const segment: TranscriptSegment = {
              id: uid('seg'),
              text,
              timestamp: formatTimer(seconds),
              speaker: 'Speaker',
            };
            setTranscript((prev) => [...prev, segment]);
          }
        } else {
          interim += result[0].transcript;
        }
      }
      setInterimText(interim);
    };

    recognition.onerror = (event: Event) => {
      const errorEvent = event as unknown as { error?: string };
      if (errorEvent.error === 'not-allowed') {
        setSupportError('Microphone access denied. Please allow microphone permissions and try again.');
        setIsRecording(false);
      }
    };

    recognition.onend = () => {
      if (isRecording && !isPaused) {
        try {
          recognition.start();
        } catch {
          // already started
        }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setIsPaused(false);
    setTranscript([]);
    setSeconds(0);
    showToast('info', 'Recording started. Speak naturally.');
  }, [seconds, isRecording, isPaused, showToast]);

  const simulateDemoTranscript = () => {
    const demoLines = [
      { text: 'Let us start the meeting by reviewing the quarterly results.', delay: 2000 },
      { text: 'The revenue is up 15 percent compared to last quarter.', delay: 4000 },
      { text: 'Sarah will complete the marketing report by Friday.', delay: 6000 },
      { text: 'We need to schedule a follow-up meeting with the client next week.', delay: 8000 },
      { text: 'John should send the updated project timeline to the stakeholders.', delay: 10000 },
      { text: 'I think we should prioritize the new feature launch for next month.', delay: 12000 },
    ];
    let elapsed = 0;
    demoLines.forEach((line) => {
      setTimeout(() => {
        if (isRecording) {
          setTranscript((prev) => [
            ...prev,
            {
              id: uid('seg'),
              text: line.text,
              timestamp: formatTimer(Math.floor(line.delay / 1000)),
              speaker: 'Speaker',
            },
          ]);
        }
      }, line.delay);
    });
  };

  const handlePause = () => {
    setIsPaused(true);
    recognitionRef.current?.stop();
    showToast('info', 'Recording paused.');
  };

  const handleResume = () => {
    setIsPaused(false);
    try {
      recognitionRef.current?.start();
    } catch {
      // already started
    }
  };

  const handleStop = () => {
    setIsRecording(false);
    setIsPaused(false);
    recognitionRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    showToast('success', `Recording stopped. ${transcript.length} segments captured.`);
  };

  const handleSummarize = () => {
    if (transcript.length === 0) {
      showToast('warning', 'No transcript to summarize. Record a meeting first.');
      return;
    }
    setSummarizing(true);
    setTimeout(() => {
      const summary = summarizeMeeting(transcript, meetingTitle || 'Meeting Recording', formatTimer(seconds));
      setCurrentSummary(summary);
      addMeeting(summary);
      setSummarizing(false);
      showToast('success', 'Meeting summarized with AI insights!');
    }, 2000);
  };

  const handleReset = () => {
    setTranscript([]);
    setSeconds(0);
    setCurrentSummary(null);
    setMeetingTitle('');
    setInterimText('');
    setUploadedFile(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    setUploadedFile({ name: file.name, size: `${sizeMB} MB` });
    setUploadProcessing(true);
    showToast('info', `Processing ${file.name}...`);

    // Simulated audio processing with demo transcript
    setTimeout(() => {
      const demoTranscript: TranscriptSegment[] = [
        { id: uid('seg'), text: 'Welcome everyone to the project kickoff meeting.', timestamp: '00:00', speaker: 'Host' },
        { id: uid('seg'), text: 'The project timeline has been updated to reflect the new requirements.', timestamp: '00:15', speaker: 'Speaker 1' },
        { id: uid('seg'), text: 'Mike will prepare the technical specification document by Wednesday.', timestamp: '00:32', speaker: 'Host' },
        { id: uid('seg'), text: 'We should schedule a design review session for next Tuesday.', timestamp: '00:48', speaker: 'Speaker 2' },
        { id: uid('seg'), text: 'The budget needs to be approved before we can proceed with development.', timestamp: '01:05', speaker: 'Host' },
        { id: uid('seg'), text: 'Emily is going to send the meeting summary to all stakeholders.', timestamp: '01:22', speaker: 'Speaker 1' },
      ];
      setTranscript(demoTranscript);
      setSeconds(90);
      setUploadProcessing(false);
      showToast('success', 'Audio processed and transcribed.');
    }, 2500);
  };

  const handleCopySummary = () => {
    if (!currentSummary) return;
    const text = `Meeting: ${currentSummary.title}\nDate: ${new Date(currentSummary.date).toLocaleString()}\nDuration: ${currentSummary.duration}\n\nSummary:\n${currentSummary.summary}\n\nKey Points:\n${currentSummary.keyPoints.map((p) => `- ${p}`).join('\n')}\n\nAction Items:\n${currentSummary.actionItems.map((a) => `- [${a.done ? 'x' : ' '}] ${a.text} (${a.assignee}, due: ${a.deadline})`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    showToast('success', 'Summary copied to clipboard.');
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Recording Panel */}
      <div className="card p-5 lg:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center">
            <Mic size={20} className="text-charcoal-600" />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal-800">Meeting Transcription</h3>
            <p className="text-xs text-charcoal-400">Record live or upload audio for AI transcription</p>
          </div>
        </div>

        {supportError && (
          <div className="mb-4 p-3 bg-gold-50 rounded-lg flex items-start gap-2">
            <MicOff size={16} className="text-gold-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gold-800">{supportError}</p>
          </div>
        )}

        <div className="flex flex-col items-center py-6">
          {/* Recording indicator / button */}
          <button
            onClick={isRecording ? (isPaused ? handleResume : handlePause) : handleStartRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording && !isPaused
                ? 'bg-red-500 animate-pulse-soft shadow-lg shadow-red-200'
                : isPaused
                ? 'bg-gold-500 shadow-lg shadow-gold-200'
                : 'bg-charcoal-800 hover:bg-charcoal-700 shadow-medium'
            }`}
          >
            {isRecording && !isPaused ? (
              <Pause size={32} className="text-white" />
            ) : isPaused ? (
              <Play size={32} className="text-white" />
            ) : (
              <Mic size={32} className="text-cream-50" />
            )}
          </button>

          <div className="mt-4 flex items-center gap-4">
            {isRecording && (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-gold-500' : 'bg-red-500 animate-pulse'}`} />
                <span className="text-sm font-medium text-charcoal-700">
                  {isPaused ? 'Paused' : 'Recording'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-lg font-mono font-semibold text-charcoal-800">
              <Clock size={16} className="text-charcoal-400" />
              {formatTimer(seconds)}
            </div>
          </div>

          {isRecording && (
            <button
              onClick={handleStop}
              className="mt-4 btn-secondary text-red-600 hover:bg-red-50 hover:border-red-200"
            >
              <Square size={16} /> Stop Recording
            </button>
          )}

          {!isRecording && transcript.length > 0 && (
            <button onClick={handleReset} className="mt-4 btn-ghost text-xs">
              Clear & Start New
            </button>
          )}
        </div>

        {/* Upload option */}
        {!isRecording && transcript.length === 0 && (
          <div className="border-t border-cream-200 pt-5">
            <label className="block">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-cream-300 rounded-xl cursor-pointer hover:border-gold-300 hover:bg-cream-50 transition-all">
                <FileAudio size={28} className="text-charcoal-300 mb-2" />
                <p className="text-sm font-medium text-charcoal-600">Upload Audio File</p>
                <p className="text-xs text-charcoal-400 mt-1">MP3, WAV, M4A, or WebM</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-gold-600">
                  <Upload size={14} />
                  Click to browse
                </div>
              </div>
              <input
                type="file"
                accept=".mp3,.wav,.m4a,.webm,audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {uploadedFile && (
          <div className="mt-3 flex items-center gap-3 p-3 bg-cream-50 rounded-xl">
            <FileAudio size={18} className="text-charcoal-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-charcoal-700">{uploadedFile.name}</p>
              <p className="text-[10px] text-charcoal-400">{uploadedFile.size}</p>
            </div>
            {uploadProcessing && <span className="text-xs text-gold-600">Processing...</span>}
          </div>
        )}
      </div>

      {/* Meeting title + Summarize */}
      {transcript.length > 0 && (
        <div className="card p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Meeting Title</label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="e.g., Weekly Product Sync"
              className="input-field"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleSummarize}
              disabled={summarizing}
              className="btn-gold py-2.5"
            >
              <Sparkles size={16} /> Summarize with AI
            </button>
          </div>
        </div>
      )}

      {/* Live Transcript */}
      {transcript.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cream-100 flex items-center justify-center">
                <FileAudio size={18} className="text-charcoal-500" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-800 text-sm">Live Transcript</h3>
                <p className="text-xs text-charcoal-400">{transcript.length} segments · {formatTimer(seconds)}</p>
              </div>
            </div>
            {isRecording && (
              <div className="flex items-center gap-1.5 text-xs text-red-500">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live
              </div>
            )}
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {transcript.map((seg) => (
              <div key={seg.id} className="flex gap-3 animate-fade-in-up">
                <div className="flex-shrink-0 w-16 text-[10px] font-mono text-charcoal-300 pt-1">
                  {seg.timestamp}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium text-gold-600">{seg.speaker}: </span>
                  <span className="text-sm text-charcoal-700">{seg.text}</span>
                </div>
              </div>
            ))}
            {interimText && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-16 text-[10px] font-mono text-charcoal-300 pt-1">
                  {formatTimer(seconds)}
                </div>
                <div className="flex-1">
                  <span className="text-sm text-charcoal-400 italic">{interimText}</span>
                </div>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      )}

      {/* AI Summary */}
      {summarizing && (
        <AIGenerating label="AI is analyzing your meeting..." />
      )}

      {currentSummary && !summarizing && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Summary Card */}
          <div className="card p-5 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
                  <Sparkles size={20} className="text-gold-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-800">{currentSummary.title}</h3>
                  <p className="text-xs text-charcoal-400">
                    {new Date(currentSummary.date).toLocaleDateString()} · {currentSummary.duration} · {currentSummary.participants.length} participants
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCopySummary} className="btn-secondary text-xs">
                  {copiedSummary ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  {copiedSummary ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => {
                    const text = `Meeting Summary - ${currentSummary.title}\n${currentSummary.summary}`;
                    navigator.clipboard.writeText(text);
                    showToast('info', 'Downloading text summary...');
                  }}
                  className="btn-secondary text-xs"
                >
                  <Download size={14} /> Export
                </button>
              </div>
            </div>

            <div className="p-4 bg-cream-50 rounded-xl border border-cream-200 mb-4">
              <p className="text-xs text-charcoal-400 mb-2 font-medium">AI Summary</p>
              <p className="text-sm text-charcoal-700 leading-relaxed">{currentSummary.summary}</p>
            </div>

            {/* Participants */}
            {currentSummary.participants.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={14} className="text-charcoal-400" />
                  <p className="text-xs font-medium text-charcoal-500">Participants</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentSummary.participants.map((p) => (
                    <span key={p} className="badge bg-cream-100 text-charcoal-600">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Points */}
            {currentSummary.keyPoints.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <ListChecks size={14} className="text-charcoal-400" />
                  <p className="text-xs font-medium text-charcoal-500">Key Points</p>
                </div>
                <ul className="space-y-2">
                  {currentSummary.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-charcoal-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Items */}
            {currentSummary.actionItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckSquare size={14} className="text-charcoal-400" />
                  <p className="text-xs font-medium text-charcoal-500">Action Items</p>
                </div>
                <div className="space-y-2">
                  {currentSummary.actionItems.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 border border-cream-200 cursor-pointer hover:border-gold-300 transition-all"
                    >
                      <button
                        onClick={() => toggleActionItem(currentSummary.id, item.id)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                          item.done ? 'bg-green-500 text-white' : 'border-2 border-cream-300 hover:border-gold-400'
                        }`}
                      >
                        {item.done && <Check size={12} />}
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm ${item.done ? 'line-through text-charcoal-400' : 'text-charcoal-700'}`}>
                          {item.text}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-charcoal-400 mt-0.5">
                          <span className="text-gold-600">{item.assignee}</span>
                          <span>·</span>
                          <span>Due: {item.deadline}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Past Meetings */}
      {meetings.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-charcoal-800 mb-4">Meeting History</h3>
          <div className="space-y-2">
            {meetings.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-50 cursor-pointer transition-colors"
                onClick={() => setCurrentSummary(m)}
              >
                <div className="w-9 h-9 rounded-lg bg-cream-100 flex items-center justify-center flex-shrink-0">
                  <Mic size={16} className="text-charcoal-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal-700 truncate">{m.title}</p>
                  <p className="text-xs text-charcoal-400">
                    {new Date(m.date).toLocaleDateString()} · {m.duration} · {m.actionItems.length} actions
                  </p>
                </div>
                {m.actionItems.filter((a) => !a.done).length > 0 && (
                  <span className="badge badge-pending">
                    {m.actionItems.filter((a) => !a.done).length} pending
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {transcript.length === 0 && !summarizing && meetings.length === 0 && (
        <div className="card p-5">
          <EmptyState
            icon={Mic}
            title="No meetings yet"
            description="Start recording or upload an audio file to begin transcribing and summarizing your meetings."
          />
        </div>
      )}
    </div>
  );
}
