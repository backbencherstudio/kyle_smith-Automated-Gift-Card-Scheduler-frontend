"use client"
import DynamicTableTwo from '@/app/(admin)/_component/common/DynamicTableTwo';
import React, { useState } from 'react'

export default function OrderHistory() {
    const [currentPage, setCurrentPage] = useState(1)

    const columns = [
        { label: "Date", width: "20%", accessor: "date" },
        { label: "Recipient Name", width: "20%", accessor: "recipientName" },
        { label: "Gift Amount", width: "20%", accessor: "giftAmount" },
        { label: "Email", width: "25%", accessor: "email" },
        { label: "Status", width: "20%", accessor: "status" },
        { label: "Event ", width: "20%", accessor: "event " },
        { label: "More", width: "20%", accessor: "more" },

    ];

    const data = [
        { date: "10 May 2025", recipientName: "Kathryn Murphy", giftAmount: "$25", email: "abc@gmail.com", status: "Complete", event: "Birthday", more: "View" },
        { date: "10 May 2025", recipientName: "Kathryn Murphy", giftAmount: "$25", email: "abc@gmail.com", status: "Complete", event: "Birthday", more: "View" },
        { date: "10 May 2025", recipientName: "Kathryn Murphy", giftAmount: "$25", email: "abc@gmail.com", status: "Complete", event: "Birthday", more: "View" },
        { date: "10 May 2025", recipientName: "Kathryn Murphy", giftAmount: "$25", email: "abc@gmail.com", status: "Complete", event: "Birthday", more: "View" },
        { date: "10 May 2025", recipientName: "Kathryn Murphy", giftAmount: "$25", email: "abc@gmail.com", status: "Complete", event: "Birthday", more: "View" },
        { date: "10 May 2025", recipientName: "Kathryn Murphy", giftAmount: "$25", email: "abc@gmail.com", status: "Complete", event: "Birthday", more: "View" },
        { date: "10 May 2025", recipientName: "Kathryn Murphy", giftAmount: "$25", email: "abc@gmail.com", status: "Complete", event: "Birthday", more: "View" },
        { date: "10 May 2025", recipientName: "Kathryn Murphy", giftAmount: "$25", email: "abc@gmail.com", status: "Complete", event: "Birthday", more: "View" },
    ];
    return (
        <div>
            <h1 className='text-3xl font-bold text-[#232323] mb-6'>Order History</h1>
            <div className='mt-5 bg-white rounded-lg p-4'>
                <h1 className='text-xl font-bold text-[#232323] mb-5'>Payment History</h1>
                <DynamicTableTwo
                    columns={columns}
                    data={data}
                    currentPage={currentPage}
                    itemsPerPage={5}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    )
}
