import { Mic, Headphones, Settings } from 'lucide-react';
import { Button } from './ui/button';

interface WelcomeScreenProps {
  onTellStory: () => void;
  onListenToStories: () => void;
  onOpenSettings: () => void;
}

export function WelcomeScreen({ onTellStory, onListenToStories, onOpenSettings }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col p-6 relative">
      {/* Settings Icon */}
      <div className="absolute top-6 right-6">
        <button
          onClick={onOpenSettings}
          className="p-3 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-7 h-7 text-amber-800" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {/* App Title */}
        <div className="text-center mb-12">
          <h1 className="text-amber-900 mb-3">StoryCircle</h1>
          <p className="text-amber-800/80">
            Share your life's precious moments
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-12 w-48 h-48 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center shadow-lg">
          <div className="w-32 h-32 rounded-full bg-white/40 flex items-center justify-center">
            <Mic className="w-16 h-16 text-amber-900" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-5">
          <Button
            onClick={onTellStory}
            size="lg"
            className="w-full h-20 bg-amber-600 hover:bg-amber-700 text-white shadow-xl"
          >
            <Mic className="w-8 h-8 mr-3" />
            <span>Tell a Story</span>
          </Button>

          <Button
            onClick={onListenToStories}
            size="lg"
            variant="outline"
            className="w-full h-20 bg-white border-2 border-amber-600 text-amber-900 hover:bg-amber-50 shadow-lg"
          >
            <Headphones className="w-8 h-8 mr-3" />
            <span>Listen to Stories</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
