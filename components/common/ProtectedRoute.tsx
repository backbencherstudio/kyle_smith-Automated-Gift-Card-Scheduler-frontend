"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { CustomToast } from "@/lib/Toast/CustomToast";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, userType, isAuthenticated, isLoading } = useAuth();
  const hasShownToast = useRef(false);
  const isInitialLoad = useRef(true);
  const isLoggingOut = useRef(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Check if user is logging out (no token in localStorage)
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');

    if (!token && !storedUserType) {
      // User is logging out, don't show toast
      isLoggingOut.current = true;
      router.push('/?login=true');
      return;
    }

    if (isInitialLoad.current && isAuthenticated && userType === 'user') {
      isInitialLoad.current = false;
      return;
    }

    if (token && storedUserType === 'user' && !isAuthenticated) {
      // User has token but auth state is not set, wait a bit more
      return;
    }

    // Only show toast if not authenticated, haven't shown it yet, and not logging out
    if (!isAuthenticated && !hasShownToast.current && !isLoggingOut.current) {
      hasShownToast.current = true;
      CustomToast.show('Please login to access this page');
      router.push('/?login=true');
      return;
    }

    // Only show toast if user type is not 'user' and haven't shown it yet
    if (isAuthenticated && userType !== 'user' && !hasShownToast.current) {
      hasShownToast.current = true;
      CustomToast.show('Access denied. User account required.');
      router.push('/?login=true');
      return;
    }

    // Reset flags when user becomes properly authenticated
    if (isAuthenticated && userType === 'user') {
      hasShownToast.current = false;
      isInitialLoad.current = false;
      isLoggingOut.current = false;
    }
  }, [isAuthenticated, userType, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FAD33E]"></div>
      </div>
    );
  }

  // Check if user has token but auth state is still loading
  const token = localStorage.getItem('token');
  const storedUserType = localStorage.getItem('userType');
  
  if (token && storedUserType === 'user' && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FAD33E]"></div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'user') {
    return null;
  }

  return <>{children}</>;
} 