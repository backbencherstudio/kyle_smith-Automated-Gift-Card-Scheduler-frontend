import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import ButtonReuseable from '../reusable/ButtonReuseable'
import ResuseableModal from '../reusable/ResuseableModal'
import { forgotPassword, ResetPassword } from '@/apis/authApis'
import { CustomToast } from '@/lib/Toast/CustomToast'
import OtpVerification from './OtpVerification'

interface ForgotPasswordProps {
    onClose: () => void;
}

export default function ForgotPassword({ onClose }: ForgotPasswordProps) {
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>('');
    const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpExpiredAt, setOtpExpiredAt] = useState<number>(5);
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false);
    const [token, setToken] = useState<string>('');
    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!forgotPasswordEmail) {
            CustomToast.show('Please enter your email address');
            return;
        }

        // Email validation
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(forgotPasswordEmail)) {
            CustomToast.show('Please enter a valid email address');
            return;
        }

        setIsForgotPasswordLoading(true);
        try {
            const response = await forgotPassword(forgotPasswordEmail);

            if (response.success) {
                CustomToast.show(response.message || 'OTP sent to your email for verification!');
                setOtpExpiredAt(response.data?.expired_at || 5);
                setShowOtpModal(true);
                setShowPasswordResetModal(false);
            } else {
                CustomToast.show(response.message || 'Failed to send password reset email. Please try again.');
            }
        } catch (error: any) {
            console.error('Forgot password error:', error);
            CustomToast.show(error.response?.data?.message || 'Failed to send password reset email. Please try again.');
        } finally {
            setIsForgotPasswordLoading(false);
        }
    };

    const handleOtpSuccess = (response?: any) => {
        setShowOtpModal(false);
        setShowPasswordResetModal(true);
        if (response?.otpCode) {
            setToken(response.otpCode);
        }
        else if (response?.data?.token) {
            setToken(response.data.token);
        }

        CustomToast.show(response?.message || 'OTP verified successfully! You can now reset your password.');
    };

    const handleOtpBack = () => {
        setShowOtpModal(false);
        setForgotPasswordEmail('');
        setToken('');
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();

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

        setIsPasswordResetLoading(true);
        try {
            const response = await ResetPassword(forgotPasswordEmail, newPassword, token);

            if (response.success) {
                CustomToast.show(response.message || 'Password reset successful!');
                setShowPasswordResetModal(false);
                onClose();
            } else {
                CustomToast.show(response.message || 'Failed to reset password. Please try again.');
            }
        } catch (error: any) {
            console.error('Password reset error:', error);
            CustomToast.show(error.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsPasswordResetLoading(false);
        }
    };

    const handlePasswordResetClose = () => {
        setShowPasswordResetModal(false);
        setNewPassword('');
        setConfirmPassword('');
        setToken('');
        onClose();
    };

    return (
        <div>
            <div className="space-y-4">
                <p className="text-gray-700 text-sm">
                    Enter your email address to receive a password reset link.
                </p>
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="forgotPasswordEmail" className="text-sm font-medium">Email Address</Label>
                        <Input
                            id="forgotPasswordEmail"
                            type="email"
                            placeholder="Enter Email Address"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md bg-[#FAFAFC]"
                            disabled={isForgotPasswordLoading}
                        />
                    </div>
                    <ButtonReuseable
                        title={isForgotPasswordLoading ? "Sending..." : "Send Reset Link"}
                        type="submit"
                        disabled={isForgotPasswordLoading}
                        className="bg-[#FAD33E] w-full border border-[#FAD33E] hover:bg-white transform duration-300 px-7 py-2 text-md cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </form>
            </div>

            {/* OTP Verification Modal */}
            <ResuseableModal
                isOpen={showOtpModal}
                onClose={handleOtpBack}
                title=""
            >
                <OtpVerification
                    email={forgotPasswordEmail}
                    expiredAt={otpExpiredAt}
                    onSuccess={handleOtpSuccess}
                    onBack={handleOtpBack}
                    isLoginVerification={true}
                    isForgotPasswordVerification={true}
                />
            </ResuseableModal>

            {/* Password Reset Modal */}
            <ResuseableModal
                isOpen={showPasswordResetModal}
                onClose={handlePasswordResetClose}
                title="Reset Password"
            >
                <div className="space-y-4">
                    <p className="text-gray-700 text-sm">
                        Enter your new password to reset.
                    </p>
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-sm font-medium">Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md bg-[#FAFAFC]"
                                    disabled={isPasswordResetLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    disabled={isPasswordResetLoading}
                                >
                                    {showNewPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
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
                                    disabled={isPasswordResetLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    disabled={isPasswordResetLoading}
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                        <ButtonReuseable
                            title={isPasswordResetLoading ? "Resetting..." : "Reset Password"}
                            type="submit"
                            disabled={isPasswordResetLoading}
                            className="bg-[#FAD33E] w-full border border-[#FAD33E] hover:bg-white transform duration-300 px-7 py-2 text-md cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </form>
                </div>
            </ResuseableModal>
        </div>
    )
}
