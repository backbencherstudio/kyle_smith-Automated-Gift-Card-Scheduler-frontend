"use client"
import DynamicTableTwo from '@/app/(admin)/_component/common/DynamicTableTwo';
import React, { useState, useEffect, useCallback } from 'react';
import { orderHistory } from '@/apis/paymentsApis';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

export default function OrderHistory() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Handle page change with loading state
    const handlePageChange = (page: number) => {
        setPageLoading(true);
        setCurrentPage(page);
        setData([]);
    };

    const updateURL = useCallback((search: string, page: number) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (page > 1) params.set('page', page.toString());
        const newURL = params.toString() ? `?${params.toString()}` : '';
        router.push(`/user-dashboard/order-history${newURL}`, { scroll: false });
    }, [router]);

    useEffect(() => {
        updateURL(debouncedSearchTerm, currentPage);
    }, [debouncedSearchTerm, currentPage, updateURL]);

    useEffect(() => {
        setCurrentPage(Number(searchParams.get('page')) || 1);
        setSearchTerm(searchParams.get('search') || '');
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!pageLoading) {
                    setLoading(true);
                }
                const res = await orderHistory(debouncedSearchTerm, itemsPerPage, currentPage);
                setData(res.data || []);
                setTotalItems(res.total || 0);
                setTotalPages(res.totalPages || 1);
            } catch (error) {
                setData([]);
                setTotalItems(0);
                setTotalPages(1);
            } finally {
                setLoading(false);
                setPageLoading(false);
            }
        };
        fetchData();
    }, [debouncedSearchTerm, currentPage]);

    const columns = [
        {
            label: "Date", width: "20%", accessor: "date", formatter: (value: string) => {
                if (!value) return '-';
                const date = new Date(value);
                return (
                    <span className="flex flex-col leading-tight">
                        <span>{date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        <span className="text-xs text-gray-500">{date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                    </span>
                );
            }
        },
        { label: "Recipient Name", width: "20%", accessor: "recipient_name" },
        { label: "Gift Amount", width: "20%", accessor: "gift_amount", formatter: (value: number) => value ? `$${value}` : '-' },
        { label: "Email", width: "25%", accessor: "recipient_email" },
        { label: "Status", width: "20%", accessor: "status", formatter: (value: string) => value ? value.charAt(0).toUpperCase() + value.slice(1) : '-' },
    ];

    return (
        <div>
            <h1 className='text-3xl font-bold text-[#232323] mb-6'>Order History</h1>
            <div className='bg-white rounded-lg p-4'>
                <div className='mb-5 flex flex-col md:flex-row items-center justify-between'>
                    <h2 className="text-xl font-bold text-[#232323]">Payment History</h2>

                    <div className='flex items-center justify-between gap-4 mt-4'>
                        <div className="w-[300px] relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 w-full bg-gray-50"
                                value={searchTerm}
                                onChange={e => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <DynamicTableTwo
                    columns={columns}
                    data={data}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    noDataMessage={pageLoading ? `Loading page ${currentPage}...` : loading ? 'Loading...' : 'No order history found.'}
                    loading={pageLoading || loading}
                    showLoading={pageLoading || loading}
                />

                {/* Show total count and pagination info */}
                <div className="mt-4 text-sm text-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            Showing {data.length} of {totalItems} orders
                        </div>
                        {totalPages > 1 && (
                            <div className="text-gray-500">
                                Page {currentPage} of {totalPages}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style jsx global>{`
        tr:hover { background: #f9fafb; }
      `}</style>
        </div>
    );
}
