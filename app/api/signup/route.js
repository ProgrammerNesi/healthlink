import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/model/User'
import { hashPassword } from '@/lib/auth-utils'

// Generate unique user ID
function generateUserId(userType) {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  const prefix = userType === 'doctor' ? 'DOC' : userType === 'patient' ? 'PAT' : 'ANM'
  return `${prefix}_${timestamp}${random}`.toUpperCase()
}

export async function POST(request) {
  try {
    await dbConnect()

    const body = await request.json()
    const { 
      name, 
      email, 
      password, 
      userType, 
      phone, 
      age, 
      gender,
      aadhaarNumber, 
      registrationNumber, 
      specialization, 
      hospital 
    } = body

    // Validation
    if (!name || !email || !password || !userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Generate unique user ID
    const userId = generateUserId(userType)

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Prepare user data based on user type
    const userData = {
      userId,
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      userType,
      phone: phone || '',
      personalInfo: {
        age: age || undefined,
        gender: gender || undefined
      },
      isActive: true,
      lastLogin: new Date()
    }

    // Add user type specific data
    if (userType === 'patient') {
      userData.patientData = {
        aadhaarNumber: aadhaarNumber || '',
        bloodGroup: '',
        allergies: [],
        chronicConditions: []
      }
    } else if (userType === 'doctor') {
      userData.doctorData = {
        registrationNumber: registrationNumber || '',
        specialization: specialization || '',
        qualification: '',
        experience: 0,
        hospital: hospital || '',
        verified: false
      }
    } else if (userType === 'animal_owner') {
      userData.animalData = {
        petsCount: 0,
        animalTypes: []
      }
    }

    // Create user in database
    const user = await User.create(userData)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword
    }, { status: 201 })

  } catch (error) {
    console.error('Signup API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}