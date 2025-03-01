import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const res = await axios
      .get(`https://worker.jup.ag/portfolio/${address}`)
      .then((res) => res.data);

    return NextResponse.json({
      success: true,
      data: res,
    });
  } catch (error) {
    return NextResponse.json({
      error:
        error instanceof Error
          ? error.message || error.toString()
          : "Unkown Error",
      success: false,
    });
  }
}
