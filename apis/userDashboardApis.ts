import axiosClient from "@/lib/axisoClients";

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

// Contact interface
interface Contact {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    address: string;
    birthday_date?: string;
}

// add contact
export const addContact = async (data: {
    name: string;
    email: string;
    phone_number: string;
    address: string;
    birthday_date?: string;
}): Promise<ApiResponse> => {
    try {
        const response = await axiosClient.post<ApiResponse>("/api/gift-recipients", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// get contacts
export const getContacts = async (): Promise<ApiResponse<Contact[]>> => {
    try {
        const response = await axiosClient.get<ApiResponse<Contact[]>>("/api/gift-recipients");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// update contact
export const updateContact = async (id: number, data: {
    name: string;
    email: string;
    phone_number: string;
    address: string;
    birthday_date?: string;
}): Promise<ApiResponse> => {
    try {
        const response = await axiosClient.patch<ApiResponse>(`/api/gift-recipients/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// delete contact
export const deleteContact = async (id: number): Promise<ApiResponse> => {
    try {
        const response = await axiosClient.delete<ApiResponse>(`/api/gift-recipients/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
