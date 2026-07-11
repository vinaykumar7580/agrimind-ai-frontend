import { NextResponse } from "next/server";

export async function GET(req) {
  try {
      const token = req.cookies.get("token")?.value;

       if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Token not found.",
        },
        { status: 401 }
      );
    }

    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
      
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Profile fetch failed.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: data?.message || "Profile fetch successfully.",
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