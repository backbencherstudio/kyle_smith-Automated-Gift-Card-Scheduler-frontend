import DashboardLayout from '@/components/MainLayout/DashboardLayout'
import UserProtectedWrapper from '@/components/common/UserProtectedWrapper'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserProtectedWrapper>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </UserProtectedWrapper>
  )
}
