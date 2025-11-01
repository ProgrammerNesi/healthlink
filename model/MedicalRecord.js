import mongoose from 'mongoose'

const MedicalRecordSchema = new mongoose.Schema({
  recordId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Patient Information (can be human or animal)
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientType: {
    type: String,
    enum: ['human', 'animal'],
    required: true
  },
  
  // Medical Professional
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  labId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Record Details
  recordType: {
    type: String,
    enum: ['consultation', 'lab_test', 'prescription', 'vaccination', 'surgery', 'follow_up'],
    required: true
  },
  
  // Symptoms & Diagnosis
  symptoms: {
    primary: [String],
    secondary: [String],
    duration: Number,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    }
  },
  
  // Vital Signs
  vitalSigns: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    bloodSugar: Number,
    weight: Number,
    height: Number
  },
  
  // Diagnosis
  diagnosis: {
    condition: String,
    description: String,
    confidence: {
      type: String,
      enum: ['suspected', 'confirmed']
    }
  },
  
  // Lab Results
  labResults: {
    testName: String,
    resultValue: String,
    normalRange: String,
    unit: String,
    labName: String
  },
  
  // Treatment
  treatment: {
    prescriptions: [{
      medicineName: String,
      dosage: String,
      frequency: String,
      duration: String
    }],
    recommendations: [String],
    followUpDate: Date
  },
  
  // AI Analysis Results
  aiAnalysis: {
    // Diabetes Risk (for humans)
    diabetesRisk: {
      riskScore: Number,
      riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      keyFactors: [String],
      confidence: Number,
      recommendations: [String]
    },
    
    // General Health Insights
    healthInsights: {
      overallHealth: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      },
      riskAreas: [String],
      warningSigns: [String],
      improvementSuggestions: [String]
    },
    
    // Animal Health Analysis
    animalHealth: {
      conditionRisk: String,
      vaccinationStatus: String,
      healthScore: Number,
      recommendations: [String]
    },
    
    // Pattern Detection
    patterns: {
      symptomPatterns: [String],
      trend: {
        type: String,
        enum: ['improving', 'stable', 'deteriorating']
      },
      anomalyDetected: Boolean
    },
    
    // AI Metadata
    analysisDate: {
      type: Date,
      default: Date.now
    },
    modelVersion: String,
    nextAnalysisDue: Date
  },
  
  // Additional Info
  notes: String,
  hospital: String,
  visitType: {
    type: String,
    enum: ['in_person', 'teleconsultation', 'emergency']
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
})

// Indexes for better query performance
MedicalRecordSchema.index({ patientId: 1, createdAt: -1 })
MedicalRecordSchema.index({ doctorId: 1 })
MedicalRecordSchema.index({ recordType: 1 })
MedicalRecordSchema.index({ 'aiAnalysis.diabetesRisk.riskLevel': 1 })
MedicalRecordSchema.index({ 'aiAnalysis.analysisDate': 1 })

export default mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', MedicalRecordSchema)