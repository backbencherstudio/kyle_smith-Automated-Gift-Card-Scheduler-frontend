import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ResuseableModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    preventOutsideClick?: boolean;
}

export default function ResuseableModal({
    isOpen,
    onClose,
    title,
    children,
    preventOutsideClick = false
}: ResuseableModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
            }
        }}>
            <DialogContent 
                onPointerDownOutside={(e) => {
                    if (preventOutsideClick) {
                        e.preventDefault();
                    }
                }}
                onEscapeKeyDown={(e) => {
                    if (preventOutsideClick) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}
