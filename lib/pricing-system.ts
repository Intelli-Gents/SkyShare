import type { Flight } from "./types"

export interface PriceUpdate {
  flightId: string
  oldPrice: number
  newPrice: number
  discount: number
  reason: string
  timestamp: Date
  validUntil: Date
}

export interface MarketConditions {
  demandLevel: "low" | "medium" | "high"
  competitorPricing: number
  seasonalMultiplier: number
  timeToDepature: number
  weatherImpact: number
}

export class RealTimePricingSystem {
  private static priceHistory: Map<string, PriceUpdate[]> = new Map()
  private static activeSubscriptions: Map<string, ((update: PriceUpdate) => void)[]> = new Map()

  // Real-time price calculation based on multiple factors
  static calculateRealTimePrice(flight: Flight, marketConditions: MarketConditions, utilizationData: any): PriceUpdate {
    const basePrice = flight.price
    let adjustmentFactor = 1.0

    // Demand-based pricing
    switch (marketConditions.demandLevel) {
      case "high":
        adjustmentFactor *= 1.2
        break
      case "low":
        adjustmentFactor *= 0.8
        break
      default:
        adjustmentFactor *= 1.0
    }

    // Time-based pricing (closer to departure = more dynamic)
    const hoursUntilDeparture = marketConditions.timeToDepature
    if (hoursUntilDeparture < 24) {
      // Last 24 hours - aggressive pricing
      if (utilizationData.predictedOccupancy < 60) {
        adjustmentFactor *= 0.6 // Deep discount
      } else if (utilizationData.predictedOccupancy > 90) {
        adjustmentFactor *= 1.3 // Premium pricing
      }
    } else if (hoursUntilDeparture < 72) {
      // 1-3 days - moderate adjustments
      if (utilizationData.predictedOccupancy < 70) {
        adjustmentFactor *= 0.8
      }
    }

    // Competitor pricing influence
    const competitorRatio = marketConditions.competitorPricing / basePrice
    if (competitorRatio < 0.9) {
      adjustmentFactor *= 0.95 // Match competitor pricing
    } else if (competitorRatio > 1.1) {
      adjustmentFactor *= 1.05 // Take advantage of higher competitor prices
    }

    // Seasonal adjustments
    adjustmentFactor *= marketConditions.seasonalMultiplier

    // Weather impact
    adjustmentFactor *= 1 + marketConditions.weatherImpact

    const newPrice = Math.round(basePrice * adjustmentFactor)
    const discount = Math.max(0, Math.round(((basePrice - newPrice) / basePrice) * 100))

    const reason = this.generatePriceChangeReason(adjustmentFactor, marketConditions, utilizationData)

    const priceUpdate: PriceUpdate = {
      flightId: flight.id,
      oldPrice: basePrice,
      newPrice,
      discount,
      reason,
      timestamp: new Date(),
      validUntil: new Date(Date.now() + 30 * 60 * 1000), // Valid for 30 minutes
    }

    // Store price history
    if (!this.priceHistory.has(flight.id)) {
      this.priceHistory.set(flight.id, [])
    }
    this.priceHistory.get(flight.id)!.push(priceUpdate)

    // Notify subscribers
    this.notifySubscribers(flight.id, priceUpdate)

    return priceUpdate
  }

  private static generatePriceChangeReason(
    adjustmentFactor: number,
    conditions: MarketConditions,
    utilization: any,
  ): string {
    if (adjustmentFactor < 0.7) {
      return "Flash sale - Low demand detected"
    } else if (adjustmentFactor < 0.9) {
      return "Community discount - Empty seats available"
    } else if (adjustmentFactor > 1.2) {
      return "High demand pricing"
    } else if (conditions.timeToDepature < 24) {
      return "Last-minute pricing adjustment"
    } else if (conditions.weatherImpact > 0.1) {
      return "Weather-related demand increase"
    } else {
      return "Market-based pricing update"
    }
  }

