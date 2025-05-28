import React from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import ButtonReuseable from '../reusable/ButtonReuseable';

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (data: any) => {
        console.log('Form Data: ', data);
    };

    return (
        <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-center">Log In</h2>

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
                    />
                    {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message as string}</span>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter Password"
                        {...register('password', { required: 'Password is required' })}
                        className="w-full p-3 border border-gray-300 rounded-md bg-[#FAFAFC]"
                    />
                    {errors.password && <span className="text-red-500 text-xs">{errors.password.message as string}</span>}
                </div>

                {/* Terms & Conditions */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    {/* Line 1: Checkbox + sentence */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            className="border border-gray-500"
                            {...register('terms', { required: 'You must agree to the terms and conditions' })}
                        />
                        <Label htmlFor="terms" className="text-sm text-gray-500">
                            I have read and agreed to
                        </Label>
                    </div>

                    {/* Line 2: Terms and Conditions */}
                    <span className="pl-6 sm:pl-0 text-sm text-[#1D1F2C]">
                        Terms and Conditions
                    </span>

                    {/* Error Message */}
                    {errors.terms && (
                        <span className="text-red-500 text-xs sm:ml-2">{errors.terms.message as string}</span>
                    )}
                </div>


                {/* Submit Button */}
                <ButtonReuseable
                    title="Log In"
                    className="bg-[#FAD33E] w-full border border-[#FAD33E] hover:bg-white transform duration-300 px-7 py-2 text-md cursor-pointer font-semibold"
                />

                {/* Divider and Social Buttons */}
                <div className="text-center mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-grow h-px bg-gray-300" />
                        <span className="px-3 text-gray-500 text-sm">Or</span>
                        <div className="flex-grow h-px bg-gray-300" />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => console.log('Sign up with Google')}
                            className="flex w-1/2 md:w-auto justify-center items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                        >
                            <FcGoogle className="text-xl" />
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">Sign up with Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => console.log('Sign up with Facebook')}
                            className="flex w-1/2 md:w-auto justify-center items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                        >
                            <FaFacebook className="text-blue-600 text-xl" />
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">Sign up with Facebook</span>
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}
