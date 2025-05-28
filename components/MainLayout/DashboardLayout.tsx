'use client'

import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../shared/Navbar';
// import Sidebar from '../Shared/Sidebar';
// import Navbar from '../Shared/Navbar';
interface LayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: LayoutProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



    return (
        <div className="flex h-screen overflow-hidden bg-[#F7F7F9] font-commissioner">
            <Sidebar
                isMobileMenuOpen={isMobileMenuOpen}
                onMobileMenuClose={() => setIsMobileMenuOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar
                    notificationCount={1}
                    isMobileMenuOpen={isMobileMenuOpen}
                    onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
