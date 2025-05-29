"use client";

import DynamicTableTwo from '@/app/(admin)/_component/common/DynamicTableTwo'
import React from 'react'
import { FaChevronDown } from 'react-icons/fa';

export default function UpcomingBirthday() {
    const columns = [
        { label: "Name", width: "20%", accessor: "name" },
        { label: "Email", width: "25%", accessor: "email" },
        { label: "Birthday Date", width: "20%", accessor: "birthdayDate" },
        { label: "Amount", width: "15%", accessor: "amount" },
        { label: "Delivery Status", width: "20%", accessor: "deliveryStatus" },
    ];

    const data = [
        { name: "Leslie Alexander", email: "abc@gmail.com", birthdayDate: "12 May 2025", amount: "$50", deliveryStatus: "Email" },
        { name: "Annette Black", email: "abc@gmail.com", birthdayDate: "13 May 2025", amount: "$100", deliveryStatus: "Email" },
        { name: "Darlene Robertson", email: "abc@gmail.com", birthdayDate: "14 May 2025", amount: "$200", deliveryStatus: "Email" },
        { name: "Albert Flores", email: "abc@gmail.com", birthdayDate: "15 May 2025", amount: "$300", deliveryStatus: "Email" },
    ];

    return (
        <div className="bg-white rounded-lg p-4 mt-10">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-[#232323]">Upcoming Birthday</h1>
                <button className="text-[#1E1E1E] border  px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                    <span>View all</span>
                    <FaChevronDown />
                </button>
            </div>
            <DynamicTableTwo
                columns={columns}
                data={data}
                currentPage={1}
                itemsPerPage={10}
                onPageChange={(page) => console.log(page)}
            />
        </div>
    )
}
