import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const res = await axios
      .get(`https://fe-api.jup.ag/api/v1/tokens/${id}`)
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
