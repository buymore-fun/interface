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
    const type = req.nextUrl.searchParams.get("type");

    if (!quoteAddress || !type) {
      throw new Error("Missing parameter(s)");
    }

    let timeFrom: number | undefined = undefined;
    if (type === "1m") {
      timeFrom = moment().utc().subtract(5, "hours").unix();
    } else if (type === "5m") {
      timeFrom = moment().utc().subtract(24, "hours").unix();
    } else if (type === "15m") {
      timeFrom = moment().utc().subtract(72, "hours").unix();
    } else if (type === "1H") {
      timeFrom = moment().utc().subtract(7, "days").unix();
    } else if (type === "4H") {
      timeFrom = moment().utc().subtract(14, "days").unix();
    }

    if (!timeFrom) {
      throw new Error("Invalid type");
    }

    const timeTo = moment().utc().unix();

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
