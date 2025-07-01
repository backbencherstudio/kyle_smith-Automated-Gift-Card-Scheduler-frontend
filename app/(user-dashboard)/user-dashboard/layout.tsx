import DashboardLayout from '@/components/MainLayout/DashboardLayout'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
