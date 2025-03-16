import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the request URL
    const searchParams = request.nextUrl.searchParams;
    const tags = searchParams.get("tags") || "lst,community"; // Default to lst,community if not provided

    // Fetch tokens from Jupiter API with the specified tags
    const response = await axios.get(`https://tokens.jup.ag/tokens?tags=${tags}`);
    const tokens = response.data;

    return NextResponse.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message || error.toString() : "Unknown Error",
      success: false,
    });
  }
}
