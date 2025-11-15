import { useEffect } from 'react';
import { env } from '../lib/env';

export function ConvaiWidget() {
  useEffect(() => {
    const scriptId = 'elevenlabs-convai-widget-script';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);
  }, []);

  if (!env.elevenLabsAgentId) {
    return (
      <p className="text-amber-800/80 text-center">
        Set VITE_ELEVENLABS_AGENT_ID to enable the guided assistant.
      </p>
    );
  }

  return (
    <div className="inline-flex">
      <elevenlabs-convai agent-id={env.elevenLabsAgentId}></elevenlabs-convai>
    </div>
  );
}

