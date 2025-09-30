import { type NextRequest, NextResponse } from "next/server"
import { mockFlights } from "@/lib/mock-data"
import { RealTimePricingSystem } from "@/lib/pricing-system"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const flightId = searchParams.get("flightId")

    if (flightId) {
      // Get specific flight pricing
      const flight = mockFlights.find((f) => f.id === flightId)
      if (!flight) {
        return NextResponse.json({ error: "Flight not found" }, { status: 404 })
      }

      const marketConditions = RealTimePricingSystem.generateMarketConditions(flight)
      const utilizationData = { predictedOccupancy: (flight.bookedSeats / flight.totalSeats) * 100 }
      const priceUpdate = RealTimePricingSystem.calculateRealTimePrice(flight, marketConditions, utilizationData)

      return NextResponse.json({
        success: true,
        priceUpdate,
        marketConditions,
      })
    } else {
      // Get all flight pricing updates
      const priceUpdates = await RealTimePricingSystem.batchUpdatePrices(mockFlights)
      const bestDeals = RealTimePricingSystem.getBestCurrentDeals(priceUpdates)

      return NextResponse.json({
        success: true,
        priceUpdates,
        bestDeals,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Real-time pricing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { flightIds } = body

    if (!flightIds || !Array.isArray(flightIds)) {
      return NextResponse.json({ error: "Invalid flight IDs" }, { status: 400 })
    }

    const flights = mockFlights.filter((f) => flightIds.includes(f.id))
    const priceUpdates = await RealTimePricingSystem.batchUpdatePrices(flights)

    return NextResponse.json({
      success: true,
      priceUpdates,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Batch pricing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
