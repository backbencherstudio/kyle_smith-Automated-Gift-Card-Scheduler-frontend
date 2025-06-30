import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getGiftRecipientWithGifts, createGiftRecipient } from "@/apis/userDashboardApis";
import Image from "next/image";
import { CustomToast } from '@/lib/Toast/CustomToast';

interface GiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedUser: any;
    onSubmit: (e: any) => void;
}

// Constants
const STEPS = [
    { id: 1, title: "Gift Card Selection" },
    { id: 2, title: "User Info & Send Date" },
    { id: 3, title: "Confirmation" }
] as const;

const CARDS_PER_PAGE = 3;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Utility functions
const formatBirthdayDisplay = (dateString: string): string => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting birthday display:', error);
        return '';
    }
};

const parseBirthdayDate = (dateString: string): string => {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return format(date, 'yyyy-MM-dd');
    } catch (error) {
        console.error('Error parsing birthday date:', error);
        return '';
    }
};

export default function GiftModal({ isOpen, onClose, selectedUser, onSubmit }: GiftModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedGiftCard, setSelectedGiftCard] = useState('');
    const [selectedAmount, setSelectedAmount] = useState('');
    const [showAmountOptions, setShowAmountOptions] = useState(false);
    const [giftCards, setGiftCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedSendDate, setSelectedSendDate] = useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
        watch,
        setValue,
    } = useForm({
        defaultValues: {
            giftSendDate: null,
            customMessage: '',
            isNotify: false
        }
    });

    // Watch form fields
    const giftSendDate = watch('giftSendDate');
    const customMessage = watch('customMessage');
    const isNotify = watch('isNotify');

    // Memoized selected card info
    const selectedCardInfo = useMemo(() =>
        giftCards.find(card => card.id === selectedGiftCard),
        [giftCards, selectedGiftCard]
    );

    // Memoized pagination calculations
    const paginationData = useMemo(() => {
        const totalPages = Math.ceil(giftCards.length / CARDS_PER_PAGE);
        const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
        const endIndex = startIndex + CARDS_PER_PAGE;
        const currentCards = giftCards.slice(startIndex, endIndex);

        return { totalPages, currentCards };
    }, [giftCards, currentPage]);

    // Reset modal state when opened
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1);
            setSelectedGiftCard('');
            setSelectedAmount('');
            setShowAmountOptions(false);
            setSelectedSendDate(null);
            setCurrentPage(1);
            reset();
        }
    }, [isOpen, selectedUser, reset]);

    // Fetch gift cards when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchGiftCards();
        }
    }, [isOpen]);

    const fetchGiftCards = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getGiftRecipientWithGifts();
            if (response.success && response.data) {
                setGiftCards(response.data);
            } else {
                CustomToast.show('Failed to load gift cards');
            }
        } catch (error) {
            console.error('Error fetching gift cards:', error);
            CustomToast.show('Error loading gift cards');
        } finally {
            setLoading(false);
        }
    }, []);

    // Navigation handlers
    const handleNext = useCallback(() => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    }, [currentStep]);

    const handlePrev = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }, [currentStep]);

    const handleGiftCardSelect = useCallback((cardId: string) => {
        setSelectedGiftCard(cardId);
        setSelectedAmount('');
        setShowAmountOptions(true);
    }, []);

    const handleAmountSelect = useCallback((amount: string) => {
        setSelectedAmount(amount);
    }, []);

    const handleBackToCards = useCallback(() => {
        setShowAmountOptions(false);
        setSelectedGiftCard('');
        setSelectedAmount('');
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    // Form submission handler
    const handleFinalSubmit = useCallback(async () => {
        if (currentStep !== 3) return;

        try {
            setSubmitting(true);

            // Validation
            if (!selectedCardInfo || !selectedSendDate) {
                CustomToast.show('Please complete all required fields');
                return;
            }

            // Parse birthday date
            let birthdayDate = '';
            if (selectedUser.birthday_full) {
                birthdayDate = parseBirthdayDate(selectedUser.birthday_full);
            } else if (selectedUser.birthday) {
                birthdayDate = parseBirthdayDate(selectedUser.birthday);
            } else if (selectedUser.start) {
                birthdayDate = parseBirthdayDate(selectedUser.start);
            }

            if (!birthdayDate) {
                console.error('Could not parse birthday date from:', {
                    birthday_full: selectedUser.birthday_full,
                    birthday: selectedUser.birthday,
                    start: selectedUser.start
                });
                CustomToast.show('Birthday date is required');
                return;
            }

            // Validate date format
            if (!DATE_REGEX.test(birthdayDate)) {
                console.error('Invalid birthday date format:', birthdayDate);
                CustomToast.show('Invalid birthday date format');
                return;
            }

            // Prepare gift data
            const giftData = {
                vendor_id: selectedGiftCard,
                amount: parseInt(selectedAmount),
                recipient: {
                    name: selectedUser.name,
                    email: selectedUser.email || '',
                    Birthday: birthdayDate,
                    birthday: birthdayDate
                },
                is_notify: isNotify,
                send_gift_date: format(selectedSendDate, 'yyyy-MM-dd'),
                custom_message: customMessage || ''
            };

            const response = await createGiftRecipient(giftData);

            if (response.success) {
                CustomToast.show('Gift scheduled successfully!');
                onClose();
            } else {
                // Handle different message structures
                let errorMessage = 'Failed to schedule gift';
                if (typeof response.message === 'string') {
                    errorMessage = response.message;
                } else if (response.message && typeof response.message === 'object') {
                    const messageObj = response.message as any;
                    if (messageObj.message && Array.isArray(messageObj.message)) {
                        errorMessage = messageObj.message.join(', ');
                    } else if (messageObj.message && typeof messageObj.message === 'string') {
                        errorMessage = messageObj.message;
                    }
                }
                CustomToast.show(errorMessage);
            }
        } catch (error) {
            console.error('Error creating gift recipient:', error);
            CustomToast.show('Failed to schedule gift. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }, [
        currentStep,
        selectedCardInfo,
        selectedSendDate,
        selectedUser,
        selectedGiftCard,
        selectedAmount,
        isNotify,
        customMessage,
        onClose
    ]);

    if (!selectedUser) return null;

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
                                    ? `Choose amount for ${selectedCardInfo?.name}`
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
                            <div className="space-y-3 md:space-y-4">
                                {paginationData.currentCards.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 gap-3 md:gap-4">
                                            {paginationData.currentCards.map((card) => (
                                                <div
                                                    key={card.id}
                                                    className="p-3 md:p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-all"
                                                    onClick={() => handleGiftCardSelect(card.id)}
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                                                        <div className="flex items-center space-x-3">
                                                            {card.logo_url && (
                                                                <div className="w-10 h-10 md:w-12 md:h-12 relative">
                                                                    <Image
                                                                        src={card.logo_url}
                                                                        alt={card.name}
                                                                        fill
                                                                        className="object-contain rounded"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <h4 className="font-semibold text-sm md:text-base">{card.name}</h4>
                                                                <p className="text-gray-600 text-xs md:text-sm">{card.description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-left md:text-right">
                                                            <p className="font-bold text-base md:text-lg text-blue-600">
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

                                        {/* Pagination Controls */}
                                        {paginationData.totalPages > 1 && (
                                            <div className="flex justify-center items-center space-x-2 mt-4">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className={cn(
                                                        "px-3 py-1 text-sm rounded-md transition-colors",
                                                        currentPage === 1
                                                            ? "text-gray-400 cursor-not-allowed"
                                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                    )}
                                                >
                                                    Previous
                                                </button>

                                                <div className="flex space-x-1">
                                                    {Array.from({ length: paginationData.totalPages }, (_, i) => i + 1).map((page) => (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            className={cn(
                                                                "w-8 h-8 text-sm rounded-md transition-colors",
                                                                currentPage === page
                                                                    ? "bg-[#FBDE6E] text-gray-900 font-semibold"
                                                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                            )}
                                                        >
                                                            {page}
                                                        </button>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === paginationData.totalPages}
                                                    className={cn(
                                                        "px-3 py-1 text-sm rounded-md transition-colors",
                                                        currentPage === paginationData.totalPages
                                                            ? "text-gray-400 cursor-not-allowed"
                                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                    )}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-500 mb-4">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Card not found</h3>
                                        <p className="text-gray-500">No gift cards are currently available.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Amount Selection
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={handleBackToCards}
                                        className="flex cursor-pointer items-center text-blue-600 hover:text-blue-800"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Back to gift cards
                                    </button>
                                    <div className="text-sm text-gray-600">
                                        {selectedCardInfo?.name} - ${selectedCardInfo?.price_range.min} - ${selectedCardInfo?.price_range.max}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                                    {selectedCardInfo?.available_denominations.map((denomination: any) => (
                                        <div
                                            key={denomination.face_value}
                                            className={cn(
                                                "p-2 md:p-3 border-2 rounded-lg cursor-pointer text-center transition-all",
                                                selectedAmount === denomination.face_value
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-gray-200 hover:border-gray-300"
                                            )}
                                            onClick={() => handleAmountSelect(denomination.face_value)}
                                        >
                                            <div className="space-y-1">
                                                <span className="font-semibold block text-sm md:text-base">${denomination.face_value}</span>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
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
                                                    "w-full justify-start text-left font-normal cursor-pointer",
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
                            <Controller
                                name="customMessage"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        placeholder="Enter your message"
                                        rows={3}
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Controller
                                name="isNotify"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id="notify"
                                        className='cursor-pointer'
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
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
                                <span>{selectedCardInfo?.name} - ${selectedAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Send Date:</span>
                                <span>{selectedSendDate ? format(selectedSendDate, "dd/MM/yyyy") : "Selected date will appear here"}</span>
                            </div>
                            {customMessage && (
                                <div className="flex justify-between">
                                    <span className="font-medium">Message:</span>
                                    <span className="text-sm">{customMessage}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="font-medium">Notification:</span>
                                <span>{isNotify ? 'Yes' : 'No'}</span>
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
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Set Gift</DialogTitle>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="mb-4 md:mb-6 w-full">
                    <div className="flex items-center justify-between mb-3 md:mb-4 w-full">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={cn(
                                    "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 relative",
                                    currentStep >= step.id
                                        ? "bg-[#FBDE6E] text-gray-900 shadow-lg"
                                        : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                                )}>
                                    {currentStep > step.id ? (
                                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        step.id
                                    )}
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className={cn(
                                        "w-8 md:w-16 lg:w-32 h-1 mx-1 md:mx-3 rounded-full transition-all duration-300",
                                        currentStep > step.id ? "bg-[#FBDE6E]" : "bg-gray-200"
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <p className="text-xs md:text-sm font-semibold text-gray-800">
                            {STEPS[currentStep - 1].title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Step {currentStep} of {STEPS.length}
                        </p>
                    </div>
                </div>

                {/* Step Content */}
                <div className="space-y-3 md:space-y-4 border-t border-gray-200 pt-4 md:pt-6">
                    {renderStepContent()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between space-x-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={currentStep === 1 ? onClose : handlePrev}
                        className="cursor-pointer text-xs md:text-sm px-3 md:px-4"
                        disabled={submitting}
                    >
                        {currentStep === 1 ? 'Cancel' : 'Previous'}
                    </Button>
                    <Button
                        onClick={currentStep === 3 ? handleFinalSubmit : handleNext}
                        className="bg-[#FBDE6E] cursor-pointer text-gray-900 hover:bg-yellow-500 text-xs md:text-sm px-3 md:px-4"
                        disabled={
                            (currentStep === 1 && (!selectedGiftCard || !selectedAmount)) ||
                            (currentStep === 2 && !selectedSendDate) ||
                            submitting
                        }
                    >
                        {submitting ? 'Scheduling...' : (currentStep === 3 ? 'Set Gift' : 'Next')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
