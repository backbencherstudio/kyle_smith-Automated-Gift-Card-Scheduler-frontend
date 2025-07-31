"use client";

import { emailChange, sendEmailChangeToken, updateProfile } from "@/apis/authApis";
import { useAuth } from "@/contexts/AuthContext";
import { CustomToast } from "@/lib/Toast/CustomToast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BiEdit } from "react-icons/bi";
import { FaCamera } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { IoMailOutline } from "react-icons/io5";
import ResuseableModal from "../reusable/ResuseableModal";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface ContactInfoProps {
    userData?: {
        name: string;
        email: string;
        location: string;
        phone: string;
        profileImage: string | null;
        coverImage: string;
        dob: Date | null;
    };
}

// Helper to normalize avatar URL for next/image
function getAvatarUrl(avatarUrl: string | null | undefined): string {
    if (!avatarUrl) return "/profile.png";
    if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) return avatarUrl;
    if (avatarUrl.startsWith("/")) return avatarUrl;
    // Otherwise, treat as a file in /image/profile/
    return `/image/profile/${avatarUrl}`;
}

export default function ContactInfo({ userData }: ContactInfoProps) {
    const { refreshUser } = useAuth();

    const { register, handleSubmit, control } = useForm({
        defaultValues: {
            profileImage: userData?.profileImage,
            name: userData?.name,
            email: userData?.email,
            address: userData?.location,
            phone: userData?.phone,
            dob: userData?.dob || undefined,
        }
    });

    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const [profileImg, setProfileImg] = useState(userData?.profileImage);
    const [coverImg, setCoverImg] = useState(userData?.coverImage || "/image/profile-cover-img.jpg");
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [tokenInput, setTokenInput] = useState("");
    const [emailChangeStep, setEmailChangeStep] = useState(1); // 1: enter email, 2: enter token
    const [isSendingToken, setIsSendingToken] = useState(false);

    const handleProfileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image")) {
            setProfileImg(URL.createObjectURL(file));
            setImageError(false);
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image")) {
            setCoverImg(URL.createObjectURL(file));
        }
    };

    const handleProfileEditClick = () => {
        setIsEditingProfile(true);
    };

    const handleEmailEditClick = () => {
        setIsEditingEmail(true);
        setEmailModalOpen(true);
    };

    const handleCancel = () => {
        setIsEditingProfile(false);
        setProfileImg(userData?.profileImage);
        setCoverImg(userData?.coverImage || "/image/profile-cover-img.jpg");
        setImageError(false);
        const form = document.querySelector('form');
        if (form) {
            form.reset();
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const handleSave = async (data) => {
        try {
            setIsLoading(true);

            const profileFile = profileInputRef.current?.files?.[0];

            const updateData = {
                name: data.name,
                phone_number: data.phone,
                address: data.address,
                date_of_birth: data.dob ? format(data.dob, 'yyyy-MM-dd') : null,
            };

            let response;

            if (profileFile) {
                const formData = new FormData();
                formData.append('image', profileFile);
                formData.append('name', data.name);
                formData.append('phone_number', data.phone);
                formData.append('address', data.address);
                if (data.dob) {
                    formData.append('date_of_birth', format(data.dob, 'yyyy-MM-dd'));
                }

                response = await updateProfile(formData);
            } else {
                response = await updateProfile(updateData);
            }

            if (response.success) {
                console.log("Profile updated successfully:", response);
                CustomToast.show(response.message || 'Profile updated successfully!');
                setIsEditingProfile(false);
                setIsEditingEmail(false);

                // Refresh user data from context
                refreshUser();
            } else {
                CustomToast.show(response.message || "Failed to update profile");
            }
        } catch (error) {
            // console.error("Error updating profile:", error);
            CustomToast.show(error.response.data.message.message || 'Something went wrong while updating profile!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = async (e) => {
        e.preventDefault();
        
        if (emailChangeStep === 1) {
            // Step 1: Send verification token to the new email
            try {
                setIsSendingToken(true);
                const response = await sendEmailChangeToken(emailInput);
                if (response.success) {
                    CustomToast.show(response.message || 'Verification token sent to your email!');
                    setEmailChangeStep(2);
                } else {
                    CustomToast.show(response.message || "Failed to send verification token");
                }
            } catch (error) {
                CustomToast.show(error.response?.data?.message?.message || 'Something went wrong while sending token!');
            } finally {
                setIsSendingToken(false);
            }
        } else {
            // Step 2: Verify token and change email
            try {
                const response = await emailChange(emailInput, tokenInput);
                if (response.success) {
                    CustomToast.show(response.message || 'Email changed successfully!');
                    setIsEditingEmail(false);
                    setEmailModalOpen(false);
                    setEmailInput("");
                    setTokenInput("");
                    setEmailChangeStep(1);
                    refreshUser();
                } else {
                    CustomToast.show(response.message || "Failed to change email");
                }
            } catch (error) {
                CustomToast.show(error.response?.data?.message?.message || 'Something went wrong while changing email!');
            }
        }
    };

    const handleEmailModalClose = () => {
        setEmailModalOpen(false);
        setIsEditingEmail(false);
        setEmailInput("");
        setTokenInput("");
        setEmailChangeStep(1);
    };

    return (
        <div className="bg-whiteColor p-3 md:p-6 rounded-2xl">
            <div className="flex justify-between items-center pb-2 mb-6">
                <h2 className="text-headerColor text-lg lg:text-lg font-bold">Profile</h2>
                {/* edit icon  */}
                <BiEdit
                    className="text-xl cursor-pointer"
                    onClick={handleProfileEditClick}
                />
            </div>
            <div className="flex justify-between">
                <div className="relative w-full">
                    <Image
                        src={coverImg}
                        alt="Cover"
                        width={1220}
                        height={300}
                        className="w-full h-[300px] rounded-lg object-cover"
                        unoptimized={coverImg.startsWith("blob:")}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        ref={coverInputRef}
                        onChange={handleCoverChange}
                        className="hidden"
                    />
                    <div className="absolute top-0 left-0 bg-blackColor/80 w-full h-full rounded-lg">
                        <div className="flex flex-col md:flex-row h-full md:ml-15 justify-center md:justify-start md:items-center gap-3 md:gap-5 ml-6">
                            <div className="relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px] rounded-full overflow-visible border-2 border-whiteColor">
                                {profileImg && !imageError ? (
                                    <Image
                                        src={getAvatarUrl(profileImg)}
                                        alt="Profile"
                                        fill
                                        unoptimized={profileImg.startsWith("blob:")}
                                        className="object-cover rounded-full"
                                        onError={handleImageError}
                                    />
                                ) : (
                                    <Image
                                        src={getAvatarUrl(userData?.profileImage)}
                                        alt="Profile"
                                        fill
                                        unoptimized={userData?.profileImage?.startsWith("blob:")}
                                        className="object-cover rounded-full"
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={profileInputRef}
                                    onChange={handleProfileChange}
                                    className="hidden"
                                />
                                {isEditingProfile && (
                                    <button
                                        type="button"
                                        onClick={() => profileInputRef.current.click()}
                                        className="absolute lg:bottom-0 cursor-pointer bottom-1 -right-2  lg:right-0 bg-black text-white md:p-2.5 p-1.5 border-1 border-whiteColor rounded-full hover:scale-105 transition"
                                    >
                                        <FaCamera className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-lg md:text-2xl lg:text-[32px] font-semibold text-whiteColor">
                                    {userData?.name}
                                </h4>

                                <div className="mt-2 md:mt-0">
                                    <p className="flex items-center gap-2 text-sm md:text-base text-[#D2D2D5]">
                                        <span><GrLocation /></span> {userData?.location}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm md:text-base text-[#D2D2D5]">
                                        <span><IoMailOutline /></span> {userData?.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Contact Details */}
            <div className="md:grid md:grid-cols-2 gap-4 mt-6 p-3 md:p-6">
                <div className="mb-2 col-span-2 flex justify-between items-center">
                    <h5 className="text-headerColor text-lg font-bold">Contact Details</h5>
                </div>
                <div className="col-span-1">
                    <label className="text-headerColor mb-1 text-[14px] block font-semibold">Name</label>
                    <input
                        {...register("name")}
                        defaultValue={userData?.name}
                        placeholder="Enter your Name"
                        disabled={!isEditingProfile}
                        className={`w-full border px-3 py-3 rounded-md ${isEditingProfile ? 'bg-borderColor2/35 text-headerColor' : 'bg-gray-100 text-gray-500'}`}
                    />

                    <label className="text-headerColor mb-1 text-[14px] block font-semibold mt-4">Email</label>
                    <div className="relative">
                        <input
                            {...register("email")}
                            defaultValue={userData?.email}
                            placeholder="Enter your Email"
                            disabled={true}
                            className="w-full border px-3 py-3 rounded-md pr-12 bg-gray-100 text-gray-500"
                            title="Click the edit button to change email"
                        />
                        <button
                            type="button"
                            onClick={handleEmailEditClick}
                            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            title="Change email address"
                        >
                            <BiEdit className="w-4 h-4" />
                        </button>
                    </div>

                    <label className="text-headerColor mb-1 text-[14px] block font-semibold mt-4">
                        Date of Birth
                    </label>
                    <Controller
                        control={control}
                        name="dob"
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        disabled={!isEditingProfile}
                                        className={cn(
                                            "w-full justify-start text-left font-normal py-6",
                                            isEditingProfile ? 'bg-borderColor2/45 text-headerColor' : 'bg-gray-200 text-gray-500',
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                </div>

                <div className="col-span-1 mt-4 md:mt-0">
                    <label className="text-headerColor mb-1 text-[14px] block font-semibold">Address</label>
                    <input
                        {...register("address")}
                        defaultValue={userData?.location}
                        disabled={!isEditingProfile}
                        className={`w-full border px-3 py-3 rounded-md ${isEditingProfile ? 'bg-borderColor2/35 text-headerColor' : 'bg-gray-100 text-gray-500'}`}
                    />

                    <label className="text-headerColor mb-1 text-[14px] block font-semibold mt-4">
                        Phone Number
                    </label>
                    <input
                        {...register("phone")}
                        defaultValue={userData?.phone}
                        disabled={!isEditingProfile}
                        className={`w-full border px-3 py-3 rounded-md ${isEditingProfile ? 'bg-borderColor2/35 text-headerColor' : 'bg-gray-100 text-gray-500'}`}
                    />
                </div>
            </div>

            {/* button section  */}
            {isEditingProfile && (
                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="bg-[#2F54EB] hover:bg-[#2F54EB]/90 text-white cursor-pointer"
                        onClick={handleSubmit(handleSave)}
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </div>
            )}

            {/* Email Change Modal */}
            <ResuseableModal
                isOpen={emailModalOpen}
                onClose={handleEmailModalClose}
                title={emailChangeStep === 1 ? "Change Email Address" : "Enter Verification Token"}
            >
                <form onSubmit={handleEmailChange} className="space-y-4">
                    {emailChangeStep === 1 ? (
                        // Step 1: Enter new email
                        <div>
                            <label className="text-headerColor mb-1 text-[14px] block font-semibold">
                                New Email Address
                            </label>
                            <input
                                type="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="Enter new email address"
                                className="w-full border px-3 py-3 rounded-md bg-borderColor2/35 text-headerColor"
                                required
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                A verification token will be sent to this email address.
                            </p>
                        </div>
                    ) : (
                        // Step 2: Enter verification token
                        <>
                            <div>
                                <label className="text-headerColor mb-1 text-[14px] block font-semibold">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={emailInput}
                                    disabled
                                    className="w-full border px-3 py-3 rounded-md bg-gray-100 text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="text-headerColor mb-1 text-[14px] block font-semibold">
                                    Verification Token
                                </label>
                                <input
                                    type="text"
                                    value={tokenInput}
                                    onChange={(e) => setTokenInput(e.target.value)}
                                    placeholder="Enter verification token from your email"
                                    className="w-full border px-3 py-3 rounded-md bg-borderColor2/35 text-headerColor"
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Check your email for the verification token.
                                </p>
                            </div>
                        </>
                    )}
                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleEmailModalClose}
                        >
                            Cancel
                        </Button>
                        {emailChangeStep === 2 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEmailChangeStep(1)}
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            type="submit"
                            className="bg-[#2F54EB] hover:bg-[#2F54EB]/90 text-white"
                            disabled={isSendingToken}
                        >
                            {isSendingToken ? "Sending..." : emailChangeStep === 1 ? "Send Token" : "Change Email"}
                        </Button>
                    </div>
                </form>
            </ResuseableModal>
        </div>
    );
}
