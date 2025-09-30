"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Plane, MapPin, Clock, Users, Percent, CalendarIcon, Search, Star, TrendingDown, Zap } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { mockFlights } from "@/lib/mock-data"
import { AnalyticsService } from "@/lib/analytics-service"
import type { Flight } from "@/lib/types"

interface CommunityDeal extends Flight {
  discount: number
  communityPrice: number
  originalPrice: number
  savingsAmount: number
  urgencyLevel: "low" | "medium" | "high"
  seatsLeft: number
}

export default function CommunityPage() {
  const [deals, setDeals] = useState<CommunityDeal[]>([])
  const [filteredDeals, setFilteredDeals] = useState<CommunityDeal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchOrigin, setSearchOrigin] = useState("")
  const [searchDestination, setSearchDestination] = useState("")
  const [searchDate, setSearchDate] = useState<Date>()
  const [sortBy, setSortBy] = useState("discount")

  useEffect(() => {
    const loadCommunityDeals = async () => {
      setLoading(true)

      // Get community deals from analytics service
      const communityDeals = await AnalyticsService.getBestCommunityDeals(mockFlights)

      // Transform to include additional community-specific data
      const transformedDeals: CommunityDeal[] = communityDeals.map((deal) => ({
        ...deal,
        originalPrice: deal.price,
        savingsAmount: deal.price - deal.communityPrice,
        urgencyLevel: deal.discount > 40 ? "high" : deal.discount > 25 ? "medium" : "low",
        seatsLeft: Math.max(5, Math.floor(Math.random() * 30) + 5),
      }))

      setDeals(transformedDeals)
      setFilteredDeals(transformedDeals)
      setLoading(false)
    }

    loadCommunityDeals()
  }, [])

  useEffect(() => {
    let filtered = [...deals]

    // Filter by origin
    if (searchOrigin) {
      filtered = filtered.filter((deal) => deal.origin.toLowerCase().includes(searchOrigin.toLowerCase()))
    }

    // Filter by destination
    if (searchDestination) {
      filtered = filtered.filter((deal) => deal.destination.toLowerCase().includes(searchDestination.toLowerCase()))
    }

    // Filter by date
    if (searchDate) {
      const searchDateStr = format(searchDate, "yyyy-MM-dd")
      filtered = filtered.filter((deal) => deal.date === searchDateStr)
    }

    // Sort deals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "discount":
          return b.discount - a.discount
        case "price":
          return a.communityPrice - b.communityPrice
        case "departure":
          return a.departureTime.localeCompare(b.departureTime)
        default:
          return b.discount - a.discount
      }
    })

    setFilteredDeals(filtered)
  }, [deals, searchOrigin, searchDestination, searchDate, sortBy])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      default:
        return "bg-green-500 text-white"
    }
  }

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "Book Now!"
      case "medium":
        return "Limited Time"
      default:
        return "Good Deal"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Plane className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Finding the best deals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-balance">
              Community Flight Deals
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-pretty">
              AI-powered discounts on flights with empty seats. Save up to 60% on last-minute bookings!
            </p>
          </div>

          {/* Search Filters */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">From</Label>
                  <Input
                    id="origin"
                    placeholder="Origin city"
                    value={searchOrigin}
                    onChange={(e) => setSearchOrigin(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">To</Label>
                  <Input
                    id="destination"
                    placeholder="Destination"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchDate ? format(searchDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={searchDate} onSelect={setSearchDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Sort by</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discount">Best Discount</SelectItem>
                      <SelectItem value="price">Lowest Price</SelectItem>
                      <SelectItem value="departure">Departure Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="flex flex-wrap items-center justify-between mb-8 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredDeals.length}</div>
              <div className="text-sm text-gray-600">Available Deals</div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(filteredDeals.reduce((sum, deal) => sum + deal.discount, 0) / filteredDeals.length)}%
              </div>
              <div className="text-sm text-gray-600">Avg Discount</div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${Math.round(filteredDeals.reduce((sum, deal) => sum + deal.savingsAmount, 0) / filteredDeals.length)}
              </div>
              <div className="text-sm text-gray-600">Avg Savings</div>
            </div>
          </div>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Zap className="mr-1 h-3 w-3" />
            AI-Powered Deals
          </Badge>
        </div>

        {/* Deals List */}
        <div className="space-y-4">
          {filteredDeals.map((deal) => (
            <Card
              key={deal.id}
              className="hover:shadow-lg transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Flight Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {deal.flightNumber}
                        </Badge>
                        <span className="font-medium text-gray-900 dark:text-white">{deal.airline}</span>
                      </div>
                      <Badge className={getUrgencyColor(deal.urgencyLevel)}>{getUrgencyText(deal.urgencyLevel)}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{deal.origin}</span>
                        <span className="text-gray-500">→</span>
                        <span className="font-medium">{deal.destination}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>
                          {deal.departureTime} - {deal.arrivalTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-orange-600 font-medium">{deal.seatsLeft} seats left</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <Percent className="h-4 w-4 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">-{deal.discount}%</span>
                      </div>
                      <div className="text-xs text-gray-500">Discount</div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-500 line-through">${deal.originalPrice}</div>
                      <div className="text-3xl font-bold text-blue-600">${deal.communityPrice}</div>
                      <div className="text-xs text-gray-500">Community Price</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-1 text-green-600 mb-1">
                        <TrendingDown className="h-4 w-4" />
                        <span className="font-medium">Save ${deal.savingsAmount}</span>
                      </div>
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span>Aircraft: {deal.aircraft}</span>
                      <span>Date: {format(new Date(deal.date), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>Community Verified Deal</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDeals.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No deals found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search criteria or check back later for new deals.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
