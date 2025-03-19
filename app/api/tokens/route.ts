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

    // Create response with 5-minute cache
    const res = NextResponse.json({
      success: true,
      data: tokens,
    });

    // Set cache control headers for 5 minutes (300 seconds)
    res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");

    return res;
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message || error.toString() : "Unknown Error",
      success: false,
    });
  }
}
