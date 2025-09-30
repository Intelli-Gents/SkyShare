import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plane, BarChart3, Users, DollarSign } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full">
              <Plane className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 text-balance">
            Airline Route Optimizer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-pretty">
            AI-powered analytics platform that maximizes seat utilization,
            optimizes routes, and creates community-friendly pricing for empty
            seats
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Seat Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Predict which flights will have empty seats using AI-powered
                analytics
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Plane className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Route Optimizer</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Suggest route changes and timing adjustments to maximize load
                factors
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Dynamic Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Community-friendly pricing recommendations for last-minute deals
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Community Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Real-time booking platform for travelers to find affordable
                flights
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard">Airline Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/community">Community Booking</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/optimization">Route Optimization</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/pricing">Real-time Pricing</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
