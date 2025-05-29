'use client';
import React, { useState } from 'react';
import CustomModal from '@/components/ui/custom-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MasterCardIcon from '@/components/Icon/MasterCardIcon';
import PaymentHistory from '../_Components/PaymentHistory';

interface CardDetails {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolderName: string;
}

export default function PaymentSettings() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cards, setCards] = useState<CardDetails[]>([]);
    const [newCard, setNewCard] = useState<CardDetails>({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: '',
    });

    const handleAddCard = () => {
        setCards([...cards, newCard]);
        setNewCard({
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            cardHolderName: '',
        });
        setIsModalOpen(false);
    };

    const handleDeleteCard = (index: number) => {
        setCards(cards.filter((_, i) => i !== index));
    };

    return (
        <div className="">
            <h1 className="text-2xl font-semibold mb-6">Payment Settings</h1>


            <div className='bg-white rounded-lg p-5'>
                <h2 className="text-lg font-medium ">Card Center</h2>
                <div>
                    {cards.length === 0 ? (
                        // Show only Add Card button when no cards exist
                        <div className="flex items-center justify-center bg-[#FAFAFD] rounded-lg p-20 mt-5 border">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex flex-col items-center cursor-pointer justify-center text-gray-500"
                            >
                                <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center mb-2">
                                    <span className="text-2xl">+</span>
                                </div>
                                <span>Add Card</span>
                            </button>
                        </div>
                    ) : (
                        // Show grid layout when cards exist
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
                            {/* Add Card Button - First Item */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="h-[200px] border  border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50"
                            >
                                <span className="text-2xl mb-2">+</span>
                                <span>Add Card</span>
                            </button>

                            {/* Existing Cards */}
                            {cards.map((card, index) => (
                                <div key={index} className="bg-white p-2 rounded-lg shadow-sm h-[200px]">
                                    <div className="space-y-4 w-full">
                                        {/* VISA Logo and Dropdown */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#1A1F71] font-bold text-xl">VISA</span>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="text-gray-400 cursor-pointer hover:text-gray-600">
                                                    ⋮
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-32">
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteCard(index)}
                                                        className="text-red-600 cursor-pointer"
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Card Number Section */}
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Card Number</p>
                                            <p className="text-lg">{card.cardNumber}</p>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200"></div>

                                        {/* Bottom Section */}
                                        <div className="flex justify-between items-start pt-2">
                                            <div className="space-y-1">
                                                <p>{card.expiryDate}</p>
                                                <p className="text-gray-600">{card.cardHolderName}</p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-sm text-gray-500">CVV/CVC</p>
                                                <p>{card.cvv}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <PaymentHistory />

            {/* Add Card Modal */}
            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Card"
            >
                <div className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-gray-700 mb-2 block">Card Number</label>
                            <div className="relative">
                                <Input
                                    value={newCard.cardNumber}
                                    onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                                    placeholder="1234 5678 9876 8765"
                                    className="pr-10 rounded-lg border-gray-200"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <MasterCardIcon />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-700 mb-2 block">Expiry Date</label>
                            <div className="relative">
                                <Input
                                    value={newCard.expiryDate}
                                    onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                                    placeholder="05/26"
                                    className="rounded-lg border-gray-200 pr-10"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-gray-700 mb-2 block">CVV/CVC</label>
                            <div className="relative">
                                <Input
                                    value={newCard.cvv}
                                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                                    placeholder="678"
                                    type="password"
                                    className="rounded-lg border-gray-200 pr-10"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
                                        <path d="M12 17a2 2 0 100-4 2 2 0 000 4z" />
                                        <path d="M2 17a2 2 0 100-4 2 2 0 000 4z" />
                                        <path d="M22 17a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-700 mb-2 block">Card Holder Name</label>
                            <Input
                                value={newCard.cardHolderName}
                                onChange={(e) => setNewCard({ ...newCard, cardHolderName: e.target.value })}
                                placeholder="Lorri Warf"
                                className="rounded-lg border-gray-200"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsModalOpen(false)}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddCard}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6"
                        >
                            Add Card
                        </Button>
                    </div>
                </div>
            </CustomModal>
        </div>
    );
}
