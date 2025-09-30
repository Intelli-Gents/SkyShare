import type { Flight, Route } from "./types"

export interface OptimizationScenario {
  id: string
  name: string
  description: string
  changes: {
    scheduleAdjustments?: { flightId: string; newDepartureTime: string; newArrivalTime: string }[]
    frequencyChanges?: { routeId: string; newFrequency: number }[]
    aircraftChanges?: { flightId: string; newAircraft: string; newCapacity: number }[]
    routeConsolidations?: { flightIds: string[]; consolidatedFlightId: string }[]
  }
  projectedImpact: {
    loadFactorImprovement: number
    revenueIncrease: number
    costSavings: number
    emptySeatsReduction: number
  }
  implementationComplexity: "low" | "medium" | "high"
  timeToImplement: string
}

export interface WhatIfSimulation {
  scenarioId: string
  baselineMetrics: {
    totalRevenue: number
    averageLoadFactor: number
    totalEmptySeats: number
    operatingCosts: number
  }
  simulatedMetrics: {
    totalRevenue: number
    averageLoadFactor: number
    totalEmptySeats: number
    operatingCosts: number
  }
  improvements: {
    revenueGain: number
    loadFactorGain: number
    emptySeatsReduction: number
    costSavings: number
    roi: number
  }
}

export class RouteOptimizationEngine {
  // Generate optimization scenarios based on current performance
  static generateOptimizationScenarios(flights: Flight[], routes: Route[]): OptimizationScenario[] {
    const scenarios: OptimizationScenario[] = []

    // Scenario 1: Peak Time Optimization
    scenarios.push({
      id: "peak-time-optimization",
      name: "Peak Time Schedule Optimization",
      description: "Adjust flight times to match peak demand periods and reduce off-peak empty seats",
      changes: {
        scheduleAdjustments: this.generatePeakTimeAdjustments(flights),
      },
      projectedImpact: {
        loadFactorImprovement: 12,
        revenueIncrease: 180000,
        costSavings: 45000,
        emptySeatsReduction: 320,
      },
      implementationComplexity: "medium",
      timeToImplement: "2-4 weeks",
    })

    // Scenario 2: Route Consolidation
    scenarios.push({
      id: "route-consolidation",
      name: "Low-Performance Route Consolidation",
      description: "Merge underperforming flights to improve load factors and reduce operational costs",
      changes: {
        routeConsolidations: this.generateConsolidationRecommendations(flights),
        frequencyChanges: this.generateFrequencyAdjustments(routes),
      },
      projectedImpact: {
        loadFactorImprovement: 18,
        revenueIncrease: 95000,
        costSavings: 125000,
        emptySeatsReduction: 450,
      },
      implementationComplexity: "high",
      timeToImplement: "6-8 weeks",
    })

    // Scenario 3: Aircraft Right-Sizing
    scenarios.push({
      id: "aircraft-rightsizing",
      name: "Aircraft Capacity Optimization",
      description: "Match aircraft size to route demand to minimize empty seats and maximize efficiency",
      changes: {
        aircraftChanges: this.generateAircraftOptimizations(flights),
      },
      projectedImpact: {
        loadFactorImprovement: 15,
        revenueIncrease: 220000,
        costSavings: 85000,
        emptySeatsReduction: 380,
      },
      implementationComplexity: "medium",
      timeToImplement: "4-6 weeks",
    })

    // Scenario 4: Frequency Optimization
    scenarios.push({
      id: "frequency-optimization",
      name: "Route Frequency Adjustment",
      description: "Optimize flight frequency based on demand patterns and seasonal variations",
      changes: {
        frequencyChanges: this.generateSmartFrequencyChanges(routes, flights),
      },
      projectedImpact: {
        loadFactorImprovement: 10,
        revenueIncrease: 150000,
        costSavings: 65000,
        emptySeatsReduction: 280,
      },
      implementationComplexity: "low",
      timeToImplement: "1-2 weeks",
    })

    return scenarios
  }

  private static generatePeakTimeAdjustments(flights: Flight[]) {
    return flights
      .filter((f) => {
        const hour = Number.parseInt(f.departureTime.split(":")[0])
        return hour < 8 || hour > 20 // Off-peak times
      })
      .slice(0, 5)
      .map((flight) => ({
        flightId: flight.id,
        newDepartureTime: "09:00", // Move to peak morning time
        newArrivalTime: this.calculateNewArrivalTime("09:00", flight.departureTime, flight.arrivalTime),
      }))
  }

