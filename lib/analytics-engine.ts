import type { Flight, Route, SeatUtilization, PricingRecommendation, RouteOptimization } from "./types"

// AI-powered seat utilization predictor
export class SeatUtilizationPredictor {
  static predictOccupancy(flight: Flight, historicalData?: any[]): SeatUtilization {
    // Simulate AI prediction based on multiple factors
    const baseOccupancy = (flight.bookedSeats / flight.totalSeats) * 100

    // Factor in time until departure (closer = higher confidence)
    const hoursUntilDeparture = this.getHoursUntilDeparture(flight.date, flight.departureTime)
    const timeMultiplier = Math.max(0.5, 1 - hoursUntilDeparture / 168) // 7 days = 168 hours

    // Factor in route popularity and seasonality
    const routeMultiplier = this.getRoutePopularityMultiplier(flight.origin, flight.destination)

    // Factor in price competitiveness
    const priceMultiplier = this.getPriceCompetitivenessMultiplier(flight.price)

    const predictedOccupancy = Math.min(95, baseOccupancy * timeMultiplier * routeMultiplier * priceMultiplier)
    const confidence = Math.min(95, 60 + timeMultiplier * 35)
    const emptySeats = Math.max(0, flight.totalSeats - Math.round((flight.totalSeats * predictedOccupancy) / 100))

    let riskLevel: "low" | "medium" | "high" = "low"
    if (predictedOccupancy < 50) riskLevel = "high"
    else if (predictedOccupancy < 70) riskLevel = "medium"

    const recommendations = this.generateRecommendations(predictedOccupancy, emptySeats, hoursUntilDeparture)

    return {
      flightId: flight.id,
      predictedOccupancy: Math.round(predictedOccupancy),
      confidence: Math.round(confidence),
      emptySeats,
      riskLevel,
      recommendations,
    }
  }

  private static getHoursUntilDeparture(date: string, time: string): number {
    const flightDateTime = new Date(`${date}T${time}:00`)
    const now = new Date()
    return Math.max(0, (flightDateTime.getTime() - now.getTime()) / (1000 * 60 * 60))
  }

  private static getRoutePopularityMultiplier(origin: string, destination: string): number {
    // Simulate route popularity based on major airports
    const majorAirports = ["JFK", "LAX", "ORD", "ATL", "DFW", "DEN", "SFO", "LAS"]
    const originMajor = majorAirports.includes(origin)
    const destMajor = majorAirports.includes(destination)

    if (originMajor && destMajor) return 1.1
    if (originMajor || destMajor) return 1.05
    return 0.95
  }

  private static getPriceCompetitivenessMultiplier(price: number): number {
    // Simulate price competitiveness (lower prices = higher demand)
    if (price < 150) return 1.15
    if (price < 250) return 1.05
    if (price < 350) return 1.0
    return 0.9
  }

  private static generateRecommendations(occupancy: number, emptySeats: number, hoursUntil: number): string[] {
    const recommendations: string[] = []

    if (occupancy < 50) {
      recommendations.push("Consider flight consolidation or cancellation")
      recommendations.push("Implement aggressive community pricing")
    }

    if (occupancy < 70 && hoursUntil < 48) {
      recommendations.push("Activate last-minute pricing strategy")
      recommendations.push("Target local community outreach")
    }

    if (emptySeats > 50) {
      recommendations.push("Offer group booking incentives")
      recommendations.push("Consider aircraft downsizing for future schedules")
    }

    if (hoursUntil > 72 && occupancy < 60) {
      recommendations.push("Adjust marketing spend for this route")
      recommendations.push("Consider route timing optimization")
    }

    return recommendations
  }
}

// Dynamic pricing recommendation engine
export class PricingEngine {
  static generatePricingRecommendation(flight: Flight, utilization: SeatUtilization): PricingRecommendation {
    const currentPrice = flight.price
    let discount = 0
    let targetAudience: "community" | "business" | "leisure" = "leisure"
    let urgency: "low" | "medium" | "high" = "low"

    // Calculate discount based on predicted occupancy and time
    if (utilization.predictedOccupancy < 40) {
      discount = 40 + Math.random() * 20 // 40-60% discount
      urgency = "high"
      targetAudience = "community"
    } else if (utilization.predictedOccupancy < 60) {
      discount = 20 + Math.random() * 20 // 20-40% discount
      urgency = "medium"
      targetAudience = "community"
    } else if (utilization.predictedOccupancy < 80) {
      discount = 10 + Math.random() * 15 // 10-25% discount
      urgency = "low"
      targetAudience = "leisure"
    }

    const recommendedPrice = Math.round(currentPrice * (1 - discount / 100))

    return {
      flightId: flight.id,
      currentPrice,
      recommendedPrice,
      discount: Math.round(discount),
      targetAudience,
      urgency,
    }
  }

