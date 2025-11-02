// components/dashboard/DoctorDashboard.js
'use client'
import { useState } from 'react'

export default function DoctorDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [newRecord, setNewRecord] = useState({
    symptoms: '',
    diagnosis: '',
    medications: '',
    weight: '',
    bloodPressure: '',
    oxygenLevel: '',
    notes: '',
    recordType: 'consultation',
    dateOfVisit: new Date().toISOString().split('T')[0] // Default to today's date
  })

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      alert('Please enter a Patient Health ID')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/patients/search?healthId=${searchQuery.trim().toUpperCase()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (response.ok) {
        setSearchResults(data.patients || [])
        if (data.patients && data.patients.length > 0) {
          setSelectedPatient(data.patients[0])
        } else {
          alert('No patient found with this Health ID')
        }
      } else {
        alert(data.error || 'Error searching for patient')
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Error searching for patient. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddRecord = async (e) => {
    e.preventDefault()
    
    // Validate mandatory fields
    if (!newRecord.symptoms.trim() || !newRecord.diagnosis.trim() || !newRecord.medications.trim()) {
      alert('Please fill in all mandatory fields: Symptoms, Diagnosis, and Medications')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/medical-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          doctorId: user.userId,
          symptoms: newRecord.symptoms,
          diagnosis: newRecord.diagnosis,
          medications: newRecord.medications,
          weight: newRecord.weight || null,
          bloodPressure: newRecord.bloodPressure || null,
          oxygenLevel: newRecord.oxygenLevel || null,
          notes: newRecord.notes || '',
          recordType: newRecord.recordType,
          dateOfVisit: newRecord.dateOfVisit // Add date of visit to the API call
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Medical record added successfully!')
        // Reset form
        setNewRecord({
          symptoms: '',
          diagnosis: '',
          medications: '',
          weight: '',
          bloodPressure: '',
          oxygenLevel: '',
          notes: '',
          recordType: 'consultation',
          dateOfVisit: new Date().toISOString().split('T')[0] // Reset to today's date
        })
        // Refresh patient data to show updated records
        if (selectedPatient) {
          handleSearchPatient(selectedPatient.id)
        }
      } else {
        alert(data.error || 'Error saving medical record')
      }
    } catch (error) {
      console.error('Error saving record:', error)
      alert('Error saving medical record. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchPatient = async (patientId) => {
    try {
      const response = await fetch(`/api/patients/${patientId}`)
      const data = await response.json()
      
      if (response.ok) {
        setSelectedPatient(data.patient)
      }
    } catch (error) {
      console.error('Error fetching patient details:', error)
    }
  }

  const handleInputChange = (field, value) => {
    setNewRecord(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, Dr. {user.name}!
            </h1>
            <p className="text-gray-600">
              Search patients by Health ID and update their medical records.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Your ID</p>
            <p className="font-mono font-medium text-gray-900">{user.userId}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Patient</h2>
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Health ID *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                    placeholder="Enter PAT_XXXXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono uppercase"
                    required
                    style={{ textTransform: 'uppercase' }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: PAT_ followed by 6 characters</p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </div>
                ) : (
                  'Search Patient'
                )}
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
                      <div className="text-xs text-gray-500 font-mono">ID: {patient.id}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Patient Details & Medical Record Form */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Patient Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>Age: {selectedPatient.age} years</span>
                    <span>Gender: {selectedPatient.gender}</span>
                    <span>Blood Group: {selectedPatient.bloodGroup}</span>
                  </div>
                  {selectedPatient.contact && (
                    <div className="mt-1 text-sm text-gray-600">
                      Contact: {selectedPatient.contact}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Health ID</div>
                  <div className="font-mono font-medium text-gray-900">{selectedPatient.id}</div>
                  {selectedPatient.lastVisit && (
                    <div className="text-xs text-gray-500 mt-1">
                      Last visit: {selectedPatient.lastVisit}
                    </div>
                  )}
                </div>
              </div>

              {/* Medical Record Form */}
              <form onSubmit={handleAddRecord} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mandatory Fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Medical Information *</h3>
                    
                    {/* Date of Visit Field - Added here */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Visit *
                      </label>
                      <input
                        type="date"
                        value={newRecord.dateOfVisit}
                        onChange={(e) => handleInputChange('dateOfVisit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Symptoms *
                      </label>
                      <textarea
                        value={newRecord.symptoms}
                        onChange={(e) => handleInputChange('symptoms', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe patient symptoms in detail..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diagnosis *
                      </label>
                      <input
                        type="text"
                        value={newRecord.diagnosis}
                        onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter diagnosis..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medications & Dosage *
                      </label>
                      <textarea
                        value={newRecord.medications}
                        onChange={(e) => handleInputChange('medications', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Prescribe medications with dosage and frequency..."
                        required
                      />
                    </div>
                  </div>

                  {/* Optional Fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Vital Signs</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          value={newRecord.weight}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 70"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Blood Pressure
                        </label>
                        <input
                          type="text"
                          value={newRecord.bloodPressure}
                          onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 120/80"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Oxygen Level (%)
                      </label>
                      <input
                        type="number"
                        value={newRecord.oxygenLevel}
                        onChange={(e) => handleInputChange('oxygenLevel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 98"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Record Type
                      </label>
                      <select
                        value={newRecord.recordType}
                        onChange={(e) => handleInputChange('recordType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="consultation">Consultation</option>
                        <option value="followup">Follow-up</option>
                        <option value="emergency">Emergency</option>
                        <option value="routine">Routine Checkup</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={newRecord.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any additional observations or recommendations..."
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving Record...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Save Medical Record</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search for a Patient</h3>
              <p className="text-gray-600">
                Enter a Patient Health ID in the search panel to view their details and add medical records.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}