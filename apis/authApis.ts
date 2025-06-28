import axiosClient from "@/lib/axisoClients";

// API Types
interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone_number: string;
    address: string;
}

interface LoginRequest {
    email: string;
    password: string;
}


interface User {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    address: string;
}

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

interface RegisterResponse extends ApiResponse<{
    user: User;
    expired_at: number;
}> { }

interface LoginResponse extends ApiResponse<{
    user: User;
    token: string;
}> { }

interface OtpVerificationResponse extends ApiResponse<{
    user: User;
    token: string;
}> { }

interface ResendOtpResponse extends ApiResponse<{
    email: string;
    message: string;
}> { }

export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const response = await axiosClient.post<RegisterResponse>("/api/auth/register", userData);
        return response.data;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

// otp verification
export const otpVerification = async (email: string, token: string): Promise<OtpVerificationResponse> => {
    try {
        const response = await axiosClient.post<OtpVerificationResponse>("/api/auth/verify-email", { email, token });
        return response.data;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

// resend otp for registration
export const resendOtp = async (email: string): Promise<ResendOtpResponse> => {
    try {
        const response = await axiosClient.post<ResendOtpResponse>("/api/auth/resend-verification-email", { email });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};



export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await axiosClient.post<LoginResponse>("/api/auth/login", credentials);
        return response.data;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};


