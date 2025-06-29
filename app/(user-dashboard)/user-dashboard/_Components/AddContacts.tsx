"use client"
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import CustomModal from "@/components/ui/custom-modal";
import { useEffect } from "react";

interface AddContactsProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    isUpdate?: boolean;
    onSubmit?: (data: any) => Promise<void>;
    loading?: boolean;
}

// Helper function to create a date without timezone issues
const createDateWithoutTime = (date: Date | string | undefined): Date | undefined => {
    if (!date) return undefined;
    
    const d = new Date(date);
    // Create a new date with year, month, day only (no time)
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// Helper function to format date without timezone issues
const formatDateWithoutTime = (date: Date | string | undefined): string => {
    if (!date) return "Select birthday";
    
    const d = createDateWithoutTime(date);
    if (!d) return "Select birthday";
    
    return format(d, "PPP");
};

export default function AddContacts({ isOpen, onClose, initialData, isUpdate = false, onSubmit, loading = false }: AddContactsProps) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm();

    // Reset form when modal opens/closes or initialData changes
    useEffect(() => {
        if (isOpen && initialData) {
            reset({
                name: initialData.name,
                address: initialData.address,
                email: initialData.email,
                phone_number: initialData.phone_number || '',
                birthday: initialData.birthday_date ? createDateWithoutTime(initialData.birthday_date) : undefined,
            });
        } else if (isOpen && !initialData) {
            reset({
                name: '',
                address: '',
                email: '',
                phone_number: '',
                birthday: undefined,
            });
        }
    }, [isOpen, initialData, reset]);

    const onSubmitForm = async (data: any) => {
        // Convert the date to proper format before submission
        const formattedData = {
            ...data,
            birthday_date: data.birthday ? format(data.birthday, 'yyyy-MM-dd') : undefined
        };
        
        if (onSubmit) {
            await onSubmit(formattedData);
        } else {
            console.log(formattedData);
            onClose();
        }
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Contact"
        >
            <div className="space-y-6 border-t border-gray-200 pt-6">
                {/* <p className="text-center text-md text-[#1D1F2C]">Contact with social media</p>

                <div className="flex justify-center gap-3">
                    <button
                        className="flex cursor-pointer items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50"
                        onClick={() => console.log("Sync Facebook")}
                    >
                        <FaFacebook className="text-blue-600" />
                        <span className="text-sm">Sync From Facebook</span>
                    </button>
                    <button
                        className="flex cursor-pointer items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50"
                        onClick={() => console.log("Connect Instagram")}
                    >
                        <FaInstagram className="text-pink-600" />
                        <span className="text-sm">Connect Instagram</span>
                    </button>
                </div> */}

                {/* <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-400">or</span>
                    </div>
                </div> */}

                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                placeholder="Enter Contact Name"
                                className="border-gray-200 bg-gray-50/50"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs">{errors.name.message as string}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Address</label>
                            <Input
                                placeholder="Enter Address"
                                className="border-gray-200 bg-gray-50/50"
                                {...register("address", { required: "Address is required" })}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-xs">{errors.address.message as string}</p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                placeholder="Enter Email"
                                className="border-gray-200 bg-gray-50/50"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs">{errors.email.message as string}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Phone Number</label>
                            <Input
                                placeholder="Enter Phone Number"
                                className="border-gray-200 bg-gray-50/50"
                                {...register("phone_number")}
                            />
                            {errors.phone_number && (
                                <p className="text-red-500 text-xs">{errors.phone_number.message as string}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Birthday</label>
                        <Controller
                            name="birthday"
                            control={control}
                            rules={{ required: "Birthday is required" }}
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
                                            {formatDateWithoutTime(field.value)}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                        side="bottom"
                                        sideOffset={4}
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value ? createDateWithoutTime(field.value) : undefined}
                                            onSelect={(date) => {
                                                // Create date without time to avoid timezone issues
                                                const dateWithoutTime = date ? createDateWithoutTime(date) : undefined;
                                                field.onChange(dateWithoutTime);
                                            }}
                                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                            initialFocus
                                            className="rounded-md border"
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                        {errors.birthday && (
                            <p className="text-red-500 text-xs">{errors.birthday.message as string}</p>
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="text-gray-600 bg-[#F6F6F7] cursor-pointer hover:text-gray-800"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#FBDE6E] cursor-pointer hover:bg-yellow-400 text-gray-900 px-6"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : (isUpdate ? 'Update Contact' : 'Add Contact')}
                        </Button>
                    </div>
                </form>
            </div>
        </CustomModal>
    );
}
