// components/dashboard/AnimalOwnerDashboard.js
'use client'
import { useState } from 'react'

export default function AnimalOwnerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('pets')
  const [selectedPet, setSelectedPet] = useState(null)

  // Mock pet data
  const pets = [
    {
      id: 'PET_001',
      name: 'Max',
      type: 'Dog',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'Male',
      weight: '30 kg',
      lastVetVisit: '2024-01-08',
      vaccinations: ['Rabies', 'Distemper', 'Parvovirus'],
      conditions: ['None'],
      medications: ['Heartworm Prevention']
    },
    {
      id: 'PET_002', 
      name: 'Luna',
      type: 'Cat',
      breed: 'Siamese',
      age: 2,
      gender: 'Female',
      weight: '4 kg',
      lastVetVisit: '2023-12-20',
      vaccinations: ['Rabies', 'Feline Distemper'],
      conditions: ['Seasonal Allergies'],
      medications: ['Antihistamines as needed']
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome, {user.name}!
        </h1>
        <p className="text-gray-600">
          Manage your pets' health and veterinary care.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex space-x-4 border-b">
          {['pets', 'health', 'appointments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'pets' && 'My Pets'}
              {tab === 'health' && 'Pet Health'}
              {tab === 'appointments' && 'Appointments'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'pets' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pets List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">My Pets</h2>
                <div className="space-y-3">
                  {pets.map(pet => (
                    <div
                      key={pet.id}
                      onClick={() => setSelectedPet(pet)}
                      className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedPet?.id === pet.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <span className="text-lg">
                            {pet.type === 'Dog' ? '🐕' : '🐈'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{pet.name}</div>
                          <div className="text-sm text-gray-600">
                            {pet.type} • {pet.age} years
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pet Details */}
            <div className="lg:col-span-2">
              {selectedPet ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedPet.name}</h2>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>{selectedPet.breed}</span>
                        <span>{selectedPet.age} years old</span>
                        <span>{selectedPet.gender}</span>
                        <span>{selectedPet.weight}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Last Vet Visit</div>
                      <div className="font-medium">{selectedPet.lastVetVisit}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vaccinations */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Vaccinations</h3>
                      <div className="space-y-2">
                        {selectedPet.vaccinations.map((vaccine, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-700">{vaccine}</span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Current</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Health Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Health Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium text-gray-700">Medical Conditions</p>
                          <div className="mt-1">
                            {selectedPet.conditions.map((condition, index) => (
                              <span key={index} className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded mr-1">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Current Medications</p>
                          <p className="text-sm text-gray-600 mt-1">{selectedPet.medications.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Schedule Vet Visit
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                      Update Health Record
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pet Selected</h3>
                  <p className="text-gray-600">Select a pet to view their details and health information.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pet Health Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pets.map(pet => (
                <div key={pet.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <span className="text-2xl">
                        {pet.type === 'Dog' ? '🐕' : '🐈'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                      <p className="text-sm text-gray-600">{pet.breed}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Health Status</span>
                      <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">Good</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Checkup</span>
                      <span className="text-sm font-medium">{pet.lastVetVisit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Vaccinations</span>
                      <span className="text-sm font-medium">{pet.vaccinations.length} current</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPet(pet)
                      setActiveTab('pets')
                    }}
                    className="w-full mt-4 bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700"
                  >
                    View Full Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Appointments</h2>
            <div className="space-y-4">
              {pets.map(pet => (
                <div key={pet.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <span className="text-lg">
                        {pet.type === 'Dog' ? '🐕' : '🐈'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{pet.name} - Annual Checkup</div>
                      <div className="text-sm text-gray-600">Dr. Smith - Paws & Claws Veterinary</div>
                      <div className="text-sm text-gray-500">January 25, 2024 • 2:30 PM</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                      Confirm
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}