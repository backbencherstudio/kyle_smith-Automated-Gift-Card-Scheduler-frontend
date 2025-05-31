"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { IoMailOutline } from "react-icons/io5";
import { Switch } from "../ui/switch";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

interface ProfileEditProps {
    setIsEdite: (value: boolean) => void;
    userData?: {
        name: string;
        email: string;
        location: string;
        phone: string;
        profileImage: string;
        coverImage: string;
        aboutUs: string;
        dob: Date;
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    };
}

export default function ProfileEdit({ setIsEdite, userData }: ProfileEditProps) {
    const { register, handleSubmit, control } = useForm({
        defaultValues: {
            name: userData?.name,
            email: userData?.email,
            address: userData?.location,
            phone: userData?.phone,
            about: userData?.aboutUs,
            dob: new Date(),
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }
    });
    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const [profileImg, setProfileImg] = useState(userData?.profileImage || "/image/proimag.jpg");
    const [coverImg, setCoverImg] = useState(userData?.coverImage || "/image/profile-cover-img.jpg");
    const [birthdayNotify, setBirthdayNotify] = useState(true);
    const [deliveryNotify, setDeliveryNotify] = useState(true);
    const [allNotify, setAllNotify] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log("Form Data:", { data, coverImg, profileImg, birthdayNotify, deliveryNotify, allNotify });
            toast.success("Profile updated successfully!");
            setIsEdite(false);
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image")) {
            setProfileImg(URL.createObjectURL(file));
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image")) {
            setCoverImg(URL.createObjectURL(file));
        }
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit(onSubmit)}>
                {isLoading && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg flex items-center gap-3">
                            <Loader2 className="h-6 w-6 animate-spin text-primaryColor" />
                            <p className="text-headerColor font-medium">Updating profile...</p>
                        </div>
                    </div>
                )}

                {/* Profile Image Section */}
                <div className="bg-whiteColor p-3 md:p-6 rounded-2xl">
                    <div className="flex justify-between items-center pb-2 mb-6">
                        <h2 className="text-headerColor text-lg lg:text-lg font-bold">Profile</h2>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-primaryColor cursor-pointer text-headerColor px-3 py-1.5 md:px-3 md:py-3 rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Save & Changes
                        </button>
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
                            <button
                                type="button"
                                onClick={() => coverInputRef.current.click()}
                                className="absolute  bottom-4 right-4 z-10 bg-[#D2D2D5]/10 text-white md:px-4 px-2 py-1.5 md:py-2 rounded-md flex items-center text-sm md:text-base gap-1 hover:scale-105 transition"
                            >
                                <FaCamera className="lg:w-4 lg:h-4 w-3 h-3 " /> Edit Cover
                            </button>
                            <div className="absolute top-0 left-0 bg-blackColor/80 w-full h-full rounded-lg">
                                <div className="flex flex-col md:flex-row h-full md:ml-15 justify-center md:justify-start md:items-center gap-3 md:gap-5 ml-6">
                                    <div className="relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px] rounded-full overflow-visible border-2 border-whiteColor">
                                        <Image
                                            src={profileImg}
                                            alt="Profile"
                                            fill
                                            unoptimized={profileImg.startsWith("blob:")}
                                            className="object-cover rounded-full"
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={profileInputRef}
                                            onChange={handleProfileChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => profileInputRef.current.click()}
                                            className="absolute lg:bottom-0 cursor-pointer bottom-1 -right-2  lg:right-0 bg-black text-white md:p-2.5 p-1.5 border-1 border-whiteColor rounded-full hover:scale-105 transition"
                                        >
                                            <FaCamera className="w-4 h-4" />
                                        </button>
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
                </div>

                {/* Contact Details */}
                <div className="md:grid md:grid-cols-2 gap-4 mt-6 bg-white p-4 md:p-6 rounded-xl">
                    <div className="mb-2 col-span-2">
                        <h5 className="text-headerColor text-lg font-bold">Contact Details</h5>
                    </div>
                    <div className="col-span-1">
                        <label className="text-headerColor mb-1 text-[14px] block font-semibold">Name</label>
                        <input
                            {...register("name")}
                            defaultValue={userData?.name}
                            placeholder="Enter your Name"
                            className="w-full border px-3 py-3 rounded-md bg-borderColor2/35"
                        />

                        <label className="text-headerColor mb-1 text-[14px] block font-semibold mt-4">Email</label>
                        <input
                            {...register("email")}
                            defaultValue={userData?.email}
                            placeholder="Enter your Email"
                            className="w-full border px-3 py-3 rounded-md bg-borderColor2/35"
                        />

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
                                            className={cn(
                                                "w-full justify-start text-left font-normal bg-borderColor2/35",
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
                            className="w-full border px-3 py-3 rounded-md bg-borderColor2/35"
                        />

                        <label className="text-headerColor mb-1 text-[14px] block font-semibold mt-4">
                            Phone Number
                        </label>
                        <input
                            {...register("phone")}
                            defaultValue={userData?.phone}
                            className="w-full border px-3 py-3 rounded-md bg-borderColor2/35"
                        />
                    </div>
                </div>

                {/* Password Settings */}
                <div className="mt-6 p-6 rounded-xl bg-whiteColor">
                    <label className="text-headerColor text-lg lg:text-xl font-semibold mb-3 block">
                        Password Settings
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-2">
                        <div>
                            <label className="text-headerColor mb-1 text-[14px] block font-semibold">
                                Current Password
                            </label>
                            <input
                                {...register("currentPassword")}
                                type="password"
                                placeholder="Enter current password"
                                className="w-full border px-3 py-3 rounded-md bg-borderColor2/35"
                            />
                        </div>
                        <div>
                            <label className="text-headerColor mb-1 text-[14px] block font-semibold">
                                New Password
                            </label>
                            <input
                                {...register("newPassword")}
                                type="password"
                                placeholder="Enter new password"
                                className="w-full border px-3 py-3 rounded-md bg-borderColor2/35"
                            />
                        </div>
                        <div>
                            <label className="text-headerColor mb-1 text-[14px] block font-semibold">
                                Confirm Password
                            </label>
                            <input
                                {...register("confirmPassword")}
                                type="password"
                                placeholder="Confirm new password"
                                className="w-full border px-3 py-3 rounded-md bg-borderColor2/35"
                            />
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="mt-6 p-4 md:p-6 rounded-xl bg-whiteColor">
                    <label className="text-headerColor text-lg lg:text-xl font-semibold mb-3 block">
                        About
                    </label>
                    <textarea
                        {...register("about")}
                        className="w-full border px-3 py-3 rounded-md bg-borderColor2/35 h-36"
                        defaultValue={userData?.aboutUs}
                    />
                </div>

                {/* Email Notifications */}
                <div className="bg-white p-6 rounded-lg mt-6 w-full">
                    <h3 className="text-headerColor text-lg font-bold">Email Notifications Settings</h3>
                    <div className="space-y-4 mt-3">
                        <div className="flex items-center justify-between">
                            <span className="text-base text-descriptionColor">Birthday Schedule Notifications</span>
                            <Switch
                                checked={birthdayNotify}
                                onCheckedChange={setBirthdayNotify}
                                className={birthdayNotify ? "!bg-[#2F54EB] cursor-pointer" : "cursor-pointer"}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-base text-descriptionColor">After Delivery Notifications</span>
                            <Switch
                                checked={deliveryNotify}
                                onCheckedChange={setDeliveryNotify}
                                className={deliveryNotify ? "!bg-[#2F54EB] cursor-pointer" : "cursor-pointer"}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-base text-descriptionColor">All Notifications</span>
                            <Switch
                                checked={allNotify}
                                onCheckedChange={setAllNotify}
                                className={allNotify ? "!bg-[#2F54EB] cursor-pointer" : "cursor-pointer"}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
