// components/dashboard/PatientDashboard.js
'use client'
import { useState } from 'react'

export default function PatientDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  const healthData = {
    score: 85,
    lastCheckup: '2 weeks ago',
    nextAppointment: 'Jan 25, 10:30 AM',
    conditions: ['Mild Hypertension', 'Seasonal Allergies'],
    medications: ['Metoprolol 50mg', 'Loratadine 10mg']
  }

  const medicalHistory = [
    {
      date: '2024-01-10',
      doctor: 'Dr. Sharma',
      type: 'General Checkup',
      diagnosis: 'Routine health check - All normal',
      prescription: 'Continue current medications'
    },
    {
      date: '2023-12-15',
      doctor: 'Dr. Kapoor',
      type: 'Follow-up',
      diagnosis: 'Blood pressure under control',
      prescription: 'Adjust Metoprolol dosage'
    }
  ]

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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Medical History</h2>
            <div className="space-y-4">
              {medicalHistory.map((record, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-4 bg-gray-50 rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{record.type}</p>
                      <p className="text-sm text-gray-600">Dr. {record.doctor}</p>
                    </div>
                    <span className="text-sm text-gray-500">{record.date}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Diagnosis</p>
                      <p className="text-gray-600">{record.diagnosis}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Prescription</p>
                      <p className="text-gray-600">{record.prescription}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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