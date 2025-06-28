import React, { useState, useRef, useEffect } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import ButtonReuseable from '../reusable/ButtonReuseable'
import { CustomToast } from '@/lib/Toast/CustomToast'
import { otpVerification, resendOtp } from '@/apis/authApis'

interface OtpVerificationProps {
    email: string;
    expiredAt: number;
    onSuccess: (response?: any) => void;
    onBack: () => void;
    isLoginVerification?: boolean;
    isForgotPasswordVerification?: boolean;
}

export default function OtpVerification({ email, expiredAt, onSuccess,  isLoginVerification = false, isForgotPasswordVerification = false }: OtpVerificationProps) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(expiredAt * 60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const hasAutoResent = useRef(false);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0]?.focus();
        }
    }, []);

    useEffect(() => {
        if (isLoginVerification && !isForgotPasswordVerification && email && !hasAutoResent.current) {
            hasAutoResent.current = true;
            handleAutoResendOtp();
        }
    }, [isLoginVerification, isForgotPasswordVerification, email]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOtpChange = (index: number, value: string) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
        if (/^\d{6}$/.test(pastedData)) {
            const newOtp = [...otp];
            for (let i = 0; i < 6; i++) {
                newOtp[i] = pastedData[i] || '';
            }
            setOtp(newOtp);
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            CustomToast.show('Please enter 6-digit OTP');
            return;
        }

        setIsLoading(true);
        try {
            const response = await otpVerification(email, otpString);

            if (response.success) {
                // Only show toast if not login verification (for register flow)
                if (!isLoginVerification) {
                    CustomToast.show(response.message || 'OTP verified successfully!');
                }
                onSuccess({ ...response, otpCode: otpString });
            } else {
                CustomToast.show(response.message || 'Invalid OTP. Please try again.');
            }
        } catch (error: any) {
            console.error('OTP verification error:', error);
            CustomToast.show(error.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) {
            CustomToast.show(`Please wait ${formatTime(timeLeft)} before resending OTP`);
            return;
        }

        setIsLoading(true);
        try {
            const response = await resendOtp(email);

            if (response.success) {
                CustomToast.show(response.message || 'OTP resent successfully!');
                setTimeLeft(expiredAt * 60);
                setCanResend(false);
            } else {
                CustomToast.show(response.message || 'Failed to resend OTP. Please try again.');
            }
        } catch (error: any) {
            console.error('Resend OTP error:', error);
            CustomToast.show(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-resend OTP function
    const handleAutoResendOtp = async () => {
        setIsLoading(true);
        try {
            const response = await resendOtp(email);

            if (response.success) {
                // Don't show toast for forgot password verification to avoid duplicate messages
                if (!isForgotPasswordVerification) {
                    CustomToast.show(response.message || 'OTP sent successfully!');
                }
                setTimeLeft(expiredAt * 60);
                setCanResend(false);
            } else {
                CustomToast.show(response.message || 'Failed to send OTP. Please try again.');
            }
        } catch (error: any) {
            console.error('Auto resend OTP error:', error);
            CustomToast.show(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">Verify Your Email</h2>
                <p className="text-gray-600">
                    We've sent a 6-digit verification code to{' '}
                    <span className="font-medium text-gray-900">{email}</span>
                </p>
            </div>

            {/* OTP Input Fields */}
            <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700 text-center block">Enter OTP Code</Label>
                <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                        <Input
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            disabled={isLoading}
                        />
                    ))}
                </div>
            </div>

            {/* OTP Verification Buttons */}
            <div className="space-y-3">
                <ButtonReuseable
                    title={isLoading ? "Verifying..." : "Verify OTP"}
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || otp.join('').length !== 6}
                    className="w-full bg-[#FAD33E] cursor-pointer hover:bg-[#FAD33E]/80 text-black font-semibold py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <div className="text-center">
                    <p className="text-gray-600 text-sm">
                        Didn't receive the code?{' '}
                        {canResend ? (
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isLoading}
                                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <span className="text-gray-500">
                                Resend OTP in{' '}
                                <span className="font-mono font-semibold text-red-500">
                                    {formatTime(timeLeft)}
                                </span>
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
