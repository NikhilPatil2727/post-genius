'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';

import { requestJson } from '@/lib/api-client';

export function UserOnboardingSync() {
  const { isLoaded, isSignedIn } = useUser();
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || startedRef.current) {
      return;
    }

    startedRef.current = true;

    requestJson('/api/user/onboard', {
      method: 'POST',
    }).catch((error) => {
      console.error('Background onboarding failed:', error);
    });
  }, [isLoaded, isSignedIn]);

  return null;
}
