'use client'
import React, { useState, useEffect } from 'react'

import DynamicTableTwo from '@/app/(admin)/_component/common/DynamicTableTwo'
import { FaPlus } from 'react-icons/fa'
import CustomModal from '@/components/ui/custom-modal';
import AddContacts from '../_Components/AddContacts';
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { addContact, getContacts, updateContact, deleteContact } from '@/apis/userDashboardApis';
import { CustomToast } from '@/lib/Toast/CustomToast';
import ResuseableModal from '@/components/reusable/ResuseableModal';


export default function Contacts() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedContact, setSelectedContact] = useState<any>(null)
    const [contactToDelete, setContactToDelete] = useState<any>(null)
    const [contacts, setContacts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => handleUpdate(row)}
                            className="cursor-pointer"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Update</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDeleteClick(row)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    ];

    useEffect(() => {
        fetchContacts();
    }, [currentPage]); // Refetch when page changes

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
            setLoading(true);
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
                fetchContacts(); // Refresh current page
            } else {
                CustomToast.show(response.message || 'Failed to update contact');
            }
        } catch (error: any) {
            console.error('Error updating contact:', error);
            CustomToast.show(error?.response?.data?.message || 'Failed to update contact');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (contact: any) => {
        setSelectedContact(contact);
        setIsUpdateModalOpen(true);
    };

    const handleDeleteClick = (contact: any) => {
        setContactToDelete(contact);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!contactToDelete) return;
        
        try {
            setLoading(true);
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
            setLoading(false);
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
                    onClose={() => !loading && setIsUpdateModalOpen(false)}
                    title="Update Contact"
                >
                    <AddContacts
                        isOpen={isUpdateModalOpen}
                        onClose={() => !loading && setIsUpdateModalOpen(false)}
                        initialData={selectedContact}
                        isUpdate={true}
                        onSubmit={handleUpdateContact}
                        loading={loading}
                    />
                </CustomModal>

                {/* Delete Confirmation Modal */}
                <ResuseableModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        // Only allow closing if not loading
                        if (!loading) {
                            setIsDeleteModalOpen(false);
                            setContactToDelete(null);
                        }
                    }}
                    title="Delete Contact"
                    preventOutsideClick={loading} // Prevent outside click only when loading
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
                                    if (!loading) {
                                        setIsDeleteModalOpen(false);
                                        setContactToDelete(null);
                                    }
                                }}
                                disabled={loading}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleDelete}
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </ResuseableModal>
            </div>
        </>
    )
}