  private static generateConsolidationRecommendations(flights: Flight[]) {
    const lowPerformanceFlights = flights.filter((f) => f.bookedSeats / f.totalSeats < 0.6)
    const consolidations = []

    for (let i = 0; i < lowPerformanceFlights.length - 1; i += 2) {
      if (lowPerformanceFlights[i + 1]) {
        consolidations.push({
          flightIds: [lowPerformanceFlights[i].id, lowPerformanceFlights[i + 1].id],
          consolidatedFlightId: `CONSOLIDATED_${lowPerformanceFlights[i].id}_${lowPerformanceFlights[i + 1].id}`,
        })
      }
    }

    return consolidations.slice(0, 3) // Limit to 3 consolidations
  }

  private static generateFrequencyAdjustments(routes: Route[]) {
    return routes.map((route) => {
      let newFrequency = route.frequency

      if (route.averageLoadFactor > 85) {
        newFrequency = Math.min(21, route.frequency + 2) // Increase frequency
      } else if (route.averageLoadFactor < 60) {
        newFrequency = Math.max(7, route.frequency - 1) // Decrease frequency
      }

      return {
        routeId: route.id,
        newFrequency,
      }
    })
  }

  private static generateAircraftOptimizations(flights: Flight[]) {
    return flights
      .map((flight) => {
        const loadFactor = flight.bookedSeats / flight.totalSeats
        let newAircraft = flight.aircraft
        let newCapacity = flight.totalSeats

        if (loadFactor < 0.5 && flight.totalSeats > 150) {
          // Downsize aircraft
          newAircraft = "Airbus A320"
          newCapacity = 150
        } else if (loadFactor > 0.9 && flight.totalSeats < 250) {
          // Upsize aircraft
          newAircraft = "Boeing 777"
          newCapacity = 300
        }

        return {
          flightId: flight.id,
          newAircraft,
          newCapacity,
        }
      })
      .filter((change) => change.newAircraft !== flights.find((f) => f.id === change.flightId)?.aircraft)
      .slice(0, 6)
  }

  private static generateSmartFrequencyChanges(routes: Route[], flights: Flight[]) {
    return routes.map((route) => {
      const routeFlights = flights.filter((f) => f.origin === route.origin && f.destination === route.destination)
      const avgLoadFactor = routeFlights.reduce((sum, f) => sum + f.bookedSeats / f.totalSeats, 0) / routeFlights.length

      let newFrequency = route.frequency

      // Seasonal and performance-based adjustments
      if (route.seasonality === "high" && avgLoadFactor > 0.8) {
        newFrequency = Math.min(21, route.frequency + 3)
      } else if (route.seasonality === "low" && avgLoadFactor < 0.6) {
        newFrequency = Math.max(7, route.frequency - 2)
      }

      return {
        routeId: route.id,
        newFrequency,
      }
    })
  }

  private static calculateNewArrivalTime(
    newDepartureTime: string,
    oldDepartureTime: string,
    oldArrivalTime: string,
  ): string {
    // Simple time calculation - in real app would consider flight duration and time zones
    const [newDepHour, newDepMin] = newDepartureTime.split(":").map(Number)
    const [oldDepHour, oldDepMin] = oldDepartureTime.split(":").map(Number)
    const [oldArrHour, oldArrMin] = oldArrivalTime.split(":").map(Number)

    const flightDurationMinutes = oldArrHour * 60 + oldArrMin - (oldDepHour * 60 + oldDepMin)
    const newArrivalMinutes = newDepHour * 60 + newDepMin + flightDurationMinutes

    const newArrHour = Math.floor(newArrivalMinutes / 60) % 24
    const newArrMin = newArrivalMinutes % 60

    return `${newArrHour.toString().padStart(2, "0")}:${newArrMin.toString().padStart(2, "0")}`
  }

