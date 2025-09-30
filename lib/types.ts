// Flight and route data types for airline analytics
export interface Flight {
  id: string
  flightNumber: string
  airline: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  aircraft: string
  totalSeats: number
  bookedSeats: number
  price: number
  status: "scheduled" | "delayed" | "cancelled" | "completed"
  date: string
}

export interface Route {
  id: string
  origin: string
  destination: string
  distance: number
  averageLoadFactor: number
  frequency: number // flights per week
  seasonality: "high" | "medium" | "low"
  profitability: number
}

export interface SeatUtilization {
  flightId: string
  predictedOccupancy: number
  confidence: number
  emptySeats: number
  riskLevel: "low" | "medium" | "high"
  recommendations: string[]
}

export interface PricingRecommendation {
  flightId: string
  currentPrice: number
  recommendedPrice: number
  discount: number
  targetAudience: "community" | "business" | "leisure"
  urgency: "low" | "medium" | "high"
}

export interface RouteOptimization {
  routeId: string
  currentPerformance: number
  optimizedSchedule: {
    departureTime: string
    frequency: number
    aircraft: string
  }
  expectedImprovement: number
  implementation: "immediate" | "next-season" | "long-term"
}

export interface Analytics {
  totalFlights: number
  averageLoadFactor: number
  emptySeatsToday: number
  revenueOpportunity: number
  routesAtRisk: number
  communityBookings: number
}
