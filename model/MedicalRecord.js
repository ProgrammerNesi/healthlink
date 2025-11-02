// models/MedicalRecord.js (Add this field)
import mongoose from 'mongoose'

const MedicalRecordSchema = new mongoose.Schema({
  recordId: {
    type: String,
    required: true,
    unique: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recordType: {
    type: String,
    required: true,
    enum: ['consultation', 'followup', 'emergency', 'routine', 'lab_test'],
    default: 'consultation'
  },
  dateOfVisit: {
    type: Date,
    required: true,
    default: Date.now
  },
  symptoms: {
    primary: [String],
    secondary: [String],
    duration: Number,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    description: String
  },
  vitalSigns: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number,
    oxygenSaturation: Number,
    respiratoryRate: Number
  },
  diagnosis: {
    condition: String,
    icdCode: String,
    description: String,
    confidence: {
      type: String,
      enum: ['suspected', 'confirmed']
    }
  },
  treatment: {
    prescriptions: [{
      medicineName: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    recommendations: [String],
    followUpDate: Date,
    notes: String
  },
  labResults: [{
    testName: String,
    resultValue: String,
    normalRange: String,
    unit: String,
    labName: String
  }],
  notes: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
})

// Indexes for better performance
MedicalRecordSchema.index({ patientId: 1, createdAt: -1 })
MedicalRecordSchema.index({ doctorId: 1 })
MedicalRecordSchema.index({ recordType: 1 })
MedicalRecordSchema.index({ dateOfVisit: -1 }) // Add index for date of visit

export default mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', MedicalRecordSchema)