'use client';
import React, { useState, useEffect } from 'react';
import CustomModal from '@/components/ui/custom-modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MasterCardIcon from '@/components/Icon/MasterCardIcon';
import PaymentHistory from '../_Components/PaymentHistory';
import { getCards, deleteCard, setDefaultCard } from '@/apis/paymentsApis';
import AddBankCard from '../_Components/AddBankCard';
import creditCardType from 'credit-card-type';

interface CardDetails {
    id: string;
    payment_method_id: string;
    is_default: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    card_details: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
        country: string;
        funding: string;
    };
    billing_details: {
        address: {
            city: string | null;
            country: string | null;
            line1: string | null;
            line2: string | null;
            postal_code: string | null;
            state: string | null;
        };
        email: string | null;
        name: string | null;
        phone: string | null;
        tax_id: string | null;
    };
}

export default function PaymentSettings() {
    const [cards, setCards] = useState<CardDetails[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingCards, setLoadingCards] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        fetchCards();

    }, []);

    const fetchCards = async () => {
        try {
            setInitialLoading(true);
            setError(null);
            const response = await getCards();
            if (response.success && response.data) {
                setCards(response.data);
            } else {
                setError('Failed to fetch cards');
            }
        } catch (error) {
            console.error('Error fetching cards:', error);
            setError('Error loading cards');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        try {
            setLoadingCards(prev => ({ ...prev, [cardId]: true }));
            await deleteCard(cardId);
            await fetchCards();
        } catch (error) {
            console.error('Error deleting card:', error);
            setError('Failed to delete card');
        } finally {
            setLoadingCards(prev => ({ ...prev, [cardId]: false }));
        }
    };

    const handleSetDefaultCard = async (cardId: string) => {
        try {
            setLoadingCards(prev => ({ ...prev, [cardId]: true }));
            await setDefaultCard(cardId);
            await fetchCards();
        } catch (error) {
            console.error('Error setting default card:', error);
            setError('Failed to set default card');
        } finally {
            setLoadingCards(prev => ({ ...prev, [cardId]: false }));
        }
    };

    const getCardBrandIcon = (brand: string, last4?: string) => {
        // If we have the last4 digits, try to detect the card type
        if (last4) {
            try {
                // Create a sample card number with the last4 digits
                const sampleCardNumber = '000000000000' + last4;
                const cardTypes = creditCardType(sampleCardNumber);
                
                if (cardTypes.length > 0) {
                    const detectedBrand = cardTypes[0].type;
                    switch (detectedBrand.toLowerCase()) {
                        case 'mastercard':
                            return <MasterCardIcon />;
                        case 'visa':
                            return <span className="text-[#1A1F71] font-bold text-xl">VISA</span>;
                        case 'american-express':
                        case 'amex':
                            return <span className="text-[#006FCF] font-bold text-xl">AMEX</span>;
                        case 'discover':
                            return <span className="text-[#FF6000] font-bold text-xl">DISCOVER</span>;
                        case 'jcb':
                            return <span className="text-[#0B4EA2] font-bold text-xl">JCB</span>;
                        case 'unionpay':
                            return <span className="text-[#E21836] font-bold text-xl">UNIONPAY</span>;
                        case 'maestro':
                            return <span className="text-[#0099DE] font-bold text-xl">MAESTRO</span>;
                        default:
                            return <span className="text-gray-700 font-bold text-xl">{detectedBrand.toUpperCase()}</span>;
                    }
                }
            } catch (error) {
                console.log('Error detecting card type:', error);
            }
        }
        
        // Fallback to the original brand detection
        switch (brand.toLowerCase()) {
            case 'mastercard':
                return <MasterCardIcon />;
            case 'visa':
                return <span className="text-[#1A1F71] font-bold text-xl">VISA</span>;
            case 'amex':
            case 'american-express':
                return <span className="text-[#006FCF] font-bold text-xl">AMEX</span>;
            case 'discover':
                return <span className="text-[#FF6000] font-bold text-xl">DISCOVER</span>;
            case 'jcb':
                return <span className="text-[#0B4EA2] font-bold text-xl">JCB</span>;
            case 'unionpay':
                return <span className="text-[#E21836] font-bold text-xl">UNIONPAY</span>;
            case 'maestro':
                return <span className="text-[#0099DE] font-bold text-xl">MAESTRO</span>;
            default:
                return <span className="text-gray-700 font-bold text-xl">{brand.toUpperCase()}</span>;
        }
    };

    const formatExpiryDate = (month: number, year: number) => {
        const formattedMonth = month.toString().padStart(2, '0');
        const formattedYear = year.toString().slice(-2);
        return `${formattedMonth}/${formattedYear}`;
    };

    const maskCardNumber = (last4: string) => {
        return `**** **** **** ${last4}`;
    };

    return (
        <div className="">
            <h1 className='text-3xl font-bold text-[#232323] mb-6'>Payment Settings</h1>

            <div className='bg-white rounded-lg p-5'>
                <h2 className="text-lg font-medium">Card Center</h2>
                <div>
                    {initialLoading ? (
                        <div className="flex items-center justify-center bg-[#FAFAFD] rounded-lg p-20 mt-5 border">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                                <p className="text-gray-500">Loading cards...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center bg-[#FAFAFD] rounded-lg p-20 mt-5 border">
                            <div className="text-center">
                                <p className="text-red-500 mb-2">{error}</p>
                                <Button onClick={fetchCards} variant="outline">
                                    Try Again
                                </Button>
                            </div>
                        </div>
                    ) : cards.length === 0 ? (
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
                                className="h-[200px] border border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50"
                            >
                                <span className="text-2xl mb-2">+</span>
                                <span>Add Card</span>
                            </button>

                            {/* Cards */}
                            {cards.map((card, index) => {
                                const isCardLoading = loadingCards[card.id];
                                return (
                                    <div key={card.id} className={`bg-white p-4 rounded-lg shadow-sm h-[200px] border relative ${isCardLoading ? 'opacity-50' : ''}`}>
                                        {isCardLoading && (
                                            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                                            </div>
                                        )}
                                        <div className="space-y-4 w-full h-full flex flex-col">
                                            {/* Card Brand, Default Badge, and Dropdown */}
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    {getCardBrandIcon(card.card_details.brand, card.card_details.last4)}
                                                    {card.is_default && (
                                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        className="text-gray-400 cursor-pointer hover:text-gray-600"
                                                        disabled={isCardLoading}
                                                    >
                                                        ⋮
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-32">
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteCard(card.id)}
                                                            className="text-red-600 cursor-pointer"
                                                            disabled={isCardLoading}
                                                        >
                                                            {loadingCards[card.id] ? 'Deleting...' : 'Delete'}
                                                        </DropdownMenuItem>
                                                        {!card.is_default && (
                                                            <DropdownMenuItem
                                                                onClick={() => handleSetDefaultCard(card.id)}
                                                                className="text-blue-600 cursor-pointer"
                                                                disabled={isCardLoading}
                                                            >
                                                                {loadingCards[card.id] ? 'Setting...' : 'Set as Default'}
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {/* Card Number Section */}
                                            <div className="space-y-1 flex-grow">
                                                <p className="text-sm text-gray-500">Card Number</p>
                                                <p className="text-lg font-mono">{maskCardNumber(card.card_details.last4)}</p>
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-gray-200"></div>

                                            {/* Bottom Section */}
                                            <div className="flex justify-between items-start pt-2">
                                                <div className="space-y-1">
                                                    <p className="text-sm">{formatExpiryDate(card.card_details.exp_month, card.card_details.exp_year)}</p>
                                                    <p className="text-gray-600 text-sm">{card.billing_details.name || 'Card Holder'}</p>
                                                </div>
                                                <div className="text-right space-y-1">
                                                    <p className="text-sm text-gray-500">Type</p>
                                                    <p className="text-xs capitalize">{card.card_details.funding}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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
                <AddBankCard
                    setIsModalOpen={setIsModalOpen}
                    onCardAdded={fetchCards}
                />
            </CustomModal>
        </div>
    );
}

