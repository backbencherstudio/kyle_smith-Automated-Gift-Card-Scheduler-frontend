"use client"
import ContactInfo from '@/components/profile/ContactInfo';
import Password from '@/components/profile/Password';
import { useAuth } from '@/contexts/AuthContext';
// import Notifications from '@/components/profile/Notifications';
import Loader from '@/components/reusable/Loader';

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
    const { user, isLoading } = useAuth();

    if (isLoading || !user) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Loader />
            </div>
        );
    }

    // Create user data from auth context
    const userData: dataTypes = {
        name: user?.name || "User",
        email: user?.email || "user@example.com",
        location: user?.address || "Address not specified",
        phone: user?.phone_number || "Phone not specified",
        profileImage: user?.avatar_url || "/profile.png",
        coverImage: "/image/profile-cover-img.jpg",
        dob: user?.date_of_birth ? new Date(user.date_of_birth) : null,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        accountType: user?.type || "User",
        memberSince: user?.created_at ? new Date(user.created_at).toLocaleDateString() : undefined
    };

    return (
        <div className="relative">
            <ContactInfo userData={userData} />
            <Password />
            {/* <Notifications /> */}
        </div>
    )
}
