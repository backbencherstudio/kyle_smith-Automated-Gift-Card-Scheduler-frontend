import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
import React from 'react';
interface UserLayoutProps {
  children: React.ReactNode;
}
const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default UserLayout 
