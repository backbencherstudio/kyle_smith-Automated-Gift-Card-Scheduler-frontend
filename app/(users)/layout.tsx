import Navbar from '@/components/shared/Navbar';
import React from 'react';
interface AdminLayoutProps {
  children: React.ReactNode;
}
const  FrotEndlayout:React.FC<AdminLayoutProps> = ({ children })=> {
  return (
    <div>
      <Navbar/>
      {children}
    </div>
  )
}

export default FrotEndlayout 
