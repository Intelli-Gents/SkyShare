import { type NextRequest, NextResponse } from "next/server"
import { RealTimePricingSystem } from "@/lib/pricing-system"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const flightId = searchParams.get("flightId")

    if (!flightId) {
      return NextResponse.json({ error: "Flight ID is required" }, { status: 400 })
    }

    const priceHistory = RealTimePricingSystem.getPriceHistory(flightId)
    const priceTrend = RealTimePricingSystem.analyzePriceTrend(flightId)

    return NextResponse.json({
      success: true,
      flightId,
      priceHistory,
      priceTrend,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Price history error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
