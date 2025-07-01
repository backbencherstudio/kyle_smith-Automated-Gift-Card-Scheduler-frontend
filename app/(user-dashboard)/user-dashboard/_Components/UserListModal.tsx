import Image from 'next/image'
import React from 'react'

interface UserListModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: string;
    events: any[];
    onUserSelect: (user: any, event: any) => void;
}

export default function UserListModal({ isOpen, onClose, date, events, onUserSelect }: UserListModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Select User for Gift ({new Date(date).toLocaleDateString()})</h3>
                </div>
                <div className="space-y-3">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                            onClick={() => onUserSelect(event.extendedProps, event)}
                        >
                            {event.extendedProps.avatar && event.extendedProps.avatar.trim() !== '' ? (
                                <Image
                                    width={48}
                                    height={48}
                                    src={event.extendedProps.avatar}
                                    alt={event.extendedProps.name}
                                    className="w-12 h-12 rounded-full"
                                />
                            ) : (
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-gray-700 border-2 border-white"
                                    style={{ backgroundColor: event.extendedProps.color || '#6b7280' }}
                                >
                                    {event.extendedProps.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                            )}
                            <div>
                                <p className="font-medium text-gray-900">{event.extendedProps.name}</p>
                                <p className="text-sm text-gray-500">{event.extendedProps.type}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 cursor-pointer text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
