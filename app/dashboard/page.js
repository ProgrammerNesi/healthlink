// app/dashboard/page.js
'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout.js'
import PatientDashboard from '../components/dashboard/PatientDashboard'
import DoctorDashboard from '../components/dashboard/DoctorDashboard'
import AnimalOwnerDashboard from '../components/dashboard/AnimalOwnerDashboard'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) return null

  const renderDashboard = () => {
    switch (session.user.userType) {
      case 'patient':
        return <PatientDashboard user={session.user} />
      case 'doctor':
        return <DoctorDashboard user={session.user} />
      case 'animal_owner':
        return <AnimalOwnerDashboard user={session.user} />
      default:
        return <div>Unknown user type</div>
    }
  }

  return (
    <DashboardLayout user={session.user}>
      {renderDashboard()}
    </DashboardLayout>
  )
}