import { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface RecordingScreenProps {
  onFinish: (transcript: string, audioBlob?: Blob) => void;
  onCancel: () => void;
}

type RecordingState = 'idle' | 'recording' | 'paused';

const PROMPTS = [
  "Let's capture a memory. Tell me about a meaningful moment.",
  "Who was there with you?",
  "How old were you then?",
  "What did it feel like?",
  "What happened next?"
];

export function RecordingScreen({ onFinish, onCancel }: RecordingScreenProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(PROMPTS[0]);
  const [showPrompt, setShowPrompt] = useState(true);
  const [waveformData, setWaveformData] = useState<number[]>(new Array(40).fill(0));
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (recordingState === 'recording') {
      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);

      // Simulate waveform animation
      const waveInterval = setInterval(() => {
        setWaveformData(prev => {
          const newData = [...prev];
          newData.shift();
          newData.push(Math.random() * 0.8 + 0.2);
          return newData;
        });
      }, 100);

      // Simulate prompts after silence
      silenceTimerRef.current = setTimeout(() => {
        const nextPromptIndex = Math.floor(Math.random() * (PROMPTS.length - 1)) + 1;
        setCurrentPrompt(PROMPTS[nextPromptIndex]);
        setShowPrompt(true);
      }, 8000);

      return () => {
        clearInterval(waveInterval);
        if (timerRef.current) clearInterval(timerRef.current);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      };
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setWaveformData(new Array(40).fill(0));
    }
  }, [recordingState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecord = () => {
    if (recordingState === 'idle') {
      setRecordingState('recording');
      setShowPrompt(false);
    } else if (recordingState === 'recording') {
      setRecordingState('paused');
    } else {
      setRecordingState('recording');
      setShowPrompt(false);
    }
  };

  const handleFinish = () => {
    const sampleTranscript = `I remember it was a beautiful summer day in 1965. I was just 23 years old, and I had just started my first teaching job at the elementary school in my hometown. The children were so eager to learn, and I felt this overwhelming sense of purpose. My mother had always told me that teaching was a noble profession, and standing there in that classroom, I finally understood what she meant. The smell of chalk dust, the sound of children's laughter - these became the soundtrack of my life for the next 40 years. I wouldn't trade those memories for anything in the world.`;
    
    onFinish(sampleTranscript);
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onCancel}
          className="p-3 rounded-full hover:bg-white/60 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-7 h-7 text-amber-900" />
        </button>
        <h2 className="flex-1 text-center text-amber-900 -ml-12">Record Your Story</h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {/* Timer */}
        <div className="text-amber-900 mb-8 text-center">
          <div className="inline-block px-6 py-3 bg-white/80 rounded-full shadow-md">
            {formatTime(duration)}
          </div>
        </div>

        {/* Waveform */}
        <div className="w-full h-24 mb-8 flex items-center justify-center gap-1 px-4">
          {waveformData.map((height, index) => (
            <div
              key={index}
              className="flex-1 bg-amber-600 rounded-full transition-all duration-100"
              style={{ 
                height: `${height * 100}%`,
                opacity: recordingState === 'recording' ? 1 : 0.3
              }}
            />
          ))}
        </div>

        {/* Guided Prompt */}
        {showPrompt && (
          <div className="mb-8 w-full">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-200">
              <p className="text-amber-900 text-center">
                {currentPrompt}
              </p>
            </div>
          </div>
        )}

        {/* Record Button */}
        <div className="mb-8">
          <button
            onClick={handleRecord}
            className={`w-32 h-32 rounded-full shadow-2xl flex items-center justify-center transition-all ${
              recordingState === 'recording'
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
            aria-label={recordingState === 'recording' ? 'Pause recording' : 'Start recording'}
          >
            {recordingState === 'recording' ? (
              <Square className="w-12 h-12 text-white" fill="white" />
            ) : recordingState === 'paused' ? (
              <Play className="w-12 h-12 text-white" fill="white" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </button>
        </div>

        <p className="text-amber-800/70 text-center mb-8">
          {recordingState === 'idle' && "Tap to start recording"}
          {recordingState === 'recording' && "I'll guide you if you pause"}
          {recordingState === 'paused' && "Tap to continue"}
        </p>

        {/* Finish Button */}
        {(recordingState === 'paused' || duration > 10) && (
          <Button
            onClick={handleFinish}
            size="lg"
            className="w-full h-16 bg-amber-600 hover:bg-amber-700 text-white shadow-xl"
          >
            Finish Story
          </Button>
        )}
      </div>
    </div>
  );
}
