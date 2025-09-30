"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Zap, Clock, Bell } from "lucide-react"
import type { PriceUpdate } from "@/lib/pricing-system"

interface RealTimePricingProps {
  flightId?: string
  showHistory?: boolean
}

export function RealTimePricing({ flightId, showHistory = false }: RealTimePricingProps) {
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([])
  const [bestDeals, setBestDeals] = useState<PriceUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const url = flightId ? `/api/pricing/real-time?flightId=${flightId}` : "/api/pricing/real-time"
        const response = await fetch(url)
        const data = await response.json()

        if (data.success) {
          if (flightId) {
            setPriceUpdates([data.priceUpdate])
          } else {
            setPriceUpdates(data.priceUpdates)
            setBestDeals(data.bestDeals)
          }
          setLastUpdate(new Date())
        }
      } catch (error) {
        console.error("Failed to fetch pricing:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPricing()

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchPricing, 30000)
    return () => clearInterval(interval)
  }, [flightId])

  const getPriceChangeIcon = (oldPrice: number, newPrice: number) => {
    if (newPrice < oldPrice) {
      return <TrendingDown className="h-4 w-4 text-green-600" />
    } else if (newPrice > oldPrice) {
      return <TrendingUp className="h-4 w-4 text-red-600" />
    }
    return null
  }

  const getPriceChangeColor = (oldPrice: number, newPrice: number) => {
    if (newPrice < oldPrice) return "text-green-600"
    if (newPrice > oldPrice) return "text-red-600"
    return "text-gray-600"
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Zap className="h-6 w-6 text-blue-600 animate-pulse mr-2" />
            <span>Loading real-time pricing...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Live Pricing Updates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Live Pricing Updates
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            Updated {formatTimeAgo(lastUpdate)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {priceUpdates.map((update, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Flight {update.flightId}</Badge>
                    <Badge
                      variant={update.discount > 0 ? "default" : "secondary"}
                      className={update.discount > 0 ? "bg-green-600" : ""}
                    >
                      {update.discount > 0 ? `-${update.discount}%` : "No discount"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriceChangeIcon(update.oldPrice, update.newPrice)}
                    <span className={`font-medium ${getPriceChangeColor(update.oldPrice, update.newPrice)}`}>
                      ${update.newPrice}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Previous Price</p>
                    <p className="text-lg font-medium line-through text-gray-500">${update.oldPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Price</p>
                    <p className="text-lg font-bold text-blue-600">${update.newPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">You Save</p>
                    <p className="text-lg font-bold text-green-600">${update.oldPrice - update.newPrice}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">{update.reason}</p>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Bell className="h-4 w-4 mr-1" />
                      Set Alert
                    </Button>
                    <Button size="sm">Book Now</Button>
                  </div>
                </div>

                {/* Valid until countdown */}
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Price valid until: {update.validUntil.toLocaleTimeString()}</span>
                    <span>Updated: {formatTimeAgo(update.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Current Deals */}
      {bestDeals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              Best Current Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bestDeals.slice(0, 6).map((deal, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Flight {deal.flightId}</Badge>
                    <Badge className="bg-red-600 text-white">-{deal.discount}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 line-through">${deal.oldPrice}</p>
                      <p className="text-lg font-bold text-green-600">${deal.newPrice}</p>
                    </div>
                    <Button size="sm">Book</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
