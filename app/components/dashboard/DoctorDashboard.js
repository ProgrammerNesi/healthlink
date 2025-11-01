// components/dashboard/DoctorDashboard.js
'use client'
import { useState } from 'react'

export default function DoctorDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [newRecord, setNewRecord] = useState({
    symptoms: '',
    diagnosis: '',
    prescription: '',
    notes: ''
  })

  // Mock patient data
  const mockPatients = [
    {
      id: 'PAT_123456',
      name: 'Rahul Sharma',
      age: 45,
      gender: 'Male',
      bloodGroup: 'O+',
      lastVisit: '2024-01-10',
      conditions: ['Hypertension', 'Type 2 Diabetes']
    },
    {
      id: 'PAT_789012',
      name: 'Priya Patel',
      age: 32,
      gender: 'Female', 
      bloodGroup: 'A+',
      lastVisit: '2024-01-12',
      conditions: ['Asthma', 'Seasonal Allergies']
    }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    // Simulate search
    const results = mockPatients.filter(patient =>
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setSearchResults(results)
  }

  const handleAddRecord = (e) => {
    e.preventDefault()
    // Here you would make API call to add medical record
    console.log('Adding record for:', selectedPatient.id, newRecord)
    alert('Medical record added successfully!')
    setNewRecord({ symptoms: '', diagnosis: '', prescription: '', notes: '' })
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome, Dr. {user.name}!
        </h1>
        <p className="text-gray-600">
          Manage your patients and access medical tools.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex space-x-4 border-b">
          {['search', 'patients', 'appointments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'search' && 'Patient Search'}
              {tab === 'patients' && 'My Patients'}
              {tab === 'appointments' && 'Appointments'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'search' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Patients</h2>
                
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search by Health ID or Name
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter Health ID or patient name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Search Patients
                  </button>
                </form>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-3">Search Results</h3>
                    <div className="space-y-2">
                      {searchResults.map(patient => (
                        <div
                          key={patient.id}
                          onClick={() => setSelectedPatient(patient)}
                          className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedPatient?.id === patient.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-600">
                            {patient.age} years • {patient.gender}
                          </div>
                          <div className="text-xs text-gray-500">ID: {patient.id}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Patient Details & Record Form */}
            <div className="lg:col-span-2">
              {selectedPatient ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h2>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>Age: {selectedPatient.age}</span>
                        <span>Gender: {selectedPatient.gender}</span>
                        <span>Blood Group: {selectedPatient.bloodGroup}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Last Visit</div>
                      <div className="font-medium">{selectedPatient.lastVisit}</div>
                    </div>
                  </div>

                  {/* Medical Record Form */}
                  <form onSubmit={handleAddRecord} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Symptoms
                      </label>
                      <textarea
                        value={newRecord.symptoms}
                        onChange={(e) => setNewRecord({...newRecord, symptoms: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe patient symptoms..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diagnosis
                      </label>
                      <input
                        type="text"
                        value={newRecord.diagnosis}
                        onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter diagnosis..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prescription
                      </label>
                      <textarea
                        value={newRecord.prescription}
                        onChange={(e) => setNewRecord({...newRecord, prescription: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Prescribe medications and dosage..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={newRecord.notes}
                        onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any additional notes or recommendations..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Save Medical Record
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Patient Selected</h3>
                  <p className="text-gray-600">Search for a patient to view their details and add medical records.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">My Patients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockPatients.map(patient => (
                <div key={patient.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="font-medium text-gray-900">{patient.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{patient.age} years • {patient.gender}</div>
                  <div className="text-xs text-gray-500 mt-1">ID: {patient.id}</div>
                  <div className="mt-2">
                    {patient.conditions.map(condition => (
                      <span key={condition} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1">
                        {condition}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPatient(patient)
                      setActiveTab('search')
                    }}
                    className="w-full mt-3 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Today's Appointments</h2>
            <div className="space-y-4">
              {mockPatients.map(patient => (
                <div key={patient.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-600">10:30 AM - General Checkup</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPatient(patient)
                      setActiveTab('search')
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Start Consultation
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}