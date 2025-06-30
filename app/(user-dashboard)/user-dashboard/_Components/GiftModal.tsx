import React from 'react';
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
    const {
        control,
        formState: { errors },
    } = useForm();

    if (!selectedUser) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Set Gift</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 border-t border-gray-200 pt-6">
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
                            <Input placeholder="Enter address" />
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
                        <div className="space-y-2 w-full">
                            <label className="text-sm text-gray-600">Select Gift Card</label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a gift card" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="amazon">Amazon Gift Card - $50</SelectItem>
                                    <SelectItem value="steam">Steam Wallet - $25</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 w-full">
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
                    <div className="flex justify-between space-x-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onSubmit}
                            className="bg-[#FBDE6E] cursor-pointer text-gray-900 hover:bg-yellow-500"
                        >
                            Set Gift
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
