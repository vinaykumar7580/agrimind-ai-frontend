import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Signup failed",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: data?.message || "Signup successful",
        data,
      },
      { status: 200 }
    );
  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}