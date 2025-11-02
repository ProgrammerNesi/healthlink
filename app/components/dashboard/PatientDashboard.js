// components/dashboard/PatientDashboard.js
'use client'
import { useState, useEffect } from 'react'

export default function PatientDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [medicalRecords, setMedicalRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [healthData, setHealthData] = useState({
    score: 85,
    lastCheckup: '2 weeks ago',
    nextAppointment: 'Jan 25, 10:30 AM',
    conditions: ['Mild Hypertension', 'Seasonal Allergies'],
    medications: ['Metoprolol 50mg', 'Loratadine 10mg']
  })

  const aiAnalysis = {
    diabetesRisk: { level: 'Low', score: 30 },
    heartDiseaseRisk: { level: 'Very Low', score: 15 },
    recommendations: [
      'Maintain regular exercise routine',
      'Monitor blood pressure weekly',
      'Reduce sodium intake',
      'Annual comprehensive checkup recommended'
    ]
  }

  // Fetch medical records when component mounts or when activeTab changes to records
  useEffect(() => {
    if (activeTab === 'records') {
      fetchMedicalRecords()
    }
  }, [activeTab])

  const fetchMedicalRecords = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/medical-records/patient/${user.userId}`)
      const data = await response.json()

      if (response.ok) {
        setMedicalRecords(data.records || [])
        
        // Update health data based on latest records
        if (data.records && data.records.length > 0) {
          const latestRecord = data.records[0]
          setHealthData(prev => ({
            ...prev,
            lastCheckup: new Date(latestRecord.dateOfVisit).toLocaleDateString()
          }))
        }
      } else {
        console.error('Error fetching medical records:', data.error)
      }
    } catch (error) {
      console.error('Error fetching medical records:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRecordTypeColor = (recordType) => {
    const colors = {
      consultation: 'blue',
      followup: 'green',
      emergency: 'red',
      routine: 'purple',
      lab_test: 'orange'
    }
    return colors[recordType] || 'gray'
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">
          Here's your health overview and recent updates.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex space-x-4 border-b">
          {['overview', 'records', 'analysis'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'overview' && 'Health Overview'}
              {tab === 'records' && 'Medical Records'}
              {tab === 'analysis' && 'AI Analysis'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health Stats */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Health Score</p>
                      <p className="text-2xl font-bold text-gray-900">{healthData.score}%</p>
                      <p className="text-sm text-green-600">Good</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <span className="text-2xl">❤️</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Last Checkup</p>
                      <p className="text-lg font-bold text-gray-900">{healthData.lastCheckup}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <span className="text-2xl">🩺</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Conditions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Conditions</h3>
                <div className="space-y-2">
                  {healthData.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-gray-700">{condition}</span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Managed</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Medications & Appointments */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
                <div className="space-y-3">
                  {healthData.medications.map((med, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-700">{med}</span>
                      <span className="text-sm text-gray-500">Daily</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Appointment</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">General Checkup</p>
                      <p className="text-sm text-blue-700">Dr. Sharma - City Hospital</p>
                      <p className="text-sm text-blue-600">{healthData.nextAppointment}</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Medical History</h2>
              <button
                onClick={fetchMedicalRecords}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : medicalRecords.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical Records Found</h3>
                <p className="text-gray-600">Your medical records will appear here after your doctor adds them.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {medicalRecords.map((record, index) => (
                  <div key={record._id || index} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    {/* Record Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-3">
                            <span className={`bg-${getRecordTypeColor(record.recordType)}-100 text-${getRecordTypeColor(record.recordType)}-800 text-xs px-2 py-1 rounded-full capitalize`}>
                              {record.recordType.replace('_', ' ')}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {record.diagnosis?.condition || 'Medical Consultation'}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Dr. {record.doctorId?.name || 'Unknown Doctor'} • {record.doctorId?.specialization || 'General Physician'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(record.dateOfVisit)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(record.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Record Details */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Symptoms & Diagnosis */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Symptoms</h4>
                            <p className="text-gray-600 text-sm">
                              {record.symptoms?.description || 'No symptoms recorded'}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Diagnosis</h4>
                            <p className="text-gray-600 text-sm">
                              {record.diagnosis?.description || record.diagnosis?.condition || 'No diagnosis recorded'}
                            </p>
                          </div>
                        </div>

                        {/* Vital Signs & Treatment */}
                        <div className="space-y-4">
                          {/* Vital Signs */}
                          {(record.vitalSigns?.weight || record.vitalSigns?.bloodPressure || record.vitalSigns?.oxygenSaturation) && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Vital Signs</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {record.vitalSigns?.weight && (
                                  <div>
                                    <span className="text-gray-600">Weight:</span>
                                    <span className="ml-1 font-medium">{record.vitalSigns.weight} kg</span>
                                  </div>
                                )}
                                {record.vitalSigns?.bloodPressure && (
                                  <div>
                                    <span className="text-gray-600">BP:</span>
                                    <span className="ml-1 font-medium">{record.vitalSigns.bloodPressure}</span>
                                  </div>
                                )}
                                {record.vitalSigns?.oxygenSaturation && (
                                  <div>
                                    <span className="text-gray-600">O₂:</span>
                                    <span className="ml-1 font-medium">{record.vitalSigns.oxygenSaturation}%</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Medications */}
                          {record.treatment?.prescriptions && record.treatment.prescriptions.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Medications</h4>
                              <div className="space-y-1">
                                {record.treatment.prescriptions.map((med, medIndex) => (
                                  <div key={medIndex} className="flex justify-between text-sm">
                                    <span className="text-gray-600">{med.medicineName}</span>
                                    <span className="text-gray-500">{med.dosage}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Additional Notes */}
                      {record.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-medium text-gray-700 mb-2">Doctor's Notes</h4>
                          <p className="text-gray-600 text-sm">{record.notes}</p>
                        </div>
                      )}

                      {/* Recommendations */}
                      {record.treatment?.recommendations && record.treatment.recommendations.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {record.treatment.recommendations.map((rec, recIndex) => (
                              <li key={recIndex}>• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Assessment */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Health Risk Assessment</h2>
              
              <div className="space-y-6">
                {/* Diabetes Risk */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Diabetes Risk</span>
                    <span className={`text-sm font-medium ${
                      aiAnalysis.diabetesRisk.level === 'Low' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {aiAnalysis.diabetesRisk.level}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${aiAnalysis.diabetesRisk.score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Heart Disease Risk */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Heart Disease Risk</span>
                    <span className="text-sm font-medium text-green-600">
                      {aiAnalysis.heartDiseaseRisk.level}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${aiAnalysis.heartDiseaseRisk.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personalized Recommendations</h2>
              <div className="space-y-3">
                {aiAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-600 text-lg">💡</span>
                  <div>
                    <p className="font-medium text-yellow-800">Next Suggested Checkup</p>
                    <p className="text-sm text-yellow-700">Based on your health patterns, we recommend a comprehensive checkup in 3 months.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}