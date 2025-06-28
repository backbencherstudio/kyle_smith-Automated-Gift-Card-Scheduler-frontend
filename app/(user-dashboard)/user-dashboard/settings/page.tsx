"use client"
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from '@/components/profile/UserProfile';

interface dataTypes {
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
    accountType: string;
    memberSince?: string;
}

export default function Settings() {
    const [isEdite, setIsEdite] = useState<boolean>(false);
    const { user } = useAuth();

    // Create user data from auth context
    const userData: dataTypes = {
        name: user?.name || "User",
        email: user?.email || "user@example.com",
        location: user?.address || "Address not specified",
        phone: user?.phone_number || "Phone not specified",
        profileImage: user?.avatar || "/image/profile.png",
        coverImage: "/image/profile-cover-img.jpg",
        aboutUs: "Timely Gift was built to simplify the way we celebrate the people we care about. Forgetful moments or last-minute rushes are a thing of the past our platform ensures that thoughtful gifts are delivered on time, every time. With just a few clicks, users can add their friends' birthdays, schedule personalized Amazon gift cards, and receive smart reminders when special days are near. Once confirmed, the gift is sent instantly via email turning a simple gesture into a meaningful memory.",
        dob: user?.date_of_birth ? new Date(user.date_of_birth) : new Date("1999-10-21"),
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        accountType: user?.type || "User",
        memberSince: user?.created_at ? new Date(user.created_at).toLocaleDateString() : undefined
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FAD33E]"></div>
            </div>
        );
    }

    return (
        <div >
            <UserProfile setIsEdite={setIsEdite} userData={userData} />
        </div>
    )
}
