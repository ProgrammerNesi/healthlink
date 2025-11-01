import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  // Authentication & Basic Info
  userId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true,
    enum: ['patient', 'doctor', 'lab', 'animal_owner', 'admin']
  },
  phone: String,
  
  // Personal Info (for patients & animal owners)
  personalInfo: {
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    }
  },
  
  // Patient Specific
  patientData: {
    aadhaarNumber: String,
    bloodGroup: String,
    allergies: [String],
    chronicConditions: [String]
  },
  
  // Doctor Specific
  doctorData: {
    registrationNumber: String,
    specialization: String,
    qualification: String,
    experience: Number,
    hospital: String,
    licenseExpiry: Date,
    verified: {
      type: Boolean,
      default: false
    }
  },
  
  // Lab Specific
  labData: {
    labName: String,
    labLicense: String,
    labType: String,
    address: String,
    testsAvailable: [String],
    verified: {
      type: Boolean,
      default: false
    }
  },
  
  // Animal Owner Specific
  animalData: {
    petsCount: Number,
    animalTypes: [String]
  },
  
  // Common
  profileImage: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  emailVerified: Date
}, {
  timestamps: true
})

// Indexes for better performance
UserSchema.index({ email: 1 })
UserSchema.index({ userType: 1 })
UserSchema.index({ 'doctorData.specialization': 1 })
UserSchema.index({ 'patientData.aadhaarNumber': 1 })
UserSchema.index({ userId: 1 })

export default mongoose.models.User || mongoose.model('User', UserSchema)