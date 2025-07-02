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

interface LoginResponse {
    success: boolean;
    message: string;
    authorization: {
        token: string;
        type: string;
    };
    type: string;
}

interface OtpVerificationResponse extends ApiResponse<{
    user: User;
    token: string;
}> { }

interface ResendOtpResponse extends ApiResponse<{
    email: string;
    message: string;
}> { }

interface ForgotPasswordResponse extends ApiResponse<{
    email: string;
    message: string;
    expired_at: number;
}> { }

interface ChangePasswordResponse extends ApiResponse<{
    email: string;
    password: string;
    token: string;
}> { }

interface MeResponse extends ApiResponse<{
    id: string;
    name: string;
    email: string;
    phone_number: string;
    avatar: string | null;
    address: string;
    type: string;
    gender: string | null;
    date_of_birth: string | null;
    created_at: string;
}> { }

export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const response = await axiosClient.post<RegisterResponse>("/api/auth/register", userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// otp verification
export const otpVerification = async (email: string, token: string): Promise<OtpVerificationResponse> => {
    try {
        const response = await axiosClient.post<OtpVerificationResponse>("/api/auth/verify-email", { email, token });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// resend otp for registration
export const resendOtp = async (email: string): Promise<ResendOtpResponse> => {
    try {
        const response = await axiosClient.post<ResendOtpResponse>("/api/auth/resend-verification-email", { email });
        return response.data;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

// forgot password
export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
    try {
        const response = await axiosClient.post<ForgotPasswordResponse>("/api/auth/forgot-password", { email });
        return response.data;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

// change password
export const ResetPassword = async (email: string, password: string, token: string): Promise<ChangePasswordResponse> => {
    try {
        const response = await axiosClient.post<ChangePasswordResponse>("/api/auth/reset-password", { email, password, token });
        return response.data;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await axiosClient.post<LoginResponse>("/api/auth/login", credentials);

        // Set localStorage if login is successful
        if (response.data.success && response.data.authorization?.token) {
            localStorage.setItem('token', response.data.authorization.token);
            localStorage.setItem('userType', response.data.type);
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

// getMe api
export const getMe = async (): Promise<MeResponse> => {
    try {
        const response = await axiosClient.get<MeResponse>("/api/auth/me");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// logout function
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
};

// update profile name , phone_number , address , date_of_birth  , image pass in body
export const updateProfile = async (data: {
    name?: string;
    phone_number?: string;
    address?: string;
    date_of_birth?: string | null;
    image?: string | null;
} | FormData): Promise<ApiResponse> => {
    try {
        const response = await axiosClient.patch<ApiResponse>("/api/auth/update", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// send email change verification token
export const sendEmailChangeToken = async (email: string): Promise<ApiResponse> => {
    try {
        const response = await axiosClient.post<ApiResponse>("/api/auth/request-email-change", { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// email change
export const emailChange = async (email: string, token: string): Promise<ApiResponse> => {
    try {
        const response = await axiosClient.post<ApiResponse>("/api/auth/change-email", { email, token });
        return response.data;
    } catch (error) {
        throw error;
    }
};


// change password
export const changePassword = async (old_password: string, new_password: string): Promise<ApiResponse> => {
    try {
        const response = await axiosClient.post<ApiResponse>("/api/auth/change-password", { old_password, new_password });
        return response.data;
    } catch (error) {
        throw error;
    }
};


// login with google - initiates OAuth flow
export const googleLogin = async (): Promise<void> => {
    try {
        // Redirect to backend OAuth URL
        const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://127.0.0.1:4000';
        window.location.href = `${baseURL}/api/auth/google`;
    } catch (error) {
        throw error;
    }
};


// handle google oauth redirect from backend
export const handleGoogleRedirect = async (token: string, type: string): Promise<void> => {
    try {
        localStorage.setItem('token', token);
        localStorage.setItem('userType', type);
    } catch (error) {
        throw error;
    }
};




