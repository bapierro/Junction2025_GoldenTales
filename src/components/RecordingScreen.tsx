import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { ConvaiWidget } from './ConvaiWidget';

interface RecordingScreenProps {
  onFinish: (transcript: string, audioBlob?: Blob) => void;
  onCancel: () => void;
}

const SAMPLE_TRANSCRIPT = `I remember it was a beautiful summer day in 1965. I was just 23 years old, and I had just started my first teaching job at the elementary school in my hometown. The children were so eager to learn, and I felt this overwhelming sense of purpose. My mother had always told me that teaching was a noble profession, and standing there in that classroom, I finally understood what she meant. The smell of chalk dust, the sound of children's laughter - these became the soundtrack of my life for the next 40 years. I wouldn't trade those memories for anything in the world.`;

export function RecordingScreen({ onFinish, onCancel }: RecordingScreenProps) {
  const handleFinish = async () => {
    // For now we rely on the Convai widget for the live conversation
    // and fall back to a sample transcript for the story content.
    onFinish(SAMPLE_TRANSCRIPT);
  };

  const handleBack = () => {
    onCancel();
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={handleBack}
          className="p-3 rounded-full hover:bg-white/60 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-7 h-7 text-amber-900" />
        </button>
        <h2 className="flex-1 text-center text-amber-900 -ml-12">Record Your Story</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <p className="text-amber-800/80 text-center mb-6 px-6">
          Use the assistant below to tell your story out loud. When you&apos;re ready, tap finish to
          move on.
        </p>

        <div className="mb-8 w-full flex justify-center">
          <ConvaiWidget />
        </div>

        <Button
          onClick={handleFinish}
          size="lg"
          className="w-full h-16 bg-amber-600 hover:bg-amber-700 text-white shadow-xl"
        >
          Finish with Sample Story
        </Button>
      </div>
    </div>
  );
}

