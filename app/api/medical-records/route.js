// app/api/medical-records/route.js (Updated)
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import MedicalRecord from '@/model/MedicalRecord'
import User from '@/model/User'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify the user is a doctor
    if (session.user.userType !== 'doctor') {
      return NextResponse.json(
        { error: 'Only doctors can create medical records' },
        { status: 403 }
      )
    }

    await dbConnect()

    const body = await request.json()
    const {
      patientId,
      symptoms,
      diagnosis,
      medications,
      weight,
      bloodPressure,
      oxygenLevel,
      notes,
      recordType,
      dateOfVisit // Add dateOfVisit to the destructuring
    } = body

    // Validate required fields
    if (!patientId || !symptoms || !diagnosis || !medications || !dateOfVisit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify patient exists
    const patient = await User.findOne({
      userId: patientId,
      userType: 'patient',
      isActive: true
    })

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    // Verify doctor exists
    const doctor = await User.findOne({
      userId: session.user.userId,
      userType: 'doctor',
      isActive: true
    })

    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      )
    }

    // Generate unique record ID
    const recordId = `REC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`.toUpperCase()

    // Create medical record with dateOfVisit
    const medicalRecord = await MedicalRecord.create({
      recordId,
      patientId: patient._id,
      doctorId: doctor._id,
      recordType: recordType || 'consultation',
      symptoms: {
        primary: symptoms.split(',').map(s => s.trim()),
        description: symptoms
      },
      diagnosis: {
        condition: diagnosis,
        description: diagnosis
      },
      vitalSigns: {
        weight: weight ? parseFloat(weight) : undefined,
        bloodPressure: bloodPressure || undefined,
        oxygenSaturation: oxygenLevel ? parseFloat(oxygenLevel) : undefined
      },
      treatment: {
        prescriptions: medications.split(',').map(med => ({
          medicineName: med.trim(),
          dosage: 'As prescribed',
          frequency: 'As needed'
        }))
      },
      notes: notes || '',
      dateOfVisit: new Date(dateOfVisit) // Store the date of visit
    })

    // Update patient's last visit to the date of visit
    await User.findByIdAndUpdate(patient._id, {
      lastLogin: new Date(dateOfVisit)
    })

    return NextResponse.json({
      success: true,
      message: 'Medical record created successfully',
      record: {
        id: medicalRecord.recordId,
        createdAt: medicalRecord.createdAt,
        dateOfVisit: medicalRecord.dateOfVisit
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create medical record error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}