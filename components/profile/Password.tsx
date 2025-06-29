"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { BiEdit } from "react-icons/bi";
import { toast } from "react-toastify";

export default function Password() {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }
    });

    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handlePasswordEditClick = () => {
        setIsEditingPassword(true);
    };

    const handleCancel = () => {
        setIsEditingPassword(false);
        // Reset form to original values
        const form = document.querySelector('form');
        if (form) {
            form.reset();
        }
    };

    const handleSave = async (data) => {
        try {
            setIsLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log("Password Form Data:", data);
            toast.success("Password updated successfully!");
            setIsEditingPassword(false);
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-6 p-6 rounded-xl bg-whiteColor">
            <div className="flex justify-between items-center pb-2 mb-6">
                <h2 className="text-headerColor text-lg lg:text-lg font-bold">Password Settings</h2>
                {/* edit icon  */}
                <BiEdit
                    className="text-lg cursor-pointer"
                    onClick={handlePasswordEditClick}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-2">
                <div>
                    <label className="text-headerColor mb-1 text-[14px] block font-semibold">
                        Current Password
                    </label>
                    <input
                        {...register("currentPassword")}
                        type="password"
                        placeholder="Enter current password"
                        disabled={!isEditingPassword}
                        className={`w-full border px-3 py-3 rounded-md ${isEditingPassword ? 'bg-borderColor2/35 text-headerColor' : 'bg-gray-100 text-gray-500'}`}
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
                        disabled={!isEditingPassword}
                        className={`w-full border px-3 py-3 rounded-md ${isEditingPassword ? 'bg-borderColor2/35 text-headerColor' : 'bg-gray-100 text-gray-500'}`}
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
                        disabled={!isEditingPassword}
                        className={`w-full border px-3 py-3 rounded-md ${isEditingPassword ? 'bg-borderColor2/35 text-headerColor' : 'bg-gray-100 text-gray-500'}`}
                    />
                </div>
            </div>

            {/* Password section button */}
            {isEditingPassword && (
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
