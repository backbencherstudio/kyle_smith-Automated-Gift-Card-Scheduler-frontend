import React, { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getGiftRecipientWithGifts } from "@/apis/userDashboardApis";
import Image from "next/image";
import { CustomToast } from '@/lib/Toast/CustomToast';

interface GiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedUser: any;
    onSubmit: (e: any) => void;
}

const formatBirthdayDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
    });
};

export default function GiftModal({ isOpen, onClose, selectedUser, onSubmit }: GiftModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedGiftCard, setSelectedGiftCard] = useState('');
    const [selectedAmount, setSelectedAmount] = useState('');
    const [showAmountOptions, setShowAmountOptions] = useState(false);
    const [giftCards, setGiftCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSendDate, setSelectedSendDate] = useState<Date | null>(null);

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
        watch,
    } = useForm();

    // Watch the gift send date field
    const giftSendDate = watch('giftSendDate');

    // Fetch gift cards when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchGiftCards();
        }
    }, [isOpen]);

    // Reset modal state when modal opens/closes or user changes
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1);
            setSelectedGiftCard('');
            setSelectedAmount('');
            setShowAmountOptions(false);
            setSelectedSendDate(null);
            reset(); // Reset form data
        }
    }, [isOpen, selectedUser, reset]);

    const fetchGiftCards = async () => {
        try {
            setLoading(true);
            const response = await getGiftRecipientWithGifts();
            if (response.success && response.data) {
                setGiftCards(response.data);
            }
        } catch (error) {
            console.error('Error fetching gift cards:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!selectedUser) return null;

    const steps = [
        { id: 1, title: "Gift Card Selection" },
        { id: 2, title: "User Info & Send Date" },
        { id: 3, title: "Confirmation" }
    ];

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleGiftCardSelect = (cardId: string) => {
        setSelectedGiftCard(cardId);
        setSelectedAmount('');
        setShowAmountOptions(true);
    };

    const handleAmountSelect = (amount: string) => {
        setSelectedAmount(amount);
    };

    const handleBackToCards = () => {
        setShowAmountOptions(false);
        setSelectedGiftCard('');
        setSelectedAmount('');
    };

    const handleFinalSubmit = () => {
        if (currentStep === 3) {
            const selectedCard = giftCards.find(card => card.id === selectedGiftCard);
            const selectedDenomination = selectedCard?.available_denominations.find(
                (denom: any) => denom.face_value === selectedAmount
            );

            CustomToast.show('Gift set successfully');

            // Close the modal after showing demo
            onClose();
        }
    };

    const getSelectedCardInfo = () => {
        return giftCards.find(card => card.id === selectedGiftCard);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">
                                {showAmountOptions ? 'Select Amount' : 'Select Gift Card'}
                            </h3>
                            <p className="text-gray-600">
                                {showAmountOptions
                                    ? `Choose amount for ${getSelectedCardInfo()?.name}`
                                    : `Choose a gift card for ${selectedUser.name}`
                                }
                            </p>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="text-gray-600">Loading gift cards...</div>
                            </div>
                        ) : !showAmountOptions ? (
                            // Gift Card Ranges
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    {giftCards.map((card) => (
                                        <div
                                            key={card.id}
                                            className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-all"
                                            onClick={() => handleGiftCardSelect(card.id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    {card.logo_url && (
                                                        <div className="w-12 h-12 relative">
                                                            <Image
                                                                src={card.logo_url}
                                                                alt={card.name}
                                                                fill
                                                                className="object-contain rounded"
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="font-semibold">{card.name}</h4>
                                                        <p className="text-gray-600 text-sm">{card.description}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-lg text-blue-600">
                                                        ${card.price_range.min} - ${card.price_range.max}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {card.total_available_cards} cards available
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Amount Selection
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={handleBackToCards}
                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Back to gift cards
                                    </button>
                                    <div className="text-sm text-gray-600">
                                        {getSelectedCardInfo()?.name} - ${getSelectedCardInfo()?.price_range.min} - ${getSelectedCardInfo()?.price_range.max}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {getSelectedCardInfo()?.available_denominations.map((denomination: any) => (
                                        <div
                                            key={denomination.face_value}
                                            className={cn(
                                                "p-3 border-2 rounded-lg cursor-pointer text-center transition-all",
                                                selectedAmount === denomination.face_value
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-gray-200 hover:border-gray-300"
                                            )}
                                            onClick={() => handleAmountSelect(denomination.face_value)}
                                        >
                                            <div className="space-y-1">
                                                <span className="font-semibold block">${denomination.face_value}</span>
                                                <span className="text-xs text-gray-500 block">
                                                    ${denomination.selling_price}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">User Information & Send Date</h3>
                            <p className="text-gray-600">Review details and set delivery date</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Name</label>
                                <Input
                                    disabled
                                    value={selectedUser.name}
                                    className="bg-gray-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Address</label>
                                <Input
                                    value={selectedUser.address || ''}
                                    disabled
                                    className="bg-gray-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Email</label>
                                <Input
                                    type="email"
                                    value={selectedUser.email || ''}
                                    disabled
                                    className="bg-gray-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Birthday</label>
                                <Input
                                    value={selectedUser.birthday_full || formatBirthdayDisplay(selectedUser.birthday || selectedUser.start)}
                                    disabled
                                    className="bg-gray-50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Gift Send Date</label>
                            <Controller
                                name="giftSendDate"
                                control={control}
                                rules={{ required: "Gift send date is required" }}
                                render={({ field }) => (
                                    <Popover modal={true}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ?
                                                    format(typeof field.value === 'string' ? new Date(field.value) : field.value, "dd/MM/yyyy")
                                                    : "Select gift send date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                            side="bottom"
                                            sideOffset={4}
                                        >
                                            <div className="calendar-wrapper" onClick={(e) => e.stopPropagation()}>
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ?
                                                        (typeof field.value === 'string' ? new Date(field.value) : field.value)
                                                        : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            field.onChange(date);
                                                            setSelectedSendDate(date);
                                                        }
                                                    }}
                                                    disabled={(date) => {
                                                        const today = new Date();
                                                        today.setHours(0, 0, 0, 0);
                                                        return date < today;
                                                    }}
                                                    initialFocus
                                                    className="rounded-md border"
                                                    fromDate={new Date()}
                                                />
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.giftSendDate && (
                                <p className="text-red-500 text-xs">{errors.giftSendDate.message as string}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Message (Optional)</label>
                            <Textarea
                                placeholder="Enter your message"
                                rows={3}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="notify" />
                            <label
                                htmlFor="notify"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Notify me on delivery
                            </label>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">Confirmation</h3>
                            <p className="text-gray-600">Review your gift details</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div className="flex justify-between">
                                <span className="font-medium">Recipient:</span>
                                <span>{selectedUser.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Gift Card:</span>
                                <span>{getSelectedCardInfo()?.name} - ${selectedAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Send Date:</span>
                                <span>{selectedSendDate ? format(selectedSendDate, "dd/MM/yyyy") : "Selected date will appear here"}</span>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Set Gift</DialogTitle>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                                    currentStep >= step.id
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-600"
                                )}>
                                    {step.id}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={cn(
                                        "w-16 h-1 mx-2",
                                        currentStep > step.id ? "bg-blue-500" : "bg-gray-200"
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">
                            {steps[currentStep - 1].title}
                        </p>
                    </div>
                </div>

                {/* Step Content */}
                <div className="space-y-4 border-t border-gray-200 pt-6">
                    {renderStepContent()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between space-x-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={currentStep === 1 ? onClose : handlePrev}
                        className="cursor-pointer"
                    >
                        {currentStep === 1 ? 'Cancel' : 'Previous'}
                    </Button>
                    <Button
                        onClick={currentStep === 3 ? handleFinalSubmit : handleNext}
                        className="bg-[#FBDE6E] cursor-pointer text-gray-900 hover:bg-yellow-500"
                        disabled={currentStep === 1 && (!selectedGiftCard || !selectedAmount)}
                    >
                        {currentStep === 3 ? 'Set Gift' : 'Next'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
