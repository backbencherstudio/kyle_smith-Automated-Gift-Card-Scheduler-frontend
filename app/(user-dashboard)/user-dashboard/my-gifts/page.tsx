'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { getMyGifts } from '@/apis/userDashboardApis';
import DynamicTableTwo from '@/app/(admin)/_component/common/DynamicTableTwo';
import { CustomToast } from '@/lib/Toast/CustomToast';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';

function StatusBadge({ status, type }: { status: string, type?: 'delivery' | 'queue' }) {
    let color = 'bg-gray-100 text-gray-700';
    if (type === 'queue') {
        color =
            status === 'completed'
                ? 'bg-blue-100 text-blue-700'
                : status === 'scheduled'
                    ? 'bg-yellow-100 text-yellow-700'
                    : status === 'processing'
                        ? 'bg-purple-100 text-purple-700'
                        : status === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700';
    } else {
        color =
            status === 'SENT'
                ? 'bg-green-100 text-green-700 '
                : status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-700'
                    : status === 'FAILED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700';
    }
    const displayStatus = status
        ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
        : '-';
    return (
        <span
            className={`px-2 py-1 rounded text-xs capitalize font-semibold ${color}`}
            style={{ display: 'inline-block', minWidth: 70, textAlign: 'center' }}
        >
            {displayStatus}
        </span>
    );
}

function truncateCode(code: string, len = 8) {
    if (!code) return '-';
    if (code.length <= len * 2) return code;
    return `${code.slice(0, len)}...${code.slice(-len)}`;
}

function formatCurrency(amount: number) {
    return amount ? `$${amount.toLocaleString()}` : '-';
}

function formatDateTime(dateStr: string) {
    if (!dateStr) return { date: '-', time: '' };
    const date = new Date(dateStr);
    return {
        date: date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }),
        time: date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }),
    };
}

// Debounce hook
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

export default function MyGifts() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [gifts, setGifts] = useState<any[]>([]);
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
        setGifts([]);
    };

    // Update URL when search or page changes
    useEffect(() => {
        // Update URL with debounced value
        const params = new URLSearchParams();
        if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
        if (currentPage > 1) params.set('page', currentPage.toString());
        const newURL = params.toString() ? `?${params.toString()}` : '';
        router.push(`/user-dashboard/my-gifts${newURL}`, { scroll: false });

        // Fetch data
        const fetchGifts = async () => {
            try {
                if (!pageLoading) {
                    setLoading(true);
                }
                const res = await getMyGifts(debouncedSearchTerm, itemsPerPage, currentPage);
                setGifts(res.gifts || []);
                const total = res.totalScheduled || 0;
                setTotalItems(total);
                setTotalPages(Math.max(Math.ceil(total / itemsPerPage), 1));
            } catch (error) {
                setGifts([]);
                setTotalItems(0);
                setTotalPages(1);
            } finally {
                setLoading(false);
                setPageLoading(false);
            }
        };
        fetchGifts();
        // eslint-disable-next-line
    }, [debouncedSearchTerm, currentPage]);

    const handleCopy = (code: string) => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        CustomToast.show('Gift code copied!');
    };

    const columns = [
        { label: 'Gift ID', width: '8%', accessor: 'id' },
        { label: 'Recipient Name', width: '14%', accessor: 'recipient', formatter: (_: any, row: any) => row.recipient?.name || '-' },
        { label: 'Recipient Email', width: '14%', accessor: 'recipient', formatter: (_: any, row: any) => row.recipient?.email || '-' },
        { label: 'Vendor', width: '10%', accessor: 'giftCard', formatter: (_: any, row: any) => row.giftCard?.vendor || '-' },
        { label: 'Amount', width: '8%', accessor: 'giftCard', formatter: (_: any, row: any) => formatCurrency(row.giftCard?.amount) },
        {
            label: 'Gift Code',
            width: '10%',
            accessor: 'giftCard',
            formatter: (_: any, row: any) => (
                <span className="flex items-center gap-2">
                    <span title={row.giftCard?.code}>{truncateCode(row.giftCard?.code)}</span>
                    {row.giftCard?.code && (
                        <button
                            className="text-xs cursor-pointer px-1 py-0.5 rounded bg-gray-200 hover:bg-gray-300 border border-gray-300"
                            onClick={() => handleCopy(row.giftCard.code)}
                            type="button"
                        >
                            Copy
                        </button>
                    )}
                </span>
            ),
        },
        {
            label: 'Scheduled Date',
            width: '12%',
            accessor: 'scheduling',
            formatter: (_: any, row: any) => {
                const { date, time } = formatDateTime(row.scheduling?.scheduledDate);
                return (
                    <span className="flex flex-col leading-tight">
                        <span>{date}</span>
                        <span className="text-xs text-gray-500">{time}</span>
                    </span>
                );
            },
        },
        {
            label: 'Delivery Status',
            width: '10%',
            accessor: 'status',
            formatter: (_: any, row: any) => <StatusBadge status={row.status?.deliveryStatus || '-'} />,
        },
        {
            label: 'Sent At',
            width: '12%',
            accessor: 'status',
            formatter: (_: any, row: any) => {
                const { date, time } = formatDateTime(row.status?.sentAt);
                return (
                    <span className="flex flex-col leading-tight">
                        <span>{date}</span>
                        <span className="text-xs text-gray-500">{time}</span>
                    </span>
                );
            },
        },
        {
            label: 'Queue Status',
            width: '10%',
            accessor: 'status',
            formatter: (_: any, row: any) => (
                <StatusBadge status={row.status?.queueStatus || '-'} type="queue" />
            ),
        },
        { label: 'Custom Message', width: '14%', accessor: 'scheduling', formatter: (_: any, row: any) => row.scheduling?.customMessage || '-' },
    ];

    return (
        <>
            <h1 className='text-3xl font-bold text-[#232323] mb-5'>Gifts</h1>
            <div className="bg-white rounded-lg p-4 ">
                <div className='mb-5 flex flex-col md:flex-row items-center justify-between'>
                    <h2 className="text-xl font-bold text-[#232323]">My Gifts</h2>

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
                    data={gifts}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    noDataMessage={pageLoading ? `Loading page ${currentPage}...` : loading ? 'Loading...' : 'No gifts found.'}
                    loading={pageLoading || loading}
                    showLoading={pageLoading || loading}
                />

                {/* Show total count and pagination info */}
                <div className="mt-4 text-sm text-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            Showing {gifts.length} of {totalItems} gifts
                        </div>
                        {totalPages > 1 && (
                            <div className="text-gray-500">
                                Page {currentPage} of {totalPages}
                            </div>
                        )}
                    </div>
                </div>
                <style jsx global>{`
        tr:hover { background: #f9fafb; }
      `}</style>
            </div>
        </>
    );
}
