'use client'
import React, { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa6'
import CustomModal from '@/components/ui/custom-modal'
import AddContacts from './AddContacts'
import { getContacts, addContact } from '@/apis/userDashboardApis'
import { CustomToast } from '@/lib/Toast/CustomToast'
import Link from 'next/link'

export default function ContactList() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [contacts, setContacts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    // Fetch contacts on component mount
    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await getContacts();
            if (response.success) {
                setContacts(response.data || []);
            } else {
                CustomToast.show(response.message || 'Failed to fetch contacts');
            }
        } catch (error: any) {
            console.error('Error fetching contacts:', error);
            CustomToast.show(error?.response?.data?.message || 'Failed to fetch contacts');
        } finally {
            setLoading(false);
        }
    };

    const handleAddContact = async (contactData: any) => {
        try {
            setLoading(true);
            const response = await addContact({
                name: contactData.name,
                email: contactData.email,
                phone_number: contactData.phone_number || '',
                address: contactData.address,
                birthday_date: contactData.birthday_date,
            });
            
            if (response.success) {
                CustomToast.show('Contact added successfully');
                setIsModalOpen(false);
                fetchContacts(); // Refresh the list
            } else {
                CustomToast.show(response.message || 'Failed to add contact');
            }
        } catch (error: any) {
            console.error('Error adding contact:', error);
            CustomToast.show(error?.response?.data?.message || 'Failed to add contact');
        } finally {
            setLoading(false);
        }
    };

    // Show only first 8 contacts
    const displayContacts = contacts.slice(0, 7);

    return (
        <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-lg p-4 h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Contact</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#FBDE6E] text-[#1D1F2C] cursor-pointer transform duration-300 hover:bg-yellow-500 px-3 py-2 text-sm rounded flex items-center gap-1 font-medium"
                        disabled={loading}
                    >
                        <FaPlus size={12} />
                        Add New
                    </button>
                </div>

                {/* Contact List */}
                <div className="flex-grow overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        </div>
                    ) : displayContacts.length > 0 ? (
                        displayContacts.map((contact, i) => (
                            <div
                                key={contact.id || i}
                                className="flex gap-3 items-center py-3 border-b last:border-b-0"
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-600">
                                        {contact.name?.charAt(0)?.toUpperCase() || '?'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{contact.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            No contacts found
                        </div>
                    )}
                </div>

                {/* Show total count and View All link */}
                {contacts.length > 8 && (
                    <div className="mt-2 pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                                Showing 7 of {contacts.length} contacts
                            </span>
                            <Link 
                                href="/user-dashboard/contacts"
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                            >
                                View All
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <CustomModal
                isOpen={isModalOpen}
                onClose={() => !loading && setIsModalOpen(false)}
                title="Add Contact"
            >
                <AddContacts
                    isOpen={isModalOpen}
                    onClose={() => !loading && setIsModalOpen(false)}
                    onSubmit={handleAddContact}
                    loading={loading}
                />
            </CustomModal>
        </div>
    )
}
