import { BookOpen, Headphones, Speech } from "lucide-react";
import { motion } from "motion/react";
import logo from "../../junction25.png";
import { AIAssistant } from "./AIAssistant";

interface WelcomeScreenProps {
  onTellStory: () => void;
  onListenToStories: () => void;
  onMyStories: () => void;
  onOpenSettings: () => void;
  isFirstBoot: boolean;
  hasAccount: boolean;
  onCreateAccount: () => void;
  onSkipAccount: () => void;
}

export function WelcomeScreen({
  onTellStory,
  onListenToStories,
  onMyStories,
  onOpenSettings,
  isFirstBoot,
  hasAccount,
  onCreateAccount,
  onSkipAccount,
}: WelcomeScreenProps) {
  const handleTellStory = () => {
    onTellStory();
  };

  return (
    <div className="min-h-screen flex flex-col p-6 relative bg-white">
      <div className="absolute bottom-6 right-6 z-10">
        <button
          onClick={onOpenSettings}
          className="px-5 py-3 rounded-full bg-white shadow-[0_6px_16px_rgba(209,137,52,0.2)] transition-colors border border-[#f1c89a]"
          aria-label="My Personal Information"
        >
          <span className="text-[#6E3410] tracking-[0.05em] text-sm font-semibold">
            MY PERSONAL INFORMATION
          </span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="flex flex-col items-center mb-10">
          <img
            src={logo}
            alt="GoldenTales"
            className="object-contain"
            style={{ width: "18rem", height: "18rem" }}
          />
        </div>

        <AIAssistant
          isFirstBoot={isFirstBoot}
          hasAccount={hasAccount}
          onCreateAccount={onCreateAccount}
          onSkipAccount={onSkipAccount}
          onStartStory={handleTellStory}
          onListenToStories={onListenToStories}
        />

        <motion.div
          className="w-full space-y-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            type="button"
            onClick={handleTellStory}
            className="w-full flex items-center justify-center gap-4 text-white text-2xl font-extrabold tracking-[0.12em] uppercase"
            style={{
              background:
                "linear-gradient(110deg, #FDB54A 0%, #FB8D1A 58%, #E25F02 100%)",
              height: "96px",
              borderRadius: "28px",
              boxShadow: "0px 26px 40px rgba(213, 111, 34, 0.45)",
            }}
          >
            <Speech className="w-9 h-9" />
            <span>TELL ME A STORY</span>
          </button>

          <button
            type="button"
            onClick={onListenToStories}
            className="w-full flex items-center justify-center gap-4 text-[#6E3410] text-2xl font-extrabold tracking-[0.1em]"
            style={{
              height: "96px",
              borderRadius: "28px",
              border: "4px solid #F5A93C",
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 18px 32px rgba(203, 140, 67, 0.2)",
            }}
          >
            <Headphones className="w-9 h-9" />
            <span>LISTEN TO STORIES</span>
          </button>

          <button
            type="button"
            onClick={onMyStories}
            className="w-full flex items-center justify-center gap-4 text-[#6E3410] text-2xl font-extrabold tracking-[0.1em]"
            style={{
              height: "96px",
              borderRadius: "28px",
              border: "4px solid #F5A93C",
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 18px 32px rgba(203, 140, 67, 0.2)",
            }}
          >
            <BookOpen className="w-9 h-9" />
            <span>MY STORIES</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
