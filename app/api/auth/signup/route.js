const { NextResponse } = require("next/server")
const bcrypt = require("bcrypt")
const connectToDatabase = require("@/lib/mongodb")
const User = require("@/models/User")

async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json()
    const { firstName, lastName, email, password } = body

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      )
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    
    // Remove the password before sending the response to the client
    const userWithoutPassword = {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email
    };

    return NextResponse.json(
      { 
        message: "User created successfully", 
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

module.exports = { POST }