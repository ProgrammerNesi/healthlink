// app/api/medical-records/patient/[patientId]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import MedicalRecord from '@/model/MedicalRecord'
import User from '@/model/User'

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()

    const { patientId } = await params

    // Verify the requesting user has access to these records
    if (session.user.userType === 'patient' && session.user.userId !== patientId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Find patient by Health ID
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

    // Get medical records for this patient, populated with doctor info
    const records = await MedicalRecord.find({ patientId: patient._id })
      .populate('doctorId', 'name userId specialization')
      .sort({ dateOfVisit: -1, createdAt: -1 })
      .lean()

    // Format the response
    const formattedRecords = records.map(record => ({
      _id: record._id,
      recordId: record.recordId,
      recordType: record.recordType,
      dateOfVisit: record.dateOfVisit,
      createdAt: record.createdAt,
      symptoms: record.symptoms,
      diagnosis: record.diagnosis,
      vitalSigns: record.vitalSigns,
      treatment: record.treatment,
      notes: record.notes,
      doctorId: {
        name: record.doctorId?.name || 'Unknown Doctor',
        userId: record.doctorId?.userId,
        specialization: record.doctorId?.specialization
      }
    }))

    return NextResponse.json({
      success: true,
      records: formattedRecords
    })

  } catch (error) {
    console.error('Get patient medical records error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}