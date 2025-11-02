// components/dashboard/PatientDashboard.js
'use client'
import { useState, useEffect } from 'react'

const ML_API_URL = process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:5000'

export default function PatientDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [medicalRecords, setMedicalRecords] = useState([])
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [healthData, setHealthData] = useState({
    score: 85,
    lastCheckup: '2 weeks ago',
    nextAppointment: 'Jan 25, 10:30 AM',
    conditions: ['Mild Hypertension', 'Seasonal Allergies'],
    medications: ['Metoprolol 50mg', 'Loratadine 10mg']
  })
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  // Fetch medical records and AI analysis when component mounts
  useEffect(() => {
    if (activeTab === 'records' || activeTab === 'analysis') {
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

          // Trigger AI analysis if we have records
          if (activeTab === 'analysis') {
            triggerAIAnalysis(data.records)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching medical records:', error)
    } finally {
      setLoading(false)
    }
  }

  const triggerAIAnalysis = async (records) => {
    if (!records || records.length === 0) return
    
    setAnalyzing(true)
    try {
      // Extract health parameters from recent records for AI analysis
      const healthParams = extractHealthParameters(records)
      
      const response = await fetch(`${ML_API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(healthParams)
      })

      const data = await response.json()

      if (data.success) {
        setAiAnalysis(data.prediction)
        
        // Update health score in overview
        setHealthData(prev => ({
          ...prev,
          score: data.prediction.health_score
        }))
      } else {
        console.error('AI analysis failed:', data.error)
        setAiAnalysis(getFallbackAnalysis())
      }
    } catch (error) {
      console.error('Error during AI analysis:', error)
      setAiAnalysis(getFallbackAnalysis())
    } finally {
      setAnalyzing(false)
    }
  }

  const extractHealthParameters = (records) => {
    // Use the most recent record or aggregate data from multiple records
    const latestRecord = records[0]
    
    // Extract vital signs from the record
    const vitalSigns = latestRecord.vitalSigns || {}
    
    // Calculate BMI from weight and height (if available)
    const weight = vitalSigns.weight || 70
    const height = vitalSigns.height || 170
    const bmi = weight / ((height / 100) ** 2)
    
    // Parse blood pressure
    const bloodPressure = vitalSigns.bloodPressure || '120/80'
    const [bpSystolic, bpDiastolic] = bloodPressure.split('/').map(Number)
    
    return {
      age: user.personalInfo?.age || 30,
      gender: user.personalInfo?.gender || 'male',
      bmi: bmi,
      blood_pressure: bloodPressure,
      blood_pressure_systolic: bpSystolic || 120,
      blood_pressure_diastolic: bpDiastolic || 80,
      cholesterol_level: 180, // Default value - in real app, get from lab results
      glucose_level: 90, // Default value - in real app, get from lab results
      heart_rate: vitalSigns.heartRate || 72,
      oxygen_saturation: vitalSigns.oxygenSaturation || 98
    }
  }

  const getFallbackAnalysis = () => {
    return {
      diagnosis: 'General Health Assessment',
      disease_risk: 'Low',
      confidence_score: 0,
      pathway_scores: {
        metabolic_pathway_score: 25,
        cardiovascular_pathway_score: 25,
        respiratory_pathway_score: 25
      },
      recommendations: [
        "Complete your health profile for personalized analysis",
        "Consult with your healthcare provider for detailed assessment"
      ],
      key_factors: ["Insufficient data for comprehensive analysis"],
      health_score: 75,
      fallback: true
    }
  }

  const getRiskColor = (riskLevel) => {
    const colors = {
      'Low': 'green',
      'Moderate': 'yellow',
      'High': 'orange',
      'Critical': 'red'
    }
    return colors[riskLevel] || 'gray'
  }

  const getRiskIcon = (riskLevel) => {
    const icons = {
      'Low': '✅',
      'Moderate': '⚠️',
      'High': '🔶',
      'Critical': '🔴'
    }
    return icons[riskLevel] || '⚪'
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">
          Here's your health overview and AI-powered health analysis.
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
              {tab === 'analysis' && 'AI Health Analysis'}
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
                      <p className="text-sm font-medium text-gray-600">AI Health Score</p>
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

              {/* AI Health Insights */}
              {aiAnalysis && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Health Insights</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Overall Risk</span>
                      <span className={`bg-${getRiskColor(aiAnalysis.disease_risk)}-100 text-${getRiskColor(aiAnalysis.disease_risk)}-800 text-sm px-2 py-1 rounded-full flex items-center space-x-1`}>
                        <span>{getRiskIcon(aiAnalysis.disease_risk)}</span>
                        <span>{aiAnalysis.disease_risk}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Primary Concern</span>
                      <span className="text-sm font-medium text-gray-900">{aiAnalysis.diagnosis}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Analysis Confidence</span>
                      <span className="text-sm font-medium text-gray-900">{aiAnalysis.confidence_score}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Medications */}
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

              {/* Next Appointment */}
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

              {/* Health Pathways */}
              {aiAnalysis && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Pathway Scores</h3>
                  <div className="space-y-4">
                    {Object.entries(aiAnalysis.pathway_scores).map(([pathway, score]) => (
                      <div key={pathway}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {pathway.replace('_', ' ')} 
                          </span>
                          <span className="text-sm font-medium text-gray-900">{score.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              score < 25 ? 'bg-green-500' :
                              score < 50 ? 'bg-yellow-500' :
                              score < 75 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Recommendations */}
              {aiAnalysis && aiAnalysis.recommendations && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Recommendations</h3>
                  <div className="space-y-2">
                    {aiAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-sm text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
          <div className="space-y-6">
            {/* Analysis Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">AI Health Analysis</h2>
                  <p className="text-gray-600 mt-1">
                    Powered by machine learning model analyzing your health patterns
                  </p>
                </div>
                <button
                  onClick={() => triggerAIAnalysis(medicalRecords)}
                  disabled={analyzing || medicalRecords.length === 0}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {analyzing ? 'Analyzing...' : 'Refresh Analysis'}
                </button>
              </div>
            </div>

            {analyzing ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Your Health Data</h3>
                <p className="text-gray-600">Our AI model is processing your health records...</p>
              </div>
            ) : aiAnalysis ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Assessment */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Health Risk Assessment</h3>
                  
                  {/* Overall Risk */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-medium text-gray-700">Overall Health Risk</span>
                      <span className={`bg-${getRiskColor(aiAnalysis.disease_risk)}-100 text-${getRiskColor(aiAnalysis.disease_risk)}-800 text-sm px-3 py-1 rounded-full flex items-center space-x-2`}>
                        <span className="text-lg">{getRiskIcon(aiAnalysis.disease_risk)}</span>
                        <span className="font-semibold">{aiAnalysis.disease_risk} Risk</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full ${
                          aiAnalysis.disease_risk === 'Low' ? 'bg-green-500' :
                          aiAnalysis.disease_risk === 'Moderate' ? 'bg-yellow-500' :
                          aiAnalysis.disease_risk === 'High' ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ 
                          width: aiAnalysis.disease_risk === 'Low' ? '25%' :
                                 aiAnalysis.disease_risk === 'Moderate' ? '50%' :
                                 aiAnalysis.disease_risk === 'High' ? '75%' : '90%'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Primary Diagnosis */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">Primary Assessment</h4>
                    <p className="text-gray-900 font-semibold">{aiAnalysis.diagnosis}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Confidence: {aiAnalysis.confidence_score}%
                    </p>
                  </div>

                  {/* Key Factors */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Key Risk Factors</h4>
                    <div className="space-y-2">
                      {aiAnalysis.key_factors.map((factor, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-red-500">•</span>
                          <span className="text-sm text-gray-700">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pathway Analysis */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Health Pathway Analysis</h3>
                  
                  <div className="space-y-6">
                    {Object.entries(aiAnalysis.pathway_scores).map(([pathway, score]) => (
                      <div key={pathway}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700 capitalize">
                            {pathway.replace(/_/g, ' ')}
                          </span>
                          <span className={`text-sm font-semibold ${
                            score < 25 ? 'text-green-600' :
                            score < 50 ? 'text-yellow-600' :
                            score < 75 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {score.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${
                              score < 25 ? 'bg-green-500' :
                              score < 50 ? 'bg-yellow-500' :
                              score < 75 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {score < 25 ? 'Low risk' :
                           score < 50 ? 'Moderate risk' :
                           score < 75 ? 'High risk' : 'Critical risk'} pathway
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Health Score */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Overall Health Score</span>
                      <span className="text-2xl font-bold text-blue-600">{aiAnalysis.health_score}%</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiAnalysis.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span className="text-gray-700">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Available</h3>
                <p className="text-gray-600 mb-4">
                  {medicalRecords.length === 0 
                    ? "Complete your medical records to enable AI health analysis."
                    : "Click the button above to generate your AI health analysis."}
                </p>
                {medicalRecords.length === 0 && (
                  <button
                    onClick={() => setActiveTab('records')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    View Medical Records
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}