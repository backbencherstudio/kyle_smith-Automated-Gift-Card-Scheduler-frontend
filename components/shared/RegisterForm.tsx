import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import ButtonReuseable from '../reusable/ButtonReuseable';
import ResuseableModal from '../reusable/ResuseableModal';
import { register as registerUser, googleLogin } from '@/apis/authApis';
import { CustomToast } from '@/lib/Toast/CustomToast';
import OtpVerification from './OtpVerification';
import { useRouter } from 'next/navigation';


export default function RegisterForm({ onLoginClick }: { onLoginClick?: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [userEmail, setUserEmail] = useState<string>('');
    const [expiredAt, setExpiredAt] = useState<number>(5);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<any>();

    const onSubmit = async (data: any) => {
        if (!termsAccepted) {
            CustomToast.show('You must agree to the terms and conditions');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const userData = {
                name: data.fullName,
                email: data.email,
                password: data.password,
                phone_number: data.phone,
                address: data.address
            };

            const response = await registerUser(userData);

            if (response.success) {
                setSuccess(response.message);
                setUserEmail(data.email);
                setExpiredAt(response.data?.expired_at || 5);
                CustomToast.show(response.message);
                setShowOtpForm(true);
                reset();
            } else {
                setError(response.message || 'Registration failed. Please try again.');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleOtpSuccess = (response?: any) => {
        setShowOtpForm(false);
        setUserEmail('');
        setSuccess('');
        CustomToast.show(response?.message || 'Email verified successfully!');
    };

    const handleOtpBack = () => {
        setShowOtpForm(false);
        setUserEmail('');
        setSuccess('');
        setError('');
    };

    const handleLoginClick = () => {
        onLoginClick?.();
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            await googleLogin();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Google login failed. Please try again.';
            setError(errorMessage);
            CustomToast.show(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-center">Create  An Account</h2>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Full Name + Email Side by Side */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Full Name */}
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="Enter Full Name"
                            {...register('fullName', { required: 'Full name is required' })}
                            className="w-full p-3 border border-gray-300 rounded-md bg-[#FAFAFC]"
                            disabled={isLoading}
                        />
                        {errors.fullName && <span className="text-red-500 text-xs">{errors.fullName.message as string}</span>}
                    </div>

                    {/* Email Address */}
                    <div className="flex-1 space-y-2">
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
                </div>

                {/* Address */}
                <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                    <Input
                        id="address"
                        type="text"
                        placeholder="Enter Your Address"
                        {...register('address', { required: 'Address is required' })}
                        className="w-full p-3 border border-gray-300 rounded-md bg-[#FAFAFC]"
                        disabled={isLoading}
                    />
                    {errors.address && <span className="text-red-500 text-xs">{errors.address.message as string}</span>}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input
                        id="phone"
                        type="text"
                        placeholder="Enter Your Phone Number"
                        {...register('phone', { required: 'Phone number is required' })}
                        className="w-full p-3 border border-gray-300 rounded-md bg-[#FAFAFC]"
                        disabled={isLoading}
                    />
                    {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message as string}</span>}
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
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                }
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

                {/* Terms & Conditions */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    {/* Line 1: Checkbox + sentence */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            className="border border-gray-500"
                            checked={termsAccepted}
                            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                            disabled={isLoading}
                        />
                        <Label htmlFor="terms" className="text-sm text-gray-500">
                            I have read and agreed to
                        </Label>
                    </div>

                    {/* Line 2: Terms and Conditions */}
                    <span className="pl-6 sm:pl-0 text-sm text-[#1D1F2C]">
                        Terms and Conditions
                    </span>
                </div>

                {/* Submit Button */}
                <ButtonReuseable
                    title={isLoading ? "Registering..." : "Register"}
                    type="submit"
                    disabled={isLoading || !termsAccepted}
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
                            onClick={handleGoogleLogin}
                            className="flex w-1/2 cursor-pointer md:w-auto justify-center items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                            disabled={isLoading}
                        >
                            <FcGoogle className="text-xl" />
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">Sign in with Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => console.log('Sign up with Facebook')}
                            className="flex w-1/2 cursor-pointer md:w-auto justify-center items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                            disabled={isLoading}
                        >
                            <FaFacebook className="text-blue-600 text-xl" />
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">Sign in with Facebook</span>
                        </button>
                    </div>

                </div>

                {/* Login Link */}
                <div className="text-center">
                    <p className="text-gray-600 text-sm">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={handleLoginClick}
                            className="text-blue-600 cursor-pointer hover:text-blue-700 font-medium"
                            disabled={isLoading}
                        >
                            Login
                        </button>
                    </p>
                </div>
            </form>

            {/* OTP Verification Modal */}
            <ResuseableModal
                isOpen={showOtpForm}
                onClose={handleOtpBack}
                title=""
            >
                <OtpVerification
                    email={userEmail}
                    expiredAt={expiredAt}
                    onSuccess={handleOtpSuccess}
                    onBack={handleOtpBack}
                />
            </ResuseableModal>
        </div>
    );
}
