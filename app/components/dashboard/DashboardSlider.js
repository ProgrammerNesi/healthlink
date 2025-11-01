// components/dashboard/DashboardSidebar.js
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardSidebar({ user }) {
  const pathname = usePathname()

  const navigationItems = {
    patient: [
      { name: 'Health Overview', href: '/dashboard', icon: '📊' },
      { name: 'Medical Records', href: '/dashboard/records', icon: '📋' },
      { name: 'AI Analysis', href: '/dashboard/analysis', icon: '🤖' },
      { name: 'Appointments', href: '/dashboard/appointments', icon: '📅' },
    ],
    doctor: [
      { name: 'Dashboard', href: '/dashboard', icon: '📊' },
      { name: 'Patient Search', href: '/dashboard/patients', icon: '🔍' },
      { name: 'My Appointments', href: '/dashboard/appointments', icon: '📅' },
      { name: 'Outbreak Map', href: '/dashboard/outbreak', icon: '🗺️' },
    ],
    animal_owner: [
      { name: 'Dashboard', href: '/dashboard', icon: '📊' },
      { name: 'My Pets', href: '/dashboard/pets', icon: '🐾' },
      { name: 'Pet Health', href: '/dashboard/pet-health', icon: '❤️' },
      { name: 'Vet Appointments', href: '/dashboard/appointments', icon: '📅' },
    ]
  }

  const items = navigationItems[user.userType] || []

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <nav className="space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}