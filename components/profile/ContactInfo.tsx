"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { IoMailOutline } from "react-icons/io5";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { BiEdit } from "react-icons/bi";
import UserAvatar from "../ui/UserAvatar";
import { toast } from "react-toastify";

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

export default function ContactInfo({ userData }: ContactInfoProps) {
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
    };

    const handleCancel = () => {
        setIsEditingProfile(false);
        setIsEditingEmail(false);
        setProfileImg(userData?.profileImage);
        setCoverImg(userData?.coverImage || "/image/profile-cover-img.jpg");
        setImageError(false);
        // Reset form to original values
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
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log("Contact Form Data:", { ...data, profileImg, coverImg });
            toast.success("Profile updated successfully!");
            setIsEditingProfile(false);
            setIsEditingEmail(false);
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
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
                                        src={profileImg}
                                        alt="Profile"
                                        fill
                                        unoptimized={profileImg.startsWith("blob:")}
                                        className="object-cover rounded-full"
                                        onError={handleImageError}
                                    />
                                ) : (
                                    <Image
                                        src={userData?.profileImage || "/image/profile.png"}
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
                            disabled={!isEditingEmail}
                            className={`w-full border px-3 py-3 rounded-md pr-12 ${isEditingEmail ? 'bg-borderColor2/35 text-headerColor' : 'bg-gray-100 text-gray-500'}`}
                        />
                        <button
                            type="button"
                            onClick={handleEmailEditClick}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
            {(isEditingProfile || isEditingEmail) && (
                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="bg-[#2F54EB] hover:bg-[#2F54EB]/90 text-white"
                        onClick={handleSubmit(handleSave)}
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </div>
            )}
        </div>
    );
}
