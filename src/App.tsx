import { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RecordingScreen } from './components/RecordingScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { ShareConfirmationScreen } from './components/ShareConfirmationScreen';
import { StoryWallScreen } from './components/StoryWallScreen';
import { StoryDetailScreen } from './components/StoryDetailScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { Toaster } from './components/ui/sonner';

export type Screen = 
  | 'welcome'
  | 'recording'
  | 'review'
  | 'share-confirmation'
  | 'story-wall'
  | 'story-detail'
  | 'settings';

export interface Story {
  id: string;
  title: string;
  transcript: string;
  ageRange: string;
  city: string;
  tags: string[];
  isAnonymous: boolean;
  reactions: {
    moved: number;
    thankYou: number;
    favorite: number;
  };
  audioUrl?: string;
  createdAt: Date;
}

export interface UserSettings {
  defaultAnonymous: boolean;
  ageRange: string;
  city: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [currentStory, setCurrentStory] = useState<Partial<Story> | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    defaultAnonymous: false,
    ageRange: '',
    city: ''
  });

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleStartRecording = () => {
    setCurrentStory(null);
    navigateTo('recording');
  };

  const handleFinishRecording = (transcript: string, audioBlob?: Blob) => {
    setCurrentStory({
      transcript,
      title: 'My Story',
      audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined
    });
    navigateTo('review');
  };

  const handleSaveStory = (story: Partial<Story>, shareType: 'private' | 'link' | 'public') => {
    const finalStory: Story = {
      id: Date.now().toString(),
      title: story.title || 'Untitled Story',
      transcript: story.transcript || '',
      ageRange: userSettings.ageRange,
      city: userSettings.city,
      tags: story.tags || [],
      isAnonymous: userSettings.defaultAnonymous,
      reactions: { moved: 0, thankYou: 0, favorite: 0 },
      audioUrl: story.audioUrl,
      createdAt: new Date()
    };

    if (shareType === 'public' || shareType === 'link') {
      navigateTo('share-confirmation');
    } else {
      navigateTo('welcome');
    }
  };

  const handleViewStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    navigateTo('story-detail');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onTellStory={handleStartRecording}
            onListenToStories={() => navigateTo('story-wall')}
            onOpenSettings={() => navigateTo('settings')}
          />
        );
      case 'recording':
        return (
          <RecordingScreen
            onFinish={handleFinishRecording}
            onCancel={() => navigateTo('welcome')}
          />
        );
      case 'review':
        return (
          <ReviewScreen
            story={currentStory}
            onSave={handleSaveStory}
            onCancel={() => navigateTo('welcome')}
            onUpdateStory={setCurrentStory}
          />
        );
      case 'share-confirmation':
        return (
          <ShareConfirmationScreen
            onGoToStoryWall={() => navigateTo('story-wall')}
            onBackToHome={() => navigateTo('welcome')}
          />
        );
      case 'story-wall':
        return (
          <StoryWallScreen
            onViewStory={handleViewStory}
            onBack={() => navigateTo('welcome')}
          />
        );
      case 'story-detail':
        return (
          <StoryDetailScreen
            storyId={selectedStoryId}
            onBack={() => navigateTo('story-wall')}
            onListenToSimilar={(id) => handleViewStory(id)}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            settings={userSettings}
            onSave={(settings) => {
              setUserSettings(settings);
              navigateTo('welcome');
            }}
            onCancel={() => navigateTo('welcome')}
          />
        );
      default:
        return <WelcomeScreen onTellStory={handleStartRecording} onListenToStories={() => navigateTo('story-wall')} onOpenSettings={() => navigateTo('settings')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {renderScreen()}
      <Toaster />
    </div>
  );
}
