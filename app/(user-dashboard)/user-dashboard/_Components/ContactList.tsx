'use client'
import React from 'react'
import { FaPlus } from 'react-icons/fa6'

const contacts = [
    {
        name: 'Alice Emma',
        email: 'alice.emma@example.com',
        img: 'https://randomuser.me/api/portraits/women/10.jpg',
    },
    {
        name: 'John Smith',
        email: 'john.smith@example.com',
        img: 'https://randomuser.me/api/portraits/men/15.jpg',
    },
    {
        name: 'Sophia Lee',
        email: 'sophia.lee@example.com',
        img: 'https://randomuser.me/api/portraits/women/18.jpg',
    },
    {
        name: 'David Chen',
        email: 'david.chen@example.com',
        img: 'https://randomuser.me/api/portraits/men/25.jpg',
    },
    {
        name: 'Emily Clark',
        email: 'emily.clark@example.com',
        img: 'https://randomuser.me/api/portraits/women/22.jpg',
    },
    {
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        img: 'https://randomuser.me/api/portraits/men/30.jpg',
    },
    {
        name: 'Rachel Green',
        email: 'rachel.green@example.com',
        img: 'https://randomuser.me/api/portraits/women/40.jpg',
    },
]

export default function ContactList() {
    return (
        <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-lg p-4 h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Contact</h2>
                    <button className="bg-[#FBDE6E] text-[#1D1F2C] cursor-pointer transform duration-300 hover:bg-yellow-500 px-3 py-2 text-sm rounded flex items-center gap-1 font-medium">
                        <FaPlus size={12} />
                        Add New
                    </button>
                </div>

                {/* Contact List */}
                <div className="flex-grow overflow-y-auto">
                    {contacts.map((c, i) => (
                        <div
                            key={i}
                            className="flex gap-3 items-center py-3 border-b last:border-b-0"
                        >
                            <img
                                src={c.img}
                                alt={c.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-sm font-medium">{c.name}</p>
                                <p className="text-xs text-gray-500">{c.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
