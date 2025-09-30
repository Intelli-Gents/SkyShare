"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  TrendingUp,
  Plane,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  Zap,
  CheckCircle,
  AlertCircle,
  PlayCircle,
} from "lucide-react"
import { mockFlights, mockRoutes } from "@/lib/mock-data"
import { RouteOptimizationEngine } from "@/lib/route-optimization"
import type { OptimizationScenario, WhatIfSimulation } from "@/lib/route-optimization"

export default function OptimizationPage() {
  const [scenarios, setScenarios] = useState<OptimizationScenario[]>([])
  const [simulations, setSimulations] = useState<Map<string, WhatIfSimulation>>(new Map())
  const [loading, setLoading] = useState(true)
  const [runningSimulation, setRunningSimulation] = useState<string | null>(null)

  useEffect(() => {
    const loadOptimizationData = async () => {
      setLoading(true)

      // Generate optimization scenarios
      const optimizationScenarios = RouteOptimizationEngine.generateOptimizationScenarios(mockFlights, mockRoutes)
      setScenarios(optimizationScenarios)

      // Run initial simulations for all scenarios
      const simulationResults = new Map()
      for (const scenario of optimizationScenarios) {
        const simulation = RouteOptimizationEngine.runWhatIfSimulation(scenario, mockFlights)
        simulationResults.set(scenario.id, simulation)
      }
      setSimulations(simulationResults)

      setLoading(false)
    }

    loadOptimizationData()
  }, [])

  const runSimulation = async (scenarioId: string) => {
    setRunningSimulation(scenarioId)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const scenario = scenarios.find((s) => s.id === scenarioId)
    if (scenario) {
      const simulation = RouteOptimizationEngine.runWhatIfSimulation(scenario, mockFlights)
      setSimulations((prev) => new Map(prev.set(scenarioId, simulation)))
    }

    setRunningSimulation(null)
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const roadmap = RouteOptimizationEngine.generateImplementationRoadmap(scenarios)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Generating optimization scenarios...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Route Optimization</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                AI-powered route optimization and "what if" scenario analysis
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Zap className="mr-1 h-3 w-3" />
                AI Optimized
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="scenarios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scenarios">Optimization Scenarios</TabsTrigger>
            <TabsTrigger value="simulations">What-If Simulations</TabsTrigger>
            <TabsTrigger value="roadmap">Implementation Roadmap</TabsTrigger>
          </TabsList>

          {/* Optimization Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-6">
            <div className="grid gap-6">
              {scenarios.map((scenario) => (
                <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5 text-blue-600" />
                          {scenario.name}
                        </CardTitle>
                        <CardDescription className="mt-2">{scenario.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getComplexityColor(scenario.implementationComplexity)}>
                          {scenario.implementationComplexity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{scenario.timeToImplement}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Projected Impact */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <BarChart3 className="h-5 w-5 text-blue-600 mr-1" />
                          <span className="text-sm text-gray-600">Load Factor</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          +{scenario.projectedImpact.loadFactorImprovement}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <DollarSign className="h-5 w-5 text-green-600 mr-1" />
                          <span className="text-sm text-gray-600">Revenue</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(scenario.projectedImpact.revenueIncrease)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <TrendingUp className="h-5 w-5 text-purple-600 mr-1" />
                          <span className="text-sm text-gray-600">Cost Savings</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          {formatCurrency(scenario.projectedImpact.costSavings)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Users className="h-5 w-5 text-orange-600 mr-1" />
                          <span className="text-sm text-gray-600">Empty Seats</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">
                          -{scenario.projectedImpact.emptySeatsReduction}
                        </div>
                      </div>
                    </div>

                    {/* Changes Summary */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Proposed Changes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {scenario.changes.scheduleAdjustments && (
                          <Badge variant="outline">
                            <Clock className="mr-1 h-3 w-3" />
                            {scenario.changes.scheduleAdjustments.length} Schedule Adjustments
                          </Badge>
                        )}
                        {scenario.changes.aircraftChanges && (
                          <Badge variant="outline">
                            <Plane className="mr-1 h-3 w-3" />
                            {scenario.changes.aircraftChanges.length} Aircraft Changes
                          </Badge>
                        )}
                        {scenario.changes.frequencyChanges && (
                          <Badge variant="outline">
                            <BarChart3 className="mr-1 h-3 w-3" />
                            {scenario.changes.frequencyChanges.length} Frequency Adjustments
                          </Badge>
                        )}
                        {scenario.changes.routeConsolidations && (
                          <Badge variant="outline">
                            <Settings className="mr-1 h-3 w-3" />
                            {scenario.changes.routeConsolidations.length} Route Consolidations
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        ROI:{" "}
                        <span className="font-medium text-green-600">
                          {Math.round(
                            (scenario.projectedImpact.revenueIncrease /
                              Math.max(1, scenario.projectedImpact.costSavings)) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => runSimulation(scenario.id)}
                          disabled={runningSimulation === scenario.id}
                        >
                          {runningSimulation === scenario.id ? (
                            <>
                              <Settings className="mr-2 h-4 w-4 animate-spin" />
                              Running...
                            </>
                          ) : (
                            <>
                              <PlayCircle className="mr-2 h-4 w-4" />
                              Run Simulation
                            </>
                          )}
                        </Button>
                        <Button>Implement Scenario</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* What-If Simulations Tab */}
          <TabsContent value="simulations" className="space-y-6">
            <div className="grid gap-6">
              {Array.from(simulations.entries()).map(([scenarioId, simulation]) => {
                const scenario = scenarios.find((s) => s.id === scenarioId)
                if (!scenario) return null

                return (
                  <Card key={scenarioId}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        {scenario.name} - Simulation Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Baseline vs Simulated Metrics */}
                        <div>
                          <h4 className="font-medium mb-4">Performance Comparison</h4>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Load Factor</span>
                                <span>
                                  {simulation.baselineMetrics.averageLoadFactor.toFixed(1)}% →{" "}
                                  {simulation.simulatedMetrics.averageLoadFactor.toFixed(1)}%
                                </span>
                              </div>
                              <Progress value={simulation.simulatedMetrics.averageLoadFactor} className="h-2" />
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Revenue</span>
                                <span>
                                  {formatCurrency(simulation.baselineMetrics.totalRevenue)} →{" "}
                                  {formatCurrency(simulation.simulatedMetrics.totalRevenue)}
                                </span>
                              </div>
                              <Progress
                                value={
                                  (simulation.simulatedMetrics.totalRevenue / simulation.baselineMetrics.totalRevenue) *
                                  100
                                }
                                className="h-2"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Empty Seats</span>
                                <span>
                                  {simulation.baselineMetrics.totalEmptySeats.toLocaleString()} →{" "}
                                  {simulation.simulatedMetrics.totalEmptySeats.toLocaleString()}
                                </span>
                              </div>
                              <Progress
                                value={
                                  100 -
                                  (simulation.simulatedMetrics.totalEmptySeats /
                                    simulation.baselineMetrics.totalEmptySeats) *
                                    100
                                }
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Improvements Summary */}
                        <div>
                          <h4 className="font-medium mb-4">Expected Improvements</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="text-sm">Revenue Gain</span>
                              </div>
                              <span className="font-medium text-green-600">
                                {formatCurrency(simulation.improvements.revenueGain)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">Load Factor Gain</span>
                              </div>
                              <span className="font-medium text-blue-600">
                                +{simulation.improvements.loadFactorGain.toFixed(1)}%
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-purple-600" />
                                <span className="text-sm">Cost Savings</span>
                              </div>
                              <span className="font-medium text-purple-600">
                                {formatCurrency(simulation.improvements.costSavings)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-orange-600" />
                                <span className="text-sm">Empty Seats Reduced</span>
                              </div>
                              <span className="font-medium text-orange-600">
                                -{simulation.improvements.emptySeatsReduction.toLocaleString()}
                              </span>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-gray-600" />
                                <span className="text-sm font-medium">ROI</span>
                              </div>
                              <span className="font-bold text-lg">{simulation.improvements.roi.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Implementation Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-6">
            <div className="space-y-6">
              {roadmap.map((phase, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      {phase.phase}
                    </CardTitle>
                    <CardDescription>
                      Duration: {phase.duration} • {phase.expectedBenefits}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {phase.scenarios.map((scenario) => (
                        <div key={scenario.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{scenario.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getComplexityColor(scenario.implementationComplexity)}>
                              {scenario.implementationComplexity}
                            </Badge>
                            <Badge variant="outline">{scenario.timeToImplement}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
