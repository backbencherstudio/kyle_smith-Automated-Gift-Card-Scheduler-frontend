import axiosClient from "@/lib/axisoClients";

// Helper function to extract message from API response
const extractMessage = (response: any): string => {
    if (typeof response.message === 'string') {
        return response.message;
    }
    if (response.message?.message) {
        const message = response.message.message;
        return Array.isArray(message) ? message[0] : message;
    }
    return 'An error occurred';
};

interface ApiResponse<T = any> {
    success: boolean;
    message: string | {
        message: string | string[];
        error?: string;
        statusCode?: number;
    };
    data?: T;
}

// Contact interface
interface Contact {
    id: string;
    name: string;
    email: string;
    phone_number: string | null;
    address: string | null;
    birthday_date?: string;
    created_at: string;
    updated_at: string;
}

// Paginated response interface
interface PaginatedApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Gift card denomination interface
interface GiftCardDenomination {
    face_value: string;
    available_count: number;
    selling_price: string;
}

// Gift card interface
interface GiftCard {
    id: string;
    name: string;
    logo_url: string;
    description: string;
    available_denominations: GiftCardDenomination[];
    price_range: {
        min: string;
        max: string;
    };
    total_available_cards: number;
}

// Gift cards response interface
interface GiftCardsResponse {
    success: boolean;
    data?: GiftCard[];
    total: number;
}

// Schedule user data interface
interface ScheduleUserData {
    name: string;
    email: string;
    address: string;
    birthday_display: string;
    birthday_full: string;
    delivery_status: string;
    isUpcoming: boolean;
    total_amount: string;
}

// Paginated schedule response interface
interface PaginatedScheduleResponse {
    success: boolean;
    data?: ScheduleUserData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// add contact
export const addContact = async (data: {
    name: string;
    email: string;
    phone_number: string;
    address: string;
    birthday_date?: string;
}): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
        const response = await axiosClient.post<ApiResponse>("/api/gift-recipients", data);
        return {
            success: response.data.success,
            message: extractMessage(response.data),
            data: response.data.data
        };
    } catch (error) {
        throw error;
    }
};

// get contacts
export const getContacts = async (params?: {
    search?: string;
    page?: number;
    limit?: number;
}): Promise<PaginatedApiResponse<Contact[]>> => {
    try {
        const queryParams = new URLSearchParams();

        if (params?.search) {
            queryParams.append('search', params.search);
        }
        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        const url = `/api/gift-recipients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await axiosClient.get<PaginatedApiResponse<Contact[]>>(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// update contact
export const updateContact = async (id: string, data: {
    name: string;
    email: string;
    phone_number: string;
    address: string;
    birthday_date?: string;
}): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
        const response = await axiosClient.patch<ApiResponse>(`/api/gift-recipients/${id}`, data);
        return {
            success: response.data.success,
            message: extractMessage(response.data),
            data: response.data.data
        };
    } catch (error) {
        throw error;
    }
};

// delete contact
export const deleteContact = async (id: string): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
        const response = await axiosClient.delete<ApiResponse>(`/api/gift-recipients/${id}`);
        return {
            success: response.data.success,
            message: extractMessage(response.data),
            data: response.data.data
        };
    } catch (error) {
        throw error;
    }
};

// get schedules user data 
export const getSchedulesUserData = async (): Promise<PaginatedScheduleResponse> => {
    try {
        const response = await axiosClient.get<PaginatedScheduleResponse>("/api/gift-recipients/with-gifts");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// gift recipient with gifts
export const getGiftRecipientWithGifts = async (): Promise<GiftCardsResponse> => {
    try {
        const response = await axiosClient.get<GiftCardsResponse>("/api/gift-cards/browse");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// create gift recipient
export const createGiftRecipient = async (data: {
    vendor_id: string;
    amount: number;
    recipient: {
        name: string;
        email: string;
        Birthday: string;
        birthday?: string;
    };
    is_notify: boolean;
    send_gift_date: string;
    custom_message: string;
}): Promise<ApiResponse> => {
    try {
        const response = await axiosClient.post<ApiResponse>("/api/gift-scheduling", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};



// get my gifts
export const getMyGifts = async (): Promise<ApiResponse> => {
    try {
        const response = await axiosClient.get<ApiResponse>("/api/queue-monitoring/my-gifts");
        return response.data;
    } catch (error) {
        throw error;
    }
};


