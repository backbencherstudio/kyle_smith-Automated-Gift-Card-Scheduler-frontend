import React, { useState, useRef, useEffect } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import ButtonReuseable from '../reusable/ButtonReuseable'
import { ResetPassword, resendOtp } from '@/apis/authApis'
import { CustomToast } from '@/lib/Toast/CustomToast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

interface ForgotPasswordProps {
    onClose: () => void;
}

export default function ForgotPassword({ onClose }: ForgotPasswordProps) {
    const [email, setEmail] = useState<string>('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResendLoading, setIsResendLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [canResend, setCanResend] = useState(true);
    const [otpSent, setOtpSent] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (otpSent && inputRefs.current[0]) {
            inputRefs.current[0]?.focus();
        }
    }, [otpSent]);

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

    const handleSendOtp = async () => {
        if (!email) {
            CustomToast.show('Please enter your email address');
            return;
        }

        // Email validation
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(email)) {
            CustomToast.show('Please enter a valid email address');
            return;
        }

        setIsResendLoading(true);
        try {
            const response = await resendOtp(email);

            if (response.success) {
                CustomToast.show(response.message || 'OTP sent to your email!');
                setOtpSent(true);
                setTimeLeft(5 * 60); // 5 minutes
                setCanResend(false);
            } else {
                CustomToast.show(response.message || 'Failed to send OTP. Please try again.');
            }
        } catch (error: any) {
            console.error('Send OTP error:', error);
            CustomToast.show(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsResendLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) {
            CustomToast.show(`Please wait ${formatTime(timeLeft)} before resending OTP`);
            return;
        }

        setIsResendLoading(true);
        try {
            const response = await resendOtp(email);

            if (response.success) {
                CustomToast.show(response.message || 'OTP resent successfully!');
                setTimeLeft(5 * 60);
                setCanResend(false);
            } else {
                CustomToast.show(response.message || 'Failed to resend OTP. Please try again.');
            }
        } catch (error: any) {
            console.error('Resend OTP error:', error);
            CustomToast.show(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setIsResendLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            CustomToast.show('Please enter your email address');
            return;
        }

        if (!otpSent) {
            CustomToast.show('Please send OTP first');
            return;
        }

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            CustomToast.show('Please enter 6-digit OTP');
            return;
        }

        if (!newPassword) {
            CustomToast.show('Please enter your new password');
            return;
        }

        if (!confirmPassword) {
            CustomToast.show('Please confirm your password');
            return;
        }

        if (newPassword.length < 6) {
            CustomToast.show('Password must be at least 6 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            CustomToast.show('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const response = await ResetPassword(email, newPassword, otpString);

            if (response.success) {
                CustomToast.show(response.message || 'Password reset successful!');
                onClose();
            } else {
                // Handle nested message structure
                const errorMessage = response.message && typeof response.message === 'object'
                    ? (response.message as any).message || 'Failed to reset password. Please try again.'
                    : response.message || 'Failed to reset password. Please try again.';
                CustomToast.show(errorMessage);
            }
        } catch (error: any) {
            console.error('Password reset error:', error);
            // Handle nested error message structure
            const errorMessage = error.response?.data?.message?.message
                || error.response?.data?.message
                || 'Failed to reset password. Please try again.';
            CustomToast.show(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">Reset Password</h2>
                <p className="text-gray-600">
                    Enter your email, OTP, and new password to reset your account password.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Address */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <div className="flex gap-2">
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-md bg-[#FAFAFC]"
                            disabled={isLoading || isResendLoading}
                        />
                        <ButtonReuseable
                            title={isResendLoading ? "Sending..." : otpSent ? "Resend" : "Send OTP"}
                            type="button"
                            onClick={otpSent ? handleResendOtp : handleSendOtp}
                            disabled={isLoading || isResendLoading || (!canResend && otpSent)}
                            className="bg-[#FAD33E] border border-[#FAD33E] hover:bg-white transform duration-300 px-4 py-2 text-sm cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        />
                    </div>
                    {otpSent && !canResend && (
                        <p className="text-xs text-gray-500">
                            Resend OTP in{' '}
                            <span className="font-mono font-semibold text-red-500">
                                {formatTime(timeLeft)}
                            </span>
                        </p>
                    )}
                </div>

                {/* OTP Input Fields */}
                {otpSent && (
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Enter OTP Code</Label>
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
                )}

                {/* New Password */}
                <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md bg-[#FAFAFC]"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            disabled={isLoading}
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md bg-[#FAFAFC]"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            disabled={isLoading}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <ButtonReuseable
                    title={isLoading ? "Resetting..." : "Reset Password"}
                    type="submit"
                    disabled={isLoading || !otpSent || otp.join('').length !== 6}
                    className="bg-[#FAD33E] w-full border border-[#FAD33E] hover:bg-white transform duration-300 px-7 py-2 text-md cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </form>
        </div>
    );
}
