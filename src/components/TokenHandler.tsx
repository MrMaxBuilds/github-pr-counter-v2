'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function TokenHandler() {
  useEffect(() => {
    const supabase = createClient();
  
    const handleTokens = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      console.log('initial session', session);
      if (session?.provider_token) {
        window.localStorage.setItem('oauth_provider_token', session.provider_token);
      }

      if (session?.provider_refresh_token) {
        window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token);
      }
    };

    handleTokens();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('session changed', session);
      if (session?.provider_token) {
        window.localStorage.setItem('oauth_provider_token', session.provider_token);
      }
    
      if (session?.provider_refresh_token) {
        window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token);
      }
    
      if (event === 'SIGNED_OUT') {
        window.localStorage.removeItem('oauth_provider_token');
        window.localStorage.removeItem('oauth_provider_refresh_token');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // This component doesn't render anything visible
  return null;
} 