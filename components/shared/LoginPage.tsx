import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import ButtonReuseable from '../reusable/ButtonReuseable';
import ResuseableModal from '../reusable/ResuseableModal';
import OtpVerification from './OtpVerification';
import { login } from '@/apis/authApis';
import { CustomToast } from '@/lib/Toast/CustomToast';
import { useRouter } from 'next/navigation';
import ForgotPassword from './ForgotPassword';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState<string>('');
    const [expiredAt, setExpiredAt] = useState<number>(5);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const router = useRouter();
    const { login: authLogin } = useAuth();
    
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<any>();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setError('');

        try {
            const credentials = {
                email: data.email,
                password: data.password
            };

            const response = await login(credentials);

            if (response.success) {
                await authLogin(response.authorization.token, response.type);
                CustomToast.show(response.message || 'Login successful!');
                setTimeout(() => {
                    if (response.type === 'user') {
                        router.push('/user-dashboard');
                    } else if (response.type === 'admin') {
                        router.push('/admin/dashboard');
                    } else {
                        router.push('/user-dashboard');
                    }
                }, 200);

            } else {
                // Handle nested message structure
                const errorMessage = response.message && typeof response.message === 'object' 
                    ? (response.message as any).message || 'Login failed. Please try again.'
                    : response.message || 'Login failed. Please try again.';
                setError(errorMessage);
            }
        } catch (error: any) {
            if (error.response?.data?.message?.code === 'EMAIL_NOT_VERIFIED') {
                const email = error.response.data.message.email;
                setUnverifiedEmail(email);
                setExpiredAt(5);
                setShowOtpModal(true);
                CustomToast.show(error.response.data.message.message || 'Please verify your email first.');
            } else {
                // Handle nested error message structure
                const errorMessage = error.response?.data?.message?.message 
                    || error.response?.data?.message 
                    || 'Something went wrong. Please try again.';
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegisterClick = () => {
        setIsRegisterModalOpen(true);
        router.push('?register=true');
    };

    const handleOtpSuccess = (response?: any) => {
        setShowOtpModal(false);
        setUnverifiedEmail('');
        CustomToast.show(response?.message || 'Email verified successfully! You can now login.');
    };

    const handleOtpBack = () => {
        setShowOtpModal(false);
        setUnverifiedEmail('');
    };

    return (
        <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-center">Login</h2>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Address */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter Email Address"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                message: 'Enter a valid email address'
                            }
                        })}
                        className="w-full p-3 border border-gray-300 rounded-md bg-[#FAFAFC]"
                        disabled={isLoading}
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email.message as string}</span>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            {...register('password', {
                                required: 'Password is required'
                            })}
                            className="w-full p-3 border border-gray-300 rounded-md bg-[#FAFAFC]"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            disabled={isLoading}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.password && <span className="text-red-500 text-xs">{errors.password.message as string}</span>}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setShowForgotPasswordModal(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                        disabled={isLoading}
                    >
                        Forgot Password?
                    </button>
                </div>

                {/* Submit Button */}
                <ButtonReuseable
                    title={isLoading ? "Logging in..." : "Login"}
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#FAD33E] w-full border border-[#FAD33E] hover:bg-white transform duration-300 px-7 py-2 text-md cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                />

                {/* Divider and Social Buttons */}
                <div className="text-center mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-grow h-px bg-gray-300" />
                        <span className="px-3 text-gray-500 text-sm">Or</span>
                        <div className="flex-grow h-px bg-gray-300" />
                    </div>

                    <div className="flex justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => console.log('Login with Google')}
                            className="flex w-1/2 md:w-auto justify-center items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition cursor-pointer"
                            disabled={isLoading}
                        >
                            <FcGoogle className="text-xl" />
                            <span className="text-sm  font-medium text-gray-700 hidden sm:block">Login with Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => console.log('Login with Facebook')}
                            className="flex w-1/2 cursor-pointer md:w-auto justify-center items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                            disabled={isLoading}
                        >
                            <FaFacebook className="text-blue-600 text-xl" />
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">Login with Facebook</span>
                        </button>
                    </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                    <p className="text-gray-600 text-sm">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={handleRegisterClick}
                            className="text-blue-600 cursor-pointer hover:text-blue-700 font-medium"
                            disabled={isLoading}
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </form>

            {/* OTP Verification Modal */}
            <ResuseableModal
                isOpen={showOtpModal}
                onClose={handleOtpBack}
                title=""
            >
                <OtpVerification
                    email={unverifiedEmail}
                    expiredAt={expiredAt}
                    onSuccess={handleOtpSuccess}
                    onBack={handleOtpBack}
                    isLoginVerification={true}
                />
            </ResuseableModal>

            {/* Forgot Password Modal */}
            <ResuseableModal
                isOpen={showForgotPasswordModal}
                onClose={() => setShowForgotPasswordModal(false)}
                title="Forgot Password"
            >
                <ForgotPassword onClose={() => setShowForgotPasswordModal(false)} />
            </ResuseableModal>
        </div>
    );
}
