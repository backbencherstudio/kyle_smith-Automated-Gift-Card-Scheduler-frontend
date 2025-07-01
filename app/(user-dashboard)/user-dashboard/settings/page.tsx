"use client"
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext';
import ContactInfo from '@/components/profile/ContactInfo';
import Password from '@/components/profile/Password';
import Notifications from '@/components/profile/Notifications';

interface dataTypes {
    name: string;
    email: string;
    location: string;
    phone: string;
    profileImage: string | null;
    coverImage: string;
    dob: Date | null;
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
        profileImage: user?.avatar_url || "/image/profile.png",
        coverImage: "/image/profile-cover-img.jpg",
        dob: user?.date_of_birth ? new Date(user.date_of_birth) : null,
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
        <div className="relative">
            <ContactInfo userData={userData} />
            <Password />
            <Notifications />
        </div>
    )
}
