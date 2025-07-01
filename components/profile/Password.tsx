"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { BiEdit } from "react-icons/bi";
import { BiShow, BiHide } from "react-icons/bi";
import { changePassword } from "@/apis/authApis";
import { CustomToast } from "@/lib/Toast/CustomToast";

export default function Password() {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }
    });

    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handlePasswordEditClick = () => {
        setIsEditingPassword(true);
    };

    const handleCancel = () => {
        setIsEditingPassword(false);
        reset();
    };

    const handleSave = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            CustomToast.show("New password and confirm password do not match!");
            return;
        }
        if (data.newPassword.length < 6) {
            CustomToast.show("New password must be at least 6 characters long!");
            return;
        }

        try {
            setIsLoading(true);

            const response = await changePassword(data.currentPassword, data.newPassword);

            if (response.success) {
                CustomToast.show(response.message || "Password updated successfully!");
                setIsEditingPassword(false);
                reset();
            } else {
                CustomToast.show(response.message || "Failed to update password");
            }
        } catch (error) {
            CustomToast.show(error.response?.data?.message?.message || "Something went wrong!");
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
                    <div className="relative">
                        <input
                            {...register("currentPassword")}
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            disabled={!isEditingPassword}
                            className={`w-full border px-3 py-3 rounded-md pr-12 ${isEditingPassword ? 'bg-borderColor2/35 text-headerColor' : 'bg-gray-100 text-gray-500'}`}
                        />
                        {isEditingPassword && (
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showCurrentPassword ? <BiHide className="w-4 h-4" /> : <BiShow className="w-4 h-4" />}
                            </button>
                        )}
                    </div>
                </div>
                <div>
                    <label className="text-headerColor mb-1 text-[14px] block font-semibold">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            {...register("newPassword")}
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            disabled={!isEditingPassword}
                            className={`w-full border px-3 py-3 rounded-md pr-12 ${isEditingPassword ? 'bg-borderColor2/35 text-headerColor' : 'bg-gray-100 text-gray-500'}`}
                        />
                        {isEditingPassword && (
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showNewPassword ? <BiHide className="w-4 h-4" /> : <BiShow className="w-4 h-4" />}
                            </button>
                        )}
                    </div>
                </div>
                <div>
                    <label className="text-headerColor mb-1 text-[14px] block font-semibold">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            {...register("confirmPassword")}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            disabled={!isEditingPassword}
                            className={`w-full border px-3 py-3 rounded-md pr-12 ${isEditingPassword ? 'bg-borderColor2/35 text-headerColor' : 'bg-gray-100 text-gray-500'}`}
                        />
                        {isEditingPassword && (
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <BiHide className="w-4 h-4" /> : <BiShow className="w-4 h-4" />}
                            </button>
                        )}
                    </div>
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
        </div>
    );
}
