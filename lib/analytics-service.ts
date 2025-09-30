import type { Flight, Route, SeatUtilization, PricingRecommendation, RouteOptimization, Analytics } from "./types"
import { SeatUtilizationPredictor, PricingEngine, RouteOptimizer, RiskAssessment } from "./analytics-engine"

export class AnalyticsService {
  static async analyzeFlight(flight: Flight): Promise<{
    utilization: SeatUtilization
    pricing: PricingRecommendation
    risk: ReturnType<typeof RiskAssessment.assessCancellationRisk>
  }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    const utilization = SeatUtilizationPredictor.predictOccupancy(flight)
    const pricing = PricingEngine.generatePricingRecommendation(flight, utilization)
    const risk = RiskAssessment.assessCancellationRisk(flight, utilization)

    return { utilization, pricing, risk }
  }

  static async analyzeRoute(route: Route, flights: Flight[]): Promise<RouteOptimization> {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return RouteOptimizer.analyzeRoute(route, flights)
  }

  static async generateDashboardAnalytics(flights: Flight[]): Promise<Analytics> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const totalFlights = flights.length
    const totalSeats = flights.reduce((sum, f) => sum + f.totalSeats, 0)
    const bookedSeats = flights.reduce((sum, f) => sum + f.bookedSeats, 0)
    const averageLoadFactor = Math.round((bookedSeats / totalSeats) * 100)
    const emptySeatsToday = totalSeats - bookedSeats

    // Calculate potential revenue from empty seats
    const avgPrice = flights.reduce((sum, f) => sum + f.price, 0) / flights.length
    const revenueOpportunity = Math.round(emptySeatsToday * avgPrice * 0.6) // 60% of avg price

    // Count routes at risk (< 60% occupancy)
    const routesAtRisk = flights.filter((f) => f.bookedSeats / f.totalSeats < 0.6).length

    // Simulate community bookings
    const communityBookings = Math.round(totalFlights * 0.15 * Math.random())

    return {
      totalFlights,
      averageLoadFactor,
      emptySeatsToday,
      revenueOpportunity,
      routesAtRisk,
      communityBookings,
    }
  }

  static async getBestCommunityDeals(
    flights: Flight[],
  ): Promise<Array<Flight & { discount: number; communityPrice: number }>> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const deals = []

    for (const flight of flights) {
      const utilization = SeatUtilizationPredictor.predictOccupancy(flight)
      const pricing = PricingEngine.generatePricingRecommendation(flight, utilization)

      if (pricing.discount > 20 && pricing.targetAudience === "community") {
        deals.push({
          ...flight,
          discount: pricing.discount,
          communityPrice: pricing.recommendedPrice,
        })
      }
    }

    return deals.sort((a, b) => b.discount - a.discount).slice(0, 10)
  }
}
