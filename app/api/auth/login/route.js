const { NextResponse } = require("next/server")
const bcrypt = require("bcrypt")
const connectToDatabase = require("@/lib/mongodb")
const User = require("@/models/User")

async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      )
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}

module.exports = { POST }