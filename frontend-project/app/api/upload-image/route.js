import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const formData = await req.formData();

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized. Token not found.",
                },
                { status: 401 }
            );
        }


        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/scan/analyze`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
        );

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}