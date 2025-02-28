import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import moment from "moment";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quoteAddress = req.nextUrl.searchParams.get("quote_address");

    const timeFrom = moment().utc().subtract(5, "hours").unix();
    const timeTo = moment().utc().unix();

    if (!quoteAddress) {
      throw new Error("Missing parameter(s)");
    }

    const res = await axios
      .get(
        `https://fe-api.jup.ag/api/v1/charts/${id}?quote_address=${quoteAddress}&type=1m&time_from=${timeFrom}&time_to=${timeTo}`
      )
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
