import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addCard } from '@/apis/paymentsApis';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';

interface AddBankCardProps {
    setIsModalOpen: (open: boolean) => void;
    onCardAdded: () => void;
}

export default function AddBankCard({ setIsModalOpen, onCardAdded }: AddBankCardProps) {
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [cardFocus, setCardFocus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [cardNumberError, setCardNumberError] = useState<string | null>(null);
    const [cardExpiryError, setCardExpiryError] = useState<string | null>(null);
    const [cardCvcError, setCardCvcError] = useState<string | null>(null);
    const [cardHolderError, setCardHolderError] = useState<string | null>(null);



    // CreditCardInput callbacks
    const handleCardNumberChangeFromCreditCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

        // Format with spaces every 4 digits
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');

        setCardNumber(value);

        // Basic validation
        const cleanNumber = value.replace(/\s/g, '');
        if (cleanNumber.length > 0 && cleanNumber.length < 13) {
            setCardNumberError('Card number must be at least 13 digits');
        } else if (cleanNumber.length > 19) {
            setCardNumberError('Card number cannot exceed 19 digits');
        } else if (cleanNumber.length === 16) {
            // Luhn algorithm validation for basic card number check
            if (!isValidCardNumber(cleanNumber)) {
                setCardNumberError('Invalid card number');
            } else {
                setCardNumberError(null);
            }
        } else {
            setCardNumberError(null);
        }
    };

    // Luhn algorithm for card number validation
    const isValidCardNumber = (cardNumber: string): boolean => {
        let sum = 0;
        let isEven = false;

        // Loop through values starting from the rightmost side
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    };

    const handleCardExpiryChangeFromCreditCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

        // Format as MM/YY
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }

        setCardExpiry(value);

        // Validation
        if (value.length === 5) {
            const [month, year] = value.split('/');
            const monthNum = parseInt(month);
            const yearNum = parseInt(year);
            const currentYear = new Date().getFullYear() % 100; // Get last 2 digits
            const currentMonth = new Date().getMonth() + 1;

            if (monthNum < 1 || monthNum > 12) {
                setCardExpiryError('Invalid month (01-12)');
            } else if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
                setCardExpiryError('Card has expired');
            } else {
                setCardExpiryError(null);
            }
        } else {
            setCardExpiryError(null);
        }
    };

    const handleCardCvcChangeFromCreditCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

        setCardCvc(value);

        // CVC validation (3-4 digits)
        if (value.length > 0 && value.length < 3) {
            setCardCvcError('CVC must be 3-4 digits');
        } else if (value.length > 4) {
            setCardCvcError('CVC cannot exceed 4 digits');
        } else {
            setCardCvcError(null);
        }
    };

    const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCardHolderName(value);

        // Real-time validation
        if (!value.trim()) {
            setCardHolderError('Card holder name is required');
        } else if (value.trim().length < 2) {
            setCardHolderError('Name must be at least 2 characters');
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
            setCardHolderError('Name can only contain letters and spaces');
        } else {
            setCardHolderError(null);
        }
    };

    const validateForm = () => {
        if (cardHolderError || cardNumberError || cardExpiryError || cardCvcError) {
            setError('Please fix the errors above');
            return false;
        }

        if (!cardHolderName.trim() || !cardNumber.replace(/\s/g, '') || !cardExpiry || !cardCvc) {
            setError('All fields are required');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Extract month and year from expiry
            const [month, year] = cardExpiry.split('/');

            // Prepare payload for your API
            const payload = {
                billing_name: cardHolderName.trim(),
                card_number: cardNumber.replace(/\s/g, ''),
                card_cvc: cardCvc,
                card_exp_month: month,
                card_exp_year: year
            };

            // console.log('Sending card data:', payload);

            const response = await addCard(payload);

            // console.log('Card added successfully:', response);

            setLoading(false);
            setIsModalOpen(false);
            onCardAdded();

            // Reset form
            setCardHolderName('');
            setCardNumber('');
            setCardExpiry('');
            setCardCvc('');

            setCardNumberError(null);
            setCardExpiryError(null);
            setCardCvcError(null);
            setCardHolderError(null);

        } catch (err: any) {
            console.error('Error adding card:', err);

            // Handle specific error messages
            let errorMessage = 'Failed to add card. Please try again.';

            if (err.response?.data?.message?.message) {
                errorMessage = err.response.data.message.message;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            setLoading(false);
        }
    };





    return (
        <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-700 mb-2 block">Card Information</label>

                    {/* Card Preview */}
                    <div className="mb-4 flex justify-center">
                        <Cards
                            cvc={cardCvc}
                            expiry={cardExpiry}
                            focused={cardFocus}
                            name={cardHolderName}
                            number={cardNumber}
                        />
                    </div>

                    <div className="space-y-4">
                        {/* Card Number - Full Width */}
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">Card Number</label>

                            <Input
                                type="tel"
                                name="number"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={handleCardNumberChangeFromCreditCardInput}
                                onFocus={(e) => setCardFocus(e.target.name)}
                                className={`w-full p-3 border rounded-lg ${cardNumberError ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400 focus:outline-none transition-colors duration-200`}
                                disabled={loading}
                                maxLength={23}
                            />
                            {cardNumberError && (
                                <div className="text-xs text-red-500 mt-1 flex items-center">
                                    <span className="mr-1">⚠</span>
                                    {cardNumberError}
                                </div>
                            )}
                        </div>

                        {/* Expiry and CVC - Half Width Each */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-600 mb-1 block">Expiry Date</label>
                                <Input
                                    type="tel"
                                    name="expiry"
                                    placeholder="MM/YY"
                                    value={cardExpiry}
                                    onChange={handleCardExpiryChangeFromCreditCardInput}
                                    onFocus={(e) => setCardFocus(e.target.name)}
                                    className={`w-full p-3 border rounded-lg ${cardExpiryError ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400 focus:outline-none transition-colors duration-200`}
                                    disabled={loading}
                                    maxLength={5}
                                />
                                {cardExpiryError && (
                                    <div className="text-xs text-red-500 mt-1 flex items-center">
                                        <span className="mr-1">⚠</span>
                                        {cardExpiryError}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 mb-1 block">CVC</label>
                                <Input
                                    type="tel"
                                    name="cvc"
                                    placeholder="CVC"
                                    value={cardCvc}
                                    onChange={handleCardCvcChangeFromCreditCardInput}
                                    onFocus={(e) => setCardFocus(e.target.name)}
                                    className={`w-full p-3 border rounded-lg ${cardCvcError ? 'border-red-400' : 'border-gray-200'} focus:border-blue-400 focus:outline-none transition-colors duration-200`}
                                    disabled={loading}
                                    maxLength={4}
                                />
                                {cardCvcError && (
                                    <div className="text-xs text-red-500 mt-1 flex items-center">
                                        <span className="mr-1">⚠</span>
                                        {cardCvcError}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-sm text-gray-700 mb-2 block">Card Holder Name</label>
                    <Input
                        type="text"
                        name="name"
                        value={cardHolderName}
                        onChange={handleCardHolderChange}
                        onFocus={(e) => setCardFocus(e.target.name)}
                        placeholder="John Doe"
                        className={`rounded-lg border-gray-200 ${cardHolderError ? 'border-red-400 focus:border-red-400' : 'focus:border-blue-400'}`}
                        required
                        disabled={loading}
                    />
                    {cardHolderError && (
                        <div className="text-xs text-red-500 mt-1 flex items-center">
                            <span className="mr-1">⚠</span>
                            {cardHolderError}
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200 flex items-center">
                    <span className="mr-2">⚠</span>
                    {error}
                </div>
            )}

            <div className="flex justify-between items-center pt-4">
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-600 hover:text-gray-800"
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading || !!(cardHolderError || cardNumberError || cardExpiryError || cardCvcError)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                            Adding...
                        </div>
                    ) : (
                        'Add Card'
                    )}
                </Button>
            </div>
        </form>
    );
}
