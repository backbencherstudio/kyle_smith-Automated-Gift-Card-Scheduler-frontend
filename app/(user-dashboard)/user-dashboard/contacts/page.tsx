'use client'
import React, { useState } from 'react'

import DynamicTableTwo from '@/app/(admin)/_component/common/DynamicTableTwo'
import { FaChevronDown, FaPlus } from 'react-icons/fa'
import CustomModal from '@/components/ui/custom-modal';
import AddContacts from '../_Components/AddContacts';
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'


export default function Contacts() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    
    const columns = [
        { label: "Name", width: "20%", accessor: "name" },
        { label: "Address", width: "20%", accessor: "address" },
        { label: "Email", width: "25%", accessor: "email" },
        { label: "Birthday Date", width: "20%", accessor: "birthdayDate" },

    ];

    const data = [
        { name: "Leslie Alexander", address: "123 Main St, Anytown, USA", email: "abc@gmail.com", birthdayDate: "12 May 2025" },
        { name: "Annette Black", address: "123 Main St, Anytown, USA", email: "abc@gmail.com", birthdayDate: "13 May 2025" },
        { name: "Darlene Robertson", address: "123 Main St, Anytown, USA", email: "abc@gmail.com", birthdayDate: "14 May 2025" },
        { name: "Albert Flores", address: "123 Main St, Anytown, USA", email: "abc@gmail.com", birthdayDate: "15 May 2025" },
    ];
    return (
        <>

            <h1 className='text-3xl font-bold text-[#232323]'>Contact</h1>

            <div className="bg-white rounded-lg p-4 mt-5">
                <div className='mb-5'>
                    <h1 className="text-xl font-bold text-[#232323]">Contact List</h1>

                    <div className='flex items-center justify-between gap-4 mt-4'>
                        <div className="w-[300px] relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 w-full bg-gray-50"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#FDCB48] text-[#1D1F2C] cursor-pointer transform duration-300 hover:bg-yellow-500 px-5 py-3 text-sm rounded flex items-center gap-1 font-medium whitespace-nowrap"
                        >
                            <FaPlus size={12} />
                            Add New
                        </button>
                    </div>
                </div>
                <DynamicTableTwo
                    columns={columns}
                    data={data}
                    currentPage={currentPage}
                    itemsPerPage={2}
                    onPageChange={(page) => setCurrentPage(page)}
                />

                <CustomModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Add Contact"
                >
                    <AddContacts
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </CustomModal>
            </div>
        </>
    )
}
