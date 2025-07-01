import axiosClient from "@/lib/axisoClients";

// add card with Stripe Elements (secure)
// {
//     "billing_name": "Sadman Sakib",
//     "card_number": "4444", // Only last 4 digits for security
//     "card_cvc": "***", // Not available for security
//     "card_exp_month": "12",
//     "card_exp_year": "32",
//     "payment_method_id": "pm_1234567890", // Stripe payment method ID
//     "stripe_payment_method_id": "pm_1234567890" // Additional field for API
// }

// add card to database with Stripe integration

export const addCard = async (data: any) => {
    try {
        const response = await axiosClient.post('/api/wallet/cards', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// get cards
export const getCards = async (): Promise<any> => {
    try {
        const response = await axiosClient.get<any>("/api/wallet/cards");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// set default card
export const setDefaultCard = async (cardId: string) => {
    try {
        const response = await axiosClient.put(`/api/wallet/cards/${cardId}/default`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// delete card
export const deleteCard = async (cardId: string) => {
    try {
        const response = await axiosClient.delete(`/api/wallet/cards/${cardId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};