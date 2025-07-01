import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export default function CustomModal({
    isOpen,
    onClose,
    title,
    children,
    className,
}: CustomModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-6">
                <DialogHeader className="relative">
                    <DialogTitle className="text-xl font-semibold">
                        {title}
                    </DialogTitle>
                
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
} 