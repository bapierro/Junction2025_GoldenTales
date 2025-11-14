import { useState } from 'react';
import { ArrowLeft, Play, Pause, Share2, Lock, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import type { Story } from '../App';

interface ReviewScreenProps {
  story: Partial<Story> | null;
  onSave: (story: Partial<Story>, shareType: 'private' | 'link' | 'public') => void;
  onCancel: () => void;
  onUpdateStory: (story: Partial<Story>) => void;
}

const AVAILABLE_TAGS = ['Childhood', 'Love', 'Work', 'Migration', 'Family', 'Adventure', 'Wisdom'];

export function ReviewScreen({ story, onSave, onCancel, onUpdateStory }: ReviewScreenProps) {
  const [title, setTitle] = useState(story?.title || 'My Story');
  const [transcript, setTranscript] = useState(story?.transcript || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(story?.tags || []);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = (shareType: 'private' | 'link' | 'public') => {
    const updatedStory: Partial<Story> = {
      ...story,
      title,
      transcript,
      tags: selectedTags
    };
    onSave(updatedStory, shareType);
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={onCancel}
          className="p-3 rounded-full hover:bg-white/60 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-7 h-7 text-amber-900" />
        </button>
        <h2 className="flex-1 text-center text-amber-900 -ml-12">Review Your Story</h2>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-md mx-auto w-full space-y-6 pb-6">
        {/* Title Input */}
        <div>
          <label className="block text-amber-900 mb-2">Story Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-14 bg-white border-2 border-amber-200 focus:border-amber-600"
            placeholder="Give your story a title"
          />
        </div>

        {/* Audio Player */}
        <div className="bg-white rounded-xl p-5 shadow-md border-2 border-amber-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center shadow-md transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" fill="white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" fill="white" />
              )}
            </button>
            <div className="flex-1">
              <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 transition-all"
                  style={{ width: isPlaying ? '45%' : '0%' }}
                />
              </div>
              <p className="text-amber-800/70 mt-2">Listen to your recording</p>
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div>
          <label className="block text-amber-900 mb-2">Your Story</label>
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="min-h-[200px] bg-white border-2 border-amber-200 focus:border-amber-600 resize-none"
            placeholder="Your story transcript will appear here..."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-amber-900 mb-3">Add Tags (Optional)</label>
          <div className="flex flex-wrap gap-3">
            {AVAILABLE_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-5 py-3 rounded-full transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white text-amber-900 border-2 border-amber-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Sharing Options */}
        <div className="pt-4 space-y-3">
          <p className="text-amber-900">How would you like to share?</p>
          
          <Button
            onClick={() => handleSave('private')}
            size="lg"
            variant="outline"
            className="w-full h-16 bg-white border-2 border-amber-300 text-amber-900 hover:bg-amber-50"
          >
            <Lock className="w-6 h-6 mr-3" />
            <span>Save as Private</span>
          </Button>

          <Button
            onClick={() => handleSave('link')}
            size="lg"
            variant="outline"
            className="w-full h-16 bg-white border-2 border-amber-300 text-amber-900 hover:bg-amber-50"
          >
            <Share2 className="w-6 h-6 mr-3" />
            <span>Share via Link</span>
          </Button>

          <Button
            onClick={() => handleSave('public')}
            size="lg"
            className="w-full h-16 bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
          >
            <Globe className="w-6 h-6 mr-3" />
            <span>Publish Anonymously</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
