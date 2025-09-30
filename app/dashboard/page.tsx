"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Plane, TrendingUp, AlertTriangle, DollarSign, Users, Clock, MapPin } from "lucide-react"
import { mockFlights, mockRoutes, mockAnalytics } from "@/lib/mock-data"
import { AnalyticsService } from "@/lib/analytics-service"
import type { Analytics, SeatUtilization, PricingRecommendation } from "@/lib/types"

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics>(mockAnalytics)
  const [flightAnalytics, setFlightAnalytics] = useState<
    Map<
      string,
      {
        utilization: SeatUtilization
        pricing: PricingRecommendation
        risk: any
      }
    >
  >(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true)

      // Load dashboard analytics
      const dashboardData = await AnalyticsService.generateDashboardAnalytics(mockFlights)
      setAnalytics(dashboardData)

      // Load individual flight analytics
      const flightData = new Map()
      for (const flight of mockFlights) {
        const analysis = await AnalyticsService.analyzeFlight(flight)
        flightData.set(flight.id, analysis)
      }
      setFlightAnalytics(flightData)

      setLoading(false)
    }

    loadAnalytics()
  }, [])

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500"
      case "delayed":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Plane className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Airline Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">AI-powered analytics and optimization insights</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Live Data
              </Badge>
              <Button variant="outline">Export Report</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalFlights}</div>
              <p className="text-xs text-muted-foreground">Today's schedule</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Load Factor</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averageLoadFactor}%</div>
              <Progress value={analytics.averageLoadFactor} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empty Seats</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.emptySeatsToday.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Revenue opportunity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Potential</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analytics.revenueOpportunity.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From empty seats</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="flights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="flights">Flight Analysis</TabsTrigger>
            <TabsTrigger value="routes">Route Optimization</TabsTrigger>
            <TabsTrigger value="pricing">Dynamic Pricing</TabsTrigger>
            <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
          </TabsList>

          {/* Flight Analysis Tab */}
          <TabsContent value="flights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Flight Performance Analysis</CardTitle>
                <CardDescription>Real-time seat utilization predictions and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFlights.map((flight) => {
                    const analysis = flightAnalytics.get(flight.id)
                    if (!analysis) return null

                    const occupancyPercentage = (flight.bookedSeats / flight.totalSeats) * 100

                    return (
                      <div key={flight.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(flight.status)}>{flight.flightNumber}</Badge>
                              <span className="font-medium">{flight.airline}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              {flight.origin} → {flight.destination}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              {flight.departureTime}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${getRiskColor(analysis.utilization.riskLevel)} text-white`}
                          >
                            {analysis.utilization.riskLevel.toUpperCase()} RISK
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Current Occupancy</p>
                            <div className="flex items-center gap-2">
                              <Progress value={occupancyPercentage} className="flex-1" />
                              <span className="text-sm font-medium">{Math.round(occupancyPercentage)}%</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {flight.bookedSeats}/{flight.totalSeats} seats
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600 mb-1">Predicted Occupancy</p>
                            <div className="flex items-center gap-2">
                              <Progress value={analysis.utilization.predictedOccupancy} className="flex-1" />
                              <span className="text-sm font-medium">{analysis.utilization.predictedOccupancy}%</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{analysis.utilization.confidence}% confidence</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600 mb-1">Empty Seats</p>
                            <div className="text-2xl font-bold text-orange-600">{analysis.utilization.emptySeats}</div>
                            <p className="text-xs text-gray-500">
                              Potential revenue: $
                              {(analysis.utilization.emptySeats * flight.price * 0.6).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {analysis.utilization.recommendations.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">AI Recommendations:</p>
                            <div className="flex flex-wrap gap-2">
                              {analysis.utilization.recommendations.map((rec, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {rec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Route Optimization Tab */}
          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Route Performance & Optimization</CardTitle>
                <CardDescription>Analyze route efficiency and get optimization recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRoutes.map((route) => (
                    <div key={route.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {route.origin} → {route.destination}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {route.distance} miles • {route.frequency} flights/week
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{route.averageLoadFactor}%</div>
                          <p className="text-xs text-gray-500">Load Factor</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Seasonality</p>
                          <Badge variant={route.seasonality === "high" ? "default" : "secondary"}>
                            {route.seasonality.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Profitability Score</p>
                          <div className="flex items-center gap-2">
                            <Progress value={route.profitability} className="flex-1" />
                            <span className="text-sm font-medium">{route.profitability}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Optimization Potential</p>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              +{Math.round(Math.random() * 15 + 5)}% improvement
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-2">Optimization Suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Adjust timing to 08:00</Badge>
                          <Badge variant="outline">Increase frequency by 2</Badge>
                          <Badge variant="outline">Consider larger aircraft</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dynamic Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dynamic Pricing Recommendations</CardTitle>
                <CardDescription>
                  AI-powered pricing strategies to maximize revenue and fill empty seats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFlights.map((flight) => {
                    const analysis = flightAnalytics.get(flight.id)
                    if (!analysis) return null

                    return (
                      <div key={flight.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{flight.flightNumber}</h3>
                            <p className="text-sm text-gray-600">
                              {flight.origin} → {flight.destination} • {flight.departureTime}
                            </p>
                          </div>
                          <Badge variant={analysis.pricing.urgency === "high" ? "destructive" : "secondary"}>
                            {analysis.pricing.urgency.toUpperCase()} PRIORITY
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Current Price</p>
                            <div className="text-xl font-bold">${flight.price}</div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Recommended Price</p>
                            <div className="text-xl font-bold text-green-600">${analysis.pricing.recommendedPrice}</div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Discount</p>
                            <div className="text-xl font-bold text-red-600">-{analysis.pricing.discount}%</div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Target Audience</p>
                            <Badge variant="outline">{analysis.pricing.targetAudience.toUpperCase()}</Badge>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">
                              Potential additional revenue:
                              <span className="font-medium text-green-600 ml-1">
                                $
                                {Math.round(
                                  analysis.utilization.emptySeats * analysis.pricing.recommendedPrice * 0.3,
                                ).toLocaleString()}
                              </span>
                            </p>
                          </div>
                          <Button size="sm">Apply Pricing</Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Assessment Tab */}
          <TabsContent value="risks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Flight Risk Assessment</CardTitle>
                <CardDescription>Identify flights at risk of cancellation or poor performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFlights.map((flight) => {
                    const analysis = flightAnalytics.get(flight.id)
                    if (!analysis) return null

                    return (
                      <div key={flight.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{flight.flightNumber}</h3>
                            <p className="text-sm text-gray-600">
                              {flight.airline} • {flight.origin} → {flight.destination}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-600">{analysis.risk.riskScore}</div>
                            <p className="text-xs text-gray-500">Risk Score</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Risk Factors:</p>
                          <div className="flex flex-wrap gap-2">
                            {analysis.risk.factors.map((factor: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Recommendation: {analysis.risk.recommendation}
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            <Button size="sm">Take Action</Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
