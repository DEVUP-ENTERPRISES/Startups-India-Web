'use client';

import { useEffect, useState } from 'react';

export default function AgentationProvider() {
  const [Agentation, setAgentation] = useState(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('agentation')
        .then((mod) => {
          setAgentation(() => mod.Agentation);
        })
        .catch((err) => {
          console.error('Failed to load Agentation component:', err);
        });
    }
  }, []);

  if (process.env.NODE_ENV !== 'development' || !Agentation) {
    return null;
  }

  return (
    <Agentation
      endpoint="http://localhost:4747"
      onSessionCreated={(sessionId) => {
        console.log('Agentation session started:', sessionId);
      }}
    />
  );
}