  // Subscribe to price updates for a specific flight
  static subscribeToPriceUpdates(flightId: string, callback: (update: PriceUpdate) => void): () => void {
    if (!this.activeSubscriptions.has(flightId)) {
      this.activeSubscriptions.set(flightId, [])
    }
    this.activeSubscriptions.get(flightId)!.push(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.activeSubscriptions.get(flightId)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  private static notifySubscribers(flightId: string, update: PriceUpdate): void {
    const callbacks = this.activeSubscriptions.get(flightId)
    if (callbacks) {
      callbacks.forEach((callback) => callback(update))
    }
  }

  // Get price history for a flight
  static getPriceHistory(flightId: string): PriceUpdate[] {
    return this.priceHistory.get(flightId) || []
  }

  // Simulate market conditions (in real app, this would come from external APIs)
  static generateMarketConditions(flight: Flight): MarketConditions {
    const now = new Date()
    const departureTime = new Date(`${flight.date}T${flight.departureTime}:00`)
    const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    // Simulate demand based on route popularity
    const popularRoutes = ["JFK-LAX", "ORD-SFO", "ATL-MIA"]
    const routeKey = `${flight.origin}-${flight.destination}`
    const isPopularRoute = popularRoutes.includes(routeKey)

    let demandLevel: "low" | "medium" | "high" = "medium"
    if (isPopularRoute && hoursUntilDeparture < 48) {
      demandLevel = "high"
    } else if (!isPopularRoute || hoursUntilDeparture > 168) {
      demandLevel = "low"
    }

    // Simulate competitor pricing (±20% of base price)
    const competitorPricing = flight.price * (0.8 + Math.random() * 0.4)

    // Seasonal multiplier (simulate peak/off-peak)
    const month = now.getMonth()
    const isHighSeason = month >= 5 && month <= 8 // Summer months
    const seasonalMultiplier = isHighSeason ? 1.1 : 0.95

    // Weather impact (random for simulation)
    const weatherImpact = (Math.random() - 0.5) * 0.2 // ±10% impact

    return {
      demandLevel,
      competitorPricing,
      seasonalMultiplier,
      timeToDepature: Math.max(0, hoursUntilDeparture),
      weatherImpact,
    }
  }

  // Batch update prices for multiple flights
  static async batchUpdatePrices(flights: Flight[]): Promise<PriceUpdate[]> {
    const updates: PriceUpdate[] = []

    for (const flight of flights) {
      // Simulate some delay for realistic pricing updates
      await new Promise((resolve) => setTimeout(resolve, 50))

      const marketConditions = this.generateMarketConditions(flight)
      const utilizationData = { predictedOccupancy: (flight.bookedSeats / flight.totalSeats) * 100 }

      const update = this.calculateRealTimePrice(flight, marketConditions, utilizationData)
      updates.push(update)
    }

    return updates
  }

  // Get current best deals across all flights
  static getBestCurrentDeals(priceUpdates: PriceUpdate[]): PriceUpdate[] {
    return priceUpdates
      .filter((update) => update.discount > 15) // Only significant discounts
      .sort((a, b) => b.discount - a.discount) // Sort by highest discount
      .slice(0, 10) // Top 10 deals
  }

  // Price trend analysis
  static analyzePriceTrend(flightId: string): {
    trend: "increasing" | "decreasing" | "stable"
    averagePrice: number
    priceVolatility: number
  } {
    const history = this.getPriceHistory(flightId)
    if (history.length < 2) {
      return { trend: "stable", averagePrice: 0, priceVolatility: 0 }
    }

    const prices = history.map((h) => h.newPrice)
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length

    // Calculate trend
    const recentPrices = prices.slice(-5) // Last 5 price points
    const firstPrice = recentPrices[0]
    const lastPrice = recentPrices[recentPrices.length - 1]
    const priceChange = (lastPrice - firstPrice) / firstPrice

    let trend: "increasing" | "decreasing" | "stable" = "stable"
    if (priceChange > 0.05) trend = "increasing"
    else if (priceChange < -0.05) trend = "decreasing"

    // Calculate volatility (standard deviation)
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - averagePrice, 2), 0) / prices.length
    const priceVolatility = Math.sqrt(variance)

    return { trend, averagePrice, priceVolatility }
  }
}

// Price alert system
export class PriceAlertSystem {
  private static alerts: Map<string, { threshold: number; callback: (price: number) => void }[]> = new Map()

  static createPriceAlert(flightId: string, threshold: number, callback: (price: number) => void): () => void {
    if (!this.alerts.has(flightId)) {
      this.alerts.set(flightId, [])
    }

    const alert = { threshold, callback }
    this.alerts.get(flightId)!.push(alert)

    // Return function to remove alert
    return () => {
      const flightAlerts = this.alerts.get(flightId)
      if (flightAlerts) {
        const index = flightAlerts.indexOf(alert)
        if (index > -1) {
          flightAlerts.splice(index, 1)
        }
      }
    }
  }

  static checkPriceAlerts(priceUpdate: PriceUpdate): void {
    const flightAlerts = this.alerts.get(priceUpdate.flightId)
    if (flightAlerts) {
      flightAlerts.forEach((alert) => {
        if (priceUpdate.newPrice <= alert.threshold) {
          alert.callback(priceUpdate.newPrice)
        }
      })
    }
  }
}
