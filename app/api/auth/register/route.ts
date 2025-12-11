import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check for MongoDB URI
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined');
      return NextResponse.json(
        { error: 'Database configuration error. Please check server configuration.' },
        { status: 500 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword,
      name: username, // Use username as display name
      visitedCountries: [],
      datedCountries: [],
      wishlistCountries: [],
    });

    // Generate token
    const token = generateToken({ userId: user._id.toString(), username: user.username });

    return NextResponse.json(
      {
        message: 'User created successfully',
        token,
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          visitedCountries: user.visitedCountries,
          datedCountries: user.datedCountries || [],
          wishlistCountries: user.wishlistCountries || [],
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

