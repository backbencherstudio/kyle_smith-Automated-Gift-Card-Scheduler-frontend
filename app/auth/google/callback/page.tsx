'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleGoogleRedirect } from '@/apis/authApis';
import { CustomToast } from '@/lib/Toast/CustomToast';
import { useAuth } from '@/contexts/AuthContext';
import Loader from '@/components/reusable/Loader';

export default function GoogleCallbackPage() {
    const [error, setError] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login: authLogin } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            // Fast return if no params
            const token = searchParams.get('token') || searchParams.get('access_token') || searchParams.get('auth_token');
            const type = searchParams.get('type') || searchParams.get('user_type') || 'user';
            const code = searchParams.get('code');
            const errorParam = searchParams.get('error');

            if (!token && !code && !errorParam) {
                router.replace('/');
                return;
            }

            try {
                if (errorParam) {
                    setError('Google authentication failed. Please try again.');
                    CustomToast.show('Google authentication failed. Please try again.');
                    setTimeout(() => router.replace('/'), 500);
                    return;
                }

                if (token) {
                    // Prevent double-processing
                    const processedToken = localStorage.getItem('google_processed_token');
                    if (processedToken === token) {
                        router.replace('/');
                        return;
                    }
                    localStorage.setItem('google_processed_token', token);

                    await handleGoogleRedirect(token, type);
                    await authLogin(token, type);
                    CustomToast.show('Google login successful!');

                    // Redirect based on user type
                    setTimeout(() => {
                        if (type === 'admin') {
                            router.replace('/admin/dashboard');
                        } else {
                            router.replace('/user-dashboard');
                        }
                    }, 300);
                    return;
                }

                setError('No authentication data received from Google.');
                CustomToast.show('No authentication data received from Google.');
                setTimeout(() => router.replace('/'), 500);
            } catch (err) {
                setError('Google authentication failed. Please try again.');
                CustomToast.show('Google authentication failed. Please try again.');
                setTimeout(() => router.replace('/'), 500);
            } finally {
                setIsProcessing(false);
            }
        };
        handleCallback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    useEffect(() => {
        return () => {
            localStorage.removeItem('google_processed_code');
            localStorage.removeItem('google_processed_token');
        };
    }, []);

    if (isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader />
                    <p className="mt-4 text-gray-600">Processing Google authentication...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md max-w-md">
                        <h2 className="text-lg font-semibold mb-2">Authentication Error</h2>
                        <p>{error}</p>
                        <p className="mt-2 text-sm">Redirecting to login page...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Loader />
                <p className="mt-4 text-gray-600">Redirecting...</p>
            </div>
        </div>
    );
} 