  static calculateRevenueImpact(flight: Flight, recommendation: PricingRecommendation): number {
    const additionalSeats = Math.min(
      flight.totalSeats - flight.bookedSeats,
      Math.round((recommendation.discount / 100) * 30), // Assume 30 seats max from pricing
    )

    return additionalSeats * recommendation.recommendedPrice
  }
}

// Route optimization engine
export class RouteOptimizer {
  static analyzeRoute(route: Route, flights: Flight[]): RouteOptimization {
    const routeFlights = flights.filter((f) => f.origin === route.origin && f.destination === route.destination)

    const currentPerformance = route.averageLoadFactor
    const avgOccupancy =
      (routeFlights.reduce((sum, f) => sum + f.bookedSeats / f.totalSeats, 0) / routeFlights.length) * 100

    // Analyze optimal timing
    const timeAnalysis = this.analyzeOptimalTiming(routeFlights)
    const frequencyAnalysis = this.analyzeOptimalFrequency(route, avgOccupancy)
    const aircraftAnalysis = this.analyzeOptimalAircraft(routeFlights)

    const expectedImprovement = this.calculateExpectedImprovement(
      currentPerformance,
      timeAnalysis.improvement,
      frequencyAnalysis.improvement,
      aircraftAnalysis.improvement,
    )

    let implementation: "immediate" | "next-season" | "long-term" = "next-season"
    if (expectedImprovement > 20) implementation = "immediate"
    else if (expectedImprovement < 10) implementation = "long-term"

    return {
      routeId: route.id,
      currentPerformance,
      optimizedSchedule: {
        departureTime: timeAnalysis.optimalTime,
        frequency: frequencyAnalysis.optimalFrequency,
        aircraft: aircraftAnalysis.optimalAircraft,
      },
      expectedImprovement: Math.round(expectedImprovement),
      implementation,
    }
  }

  private static analyzeOptimalTiming(flights: Flight[]) {
    // Simulate time analysis - morning flights typically perform better
    const morningFlights = flights.filter((f) => Number.parseInt(f.departureTime.split(":")[0]) < 12)
    const avgMorningOccupancy =
      morningFlights.reduce((sum, f) => sum + f.bookedSeats / f.totalSeats, 0) / morningFlights.length

    return {
      optimalTime: avgMorningOccupancy > 0.7 ? "08:00" : "14:00",
      improvement: Math.max(0, (avgMorningOccupancy - 0.6) * 100),
    }
  }

  private static analyzeOptimalFrequency(route: Route, avgOccupancy: number) {
    let optimalFrequency = route.frequency
    let improvement = 0

    if (avgOccupancy > 85) {
      optimalFrequency = Math.min(21, route.frequency + 3)
      improvement = 15
    } else if (avgOccupancy < 60) {
      optimalFrequency = Math.max(7, route.frequency - 2)
      improvement = 10
    }

    return { optimalFrequency, improvement }
  }

  private static analyzeOptimalAircraft(flights: Flight[]) {
    const avgOccupancy = flights.reduce((sum, f) => sum + f.bookedSeats / f.totalSeats, 0) / flights.length

    let optimalAircraft = "Boeing 737"
    let improvement = 0

    if (avgOccupancy > 0.85) {
      optimalAircraft = "Boeing 777"
      improvement = 12
    } else if (avgOccupancy < 0.6) {
      optimalAircraft = "Airbus A320"
      improvement = 8
    }

    return { optimalAircraft, improvement }
  }

  private static calculateExpectedImprovement(...improvements: number[]): number {
    return improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length
  }
}

// Risk assessment for flight cancellations
export class RiskAssessment {
  static assessCancellationRisk(
    flight: Flight,
    utilization: SeatUtilization,
  ): {
    riskScore: number
    factors: string[]
    recommendation: string
  } {
    let riskScore = 0
    const factors: string[] = []

    // Low occupancy increases risk
    if (utilization.predictedOccupancy < 40) {
      riskScore += 40
      factors.push("Very low predicted occupancy")
    } else if (utilization.predictedOccupancy < 60) {
      riskScore += 20
      factors.push("Below-average occupancy")
    }

    // Time factors
    const hoursUntil = this.getHoursUntilDeparture(flight.date, flight.departureTime)
    if (hoursUntil > 48 && utilization.predictedOccupancy < 50) {
      riskScore += 25
      factors.push("Low advance bookings")
    }

    // Route profitability
    if (flight.price < 200 && utilization.predictedOccupancy < 70) {
      riskScore += 15
      factors.push("Low-margin route with poor performance")
    }

    let recommendation = "Monitor closely"
    if (riskScore > 60) recommendation = "Consider consolidation or cancellation"
    else if (riskScore > 40) recommendation = "Implement aggressive marketing"

    return {
      riskScore: Math.min(100, riskScore),
      factors,
      recommendation,
    }
  }

  private static getHoursUntilDeparture(date: string, time: string): number {
    const flightDateTime = new Date(`${date}T${time}:00`)
    const now = new Date()
    return Math.max(0, (flightDateTime.getTime() - now.getTime()) / (1000 * 60 * 60))
  }
}
