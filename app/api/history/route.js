const { NextResponse } = require("next/server")
const connectToDatabase = require("@/lib/mongodb")
const History = require("@/models/History")
const User = require("@/models/User")

// Save a new report to history
async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { email, reportData } = body;

    if (!email || !reportData) {
      return NextResponse.json(
        { message: "email and reportData are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const userId = user._id;

    const newHistoryEntry = await History.create({
      userId,
      reportData
    });

    return NextResponse.json(
      { 
        message: "History saved successfully", 
        history: newHistoryEntry 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save history error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get history for a specific user
async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "email is required as a query parameter" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const userId = user._id;

    // Find all history entries for this user, sorted by newest first
    const userHistory = await History.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(
      { history: userHistory },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get history error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

module.exports = { POST, GET }
