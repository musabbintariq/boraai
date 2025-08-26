import { useEffect, useRef } from 'react';

interface ElevenLabsWidgetProps {
  agentId: string;
}

export const ElevenLabsWidget = ({ agentId }: ElevenLabsWidgetProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const loadScript = async () => {
      // Check if script is already loaded
      if (scriptLoadedRef.current || document.querySelector('script[src*="elevenlabs/convai-widget-embed"]')) {
        renderWidget();
        return;
      }

      try {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
        script.async = true;
        script.type = 'text/javascript';
        
        script.onload = () => {
          console.log('ElevenLabs script loaded successfully');
          scriptLoadedRef.current = true;
          renderWidget();
        };

        script.onerror = (error) => {
          console.error('Failed to load ElevenLabs script:', error);
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading ElevenLabs script:', error);
      }
    };

    const renderWidget = () => {
      if (widgetRef.current) {
        // Clear existing content
        widgetRef.current.innerHTML = '';
        
        // Create the custom element
        const widget = document.createElement('elevenlabs-convai');
        widget.setAttribute('agent-id', agentId);
        
        // Append to container
        widgetRef.current.appendChild(widget);
        
        console.log('ElevenLabs widget rendered with agent ID:', agentId);
      }
    };

    loadScript();

    return () => {
      // Cleanup if needed
      if (widgetRef.current) {
        widgetRef.current.innerHTML = '';
      }
    };
  }, [agentId]);

  return (
    <div className="elevenlabs-widget-container">
      <div ref={widgetRef} />
    </div>
  );
};