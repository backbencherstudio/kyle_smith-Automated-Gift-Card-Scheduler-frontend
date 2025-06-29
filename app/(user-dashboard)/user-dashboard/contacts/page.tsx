'use client'
import React, { useState, useEffect } from 'react'

import DynamicTableTwo from '@/app/(admin)/_component/common/DynamicTableTwo'
import { FaPlus } from 'react-icons/fa'
import CustomModal from '@/components/ui/custom-modal';
import AddContacts from '../_Components/AddContacts';
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { addContact, getContacts, updateContact, deleteContact } from '@/apis/userDashboardApis';
import { CustomToast } from '@/lib/Toast/CustomToast';


export default function Contacts() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedContact, setSelectedContact] = useState<any>(null)
    const [contactToDelete, setContactToDelete] = useState<any>(null)
    const [contacts, setContacts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [totalContacts, setTotalContacts] = useState(0)
    const [itemsPerPage] = useState(10) 
    
    const columns = [
        { label: "Name", width: "20%", accessor: "name" },
        { label: "Address", width: "20%", accessor: "address" },
        { label: "Email", width: "25%", accessor: "email" },
        { label: "Phone", width: "15%", accessor: "phone_number" },
        { 
            label: "Birthday Date", 
            width: "15%", 
            accessor: "birthday_date",
            formatter: (value: string) => {
                if (!value) return '-';
                try {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                } catch (error) {
                    return value;
                }
            }
        },
        { 
            label: "Action", 
            width: "10%", 
            accessor: "action",
            formatter: (value: any, row: any) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdate(row)}
                        disabled={loading || deleteLoading || updateLoading}
                        className="h-8 w-8 p-0 hover:bg-gray-100 cursor-pointer"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(row)}
                        disabled={loading || deleteLoading || updateLoading}
                        className="h-8 w-8 p-0 hover:bg-gray-100 text-red-600 hover:text-red-700 cursor-pointer"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
    ];

    useEffect(() => {
        fetchContacts();
    }, [currentPage]); 

    useEffect(() => {
        const handleBeforeUnload = () => {
            setIsModalOpen(false);
            setIsUpdateModalOpen(false);
            setIsDeleteModalOpen(false);
            setSelectedContact(null);
            setContactToDelete(null);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await getContacts();
            if (response.success) {
                setContacts(response.data || []);
                setTotalContacts(response.data?.length || 0);
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
                // Reset to first page and refresh
                setCurrentPage(1);
                fetchContacts();
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

    const handleUpdateContact = async (contactData: any) => {
        try {
            setUpdateLoading(true);
            const response = await updateContact(selectedContact.id, {
                name: contactData.name,
                email: contactData.email,
                phone_number: contactData.phone_number || '',
                address: contactData.address,
                birthday_date: contactData.birthday_date,
            });
            
            if (response.success) {
                CustomToast.show('Contact updated successfully');
                setIsUpdateModalOpen(false);
                setSelectedContact(null);
                fetchContacts();
            } else {
                CustomToast.show(response.message || 'Failed to update contact');
            }
        } catch (error: any) {
            console.error('Error updating contact:', error);
            CustomToast.show(error?.response?.data?.message || 'Failed to update contact');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleUpdate = (contact: any) => {
        if (!loading && !deleteLoading && !updateLoading) {
            setSelectedContact(contact);
            setIsUpdateModalOpen(true);
        }
    };

    const handleDeleteClick = (contact: any) => {
        if (!loading && !deleteLoading && !updateLoading) {
            setContactToDelete(contact);
            setIsDeleteModalOpen(true);
        }
    };

    const handleDelete = async () => {
        if (!contactToDelete) return;
        
        try {
            setDeleteLoading(true);
            const response = await deleteContact(contactToDelete.id);
            if (response.success) {
                CustomToast.show('Contact deleted successfully');
                setIsDeleteModalOpen(false);
                setContactToDelete(null);
                
                // Check if current page will be empty after deletion
                const currentPageItems = contacts.length;
                if (currentPageItems === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                } else {
                    fetchContacts(); // Refresh current page
                }
            } else {
                CustomToast.show(response.message || 'Failed to delete contact');
            }
        } catch (error: any) {
            console.error('Error deleting contact:', error);
            CustomToast.show(error?.response?.data?.message || 'Failed to delete contact');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Calculate total pages from backend data
    const totalPages = Math.ceil(totalContacts / itemsPerPage);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <h1 className='text-3xl font-bold text-[#232323]'>Contact</h1>

            <div className="bg-white rounded-lg p-4 mt-5">
                <div className='mb-5'>
                    <h1 className="text-xl font-bold text-[#232323]">Contact List</h1>

                    <div className='flex items-center justify-between gap-4 mt-4'>
                        <div className="w-[300px] relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 w-full bg-gray-50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#FDCB48] text-[#1D1F2C] cursor-pointer transform duration-300 hover:bg-yellow-500 px-5 py-3 text-sm rounded flex items-center gap-1 font-medium whitespace-nowrap"
                            disabled={loading}
                        >
                            <FaPlus size={12} />
                            Add New
                        </button>
                    </div>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <DynamicTableTwo
                        columns={columns}
                        data={contacts}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                )}

                {/* Show total count */}
                <div className="mt-4 text-sm text-gray-600">
                    Showing {contacts.length} of {totalContacts} contacts
                </div>

                <CustomModal
                    isOpen={isModalOpen}
                    onClose={() => !loading && setIsModalOpen(false)}
                    title="Add Contact"
                >
                    <AddContacts
                        isOpen={isModalOpen}
                        onClose={() => !loading && setIsModalOpen(false)}
                        isUpdate={false}
                        onSubmit={handleAddContact}
                        loading={loading}
                    />
                </CustomModal>

                <CustomModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => !updateLoading && setIsUpdateModalOpen(false)}
                    title="Update Contact"
                >
                    <AddContacts
                        isOpen={isUpdateModalOpen}
                        onClose={() => !updateLoading && setIsUpdateModalOpen(false)}
                        initialData={selectedContact}
                        isUpdate={true}
                        onSubmit={handleUpdateContact}
                        loading={updateLoading}
                    />
                </CustomModal>

                {/* Delete Confirmation Modal */}
                <CustomModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        if (!deleteLoading) {
                            setIsDeleteModalOpen(false);
                            setContactToDelete(null);
                        }
                    }}
                    title="Delete Contact"
                >
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Delete Contact
                            </h3>
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete <strong>{contactToDelete?.name}</strong>? 
                                This action cannot be undone.
                            </p>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (!deleteLoading) {
                                        setIsDeleteModalOpen(false);
                                        setContactToDelete(null);
                                    }
                                }}
                                disabled={deleteLoading}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </CustomModal>
            </div>
        </>
    )
}
