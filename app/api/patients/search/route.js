// app/api/patients/search/route.js
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/model/User'

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const healthId = searchParams.get('healthId')

    if (!healthId) {
      return NextResponse.json(
        { error: 'Health ID is required' },
        { status: 400 }
      )
    }

    // Search for patient by Health ID
    const patient = await User.findOne({
      userId: healthId.toUpperCase(),
      userType: 'patient',
      isActive: true
    }).select('-password')

    if (!patient) {
      return NextResponse.json(
        { patients: [] },
        { status: 200 }
      )
    }

    // Format patient data
    const patientData = {
      id: patient.userId,
      name: patient.name,
      age: patient.personalInfo?.age,
      gender: patient.personalInfo?.gender,
      bloodGroup: patient.patientData?.bloodGroup,
      contact: patient.phone,
      address: patient.personalInfo?.address ? 
        `${patient.personalInfo.address.city}, ${patient.personalInfo.address.state}` : '',
      lastVisit: patient.lastLogin ? new Date(patient.lastLogin).toLocaleDateString() : 'Never'
    }

    return NextResponse.json({
      patients: [patientData]
    })

  } catch (error) {
    console.error('Patient search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}