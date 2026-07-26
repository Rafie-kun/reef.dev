'use client';

import { useEffect, useState } from 'react';
import { audio } from '@/lib/audio';
import McIcon from './McIcon';

export default function SoundToggle() {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    audio.init();
    setMuted(audio.isMuted());
  }, []);

  const handleToggle = () => {
    const now = audio.toggleMute();
    setMuted(now);
    audio.play(now ? 'mute-off' : 'mute-on');
  };

  return (
    <button
      onClick={handleToggle}
      className="mc-sound-toggle"
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      title={muted ? 'Unmute' : 'Mute'}
    >
      <McIcon name={muted ? 'mc-sound-off' : 'mc-sound-on'} size={20} />
    </button>
  );
}
