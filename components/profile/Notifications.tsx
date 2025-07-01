"use client";

import { useState } from "react";
import { Switch } from "../ui/switch";

export default function Notifications() {
    const [birthdayNotify, setBirthdayNotify] = useState(true);
    const [deliveryNotify, setDeliveryNotify] = useState(true);
    const [allNotify, setAllNotify] = useState(true);

    return (
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
    );
} 