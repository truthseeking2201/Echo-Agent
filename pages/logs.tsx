import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { useEffect } from 'react';

/**
 * Logs page that redirects to the new signals page
 * Proper redirect handling to prevent ENOENT errors during server-side rendering
 */
const LogsPage: NextPage = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the signals page
    router.replace('/signals');
  }, [router]);
  
  // Return a minimal loading state while redirecting
  return (
    <div className="min-h-screen bg-bg-900 flex items-center justify-center">
      <div className="text-primary font-display text-2xl animate-pulse">
        Echo<span className="text-accent">.</span>
      </div>
    </div>
  );
};

export default LogsPage;