  // Run "What If" simulation for a scenario
  static runWhatIfSimulation(scenario: OptimizationScenario, flights: Flight[]): WhatIfSimulation {
    // Calculate baseline metrics
    const baselineMetrics = this.calculateBaselineMetrics(flights)

    // Simulate the scenario changes
    const simulatedFlights = this.applyScenarioChanges(flights, scenario)
    const simulatedMetrics = this.calculateBaselineMetrics(simulatedFlights)

    // Calculate improvements
    const improvements = {
      revenueGain: simulatedMetrics.totalRevenue - baselineMetrics.totalRevenue,
      loadFactorGain: simulatedMetrics.averageLoadFactor - baselineMetrics.averageLoadFactor,
      emptySeatsReduction: baselineMetrics.totalEmptySeats - simulatedMetrics.totalEmptySeats,
      costSavings: baselineMetrics.operatingCosts - simulatedMetrics.operatingCosts,
      roi: 0, // Will be calculated below
    }

    improvements.roi = (improvements.revenueGain / Math.max(1, improvements.costSavings)) * 100

    return {
      scenarioId: scenario.id,
      baselineMetrics,
      simulatedMetrics,
      improvements,
    }
  }

  private static calculateBaselineMetrics(flights: Flight[]) {
    const totalRevenue = flights.reduce((sum, f) => sum + f.bookedSeats * f.price, 0)
    const totalSeats = flights.reduce((sum, f) => sum + f.totalSeats, 0)
    const bookedSeats = flights.reduce((sum, f) => sum + f.bookedSeats, 0)
    const averageLoadFactor = (bookedSeats / totalSeats) * 100
    const totalEmptySeats = totalSeats - bookedSeats
    const operatingCosts = flights.length * 25000 // Simplified cost calculation

    return {
      totalRevenue,
      averageLoadFactor,
      totalEmptySeats,
      operatingCosts,
    }
  }

  private static applyScenarioChanges(flights: Flight[], scenario: OptimizationScenario): Flight[] {
    const simulatedFlights = [...flights]

    // Apply aircraft changes
    if (scenario.changes.aircraftChanges) {
      scenario.changes.aircraftChanges.forEach((change) => {
        const flightIndex = simulatedFlights.findIndex((f) => f.id === change.flightId)
        if (flightIndex !== -1) {
          simulatedFlights[flightIndex] = {
            ...simulatedFlights[flightIndex],
            aircraft: change.newAircraft,
            totalSeats: change.newCapacity,
            // Adjust booked seats proportionally but cap at new capacity
            bookedSeats: Math.min(change.newCapacity, Math.round(simulatedFlights[flightIndex].bookedSeats * 1.1)),
          }
        }
      })
    }

    // Apply schedule adjustments (would affect demand in real scenario)
    if (scenario.changes.scheduleAdjustments) {
      scenario.changes.scheduleAdjustments.forEach((change) => {
        const flightIndex = simulatedFlights.findIndex((f) => f.id === change.flightId)
        if (flightIndex !== -1) {
          simulatedFlights[flightIndex] = {
            ...simulatedFlights[flightIndex],
            departureTime: change.newDepartureTime,
            arrivalTime: change.newArrivalTime,
            // Simulate improved bookings for peak times
            bookedSeats: Math.round(simulatedFlights[flightIndex].bookedSeats * 1.15),
          }
        }
      })
    }

    return simulatedFlights
  }

  // Generate implementation roadmap
  static generateImplementationRoadmap(scenarios: OptimizationScenario[]): {
    phase: string
    scenarios: OptimizationScenario[]
    duration: string
    expectedBenefits: string
  }[] {
    const lowComplexity = scenarios.filter((s) => s.implementationComplexity === "low")
    const mediumComplexity = scenarios.filter((s) => s.implementationComplexity === "medium")
    const highComplexity = scenarios.filter((s) => s.implementationComplexity === "high")

    return [
      {
        phase: "Phase 1: Quick Wins",
        scenarios: lowComplexity,
        duration: "1-3 weeks",
        expectedBenefits: "Immediate load factor improvements with minimal disruption",
      },
      {
        phase: "Phase 2: Strategic Adjustments",
        scenarios: mediumComplexity,
        duration: "4-8 weeks",
        expectedBenefits: "Significant revenue gains through schedule and capacity optimization",
      },
      {
        phase: "Phase 3: Structural Changes",
        scenarios: highComplexity,
        duration: "6-12 weeks",
        expectedBenefits: "Long-term efficiency gains through route consolidation and network redesign",
      },
    ]
  }
}
