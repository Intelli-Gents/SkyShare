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
            <div className="p-4 bg-[#fe7743] rounded-full">
              <Plane className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#273F4F] dark:text-white mb-6 text-balance">
            SkyShare
          </h1>
          <p className="text-xl text-gray-600 dark:text-[#273F4F] max-w-3xl mx-auto text-pretty">
            AI-powered analytics platform that maximizes seat utilization,
            optimizes routes, and creates community-friendly pricing for empty
            seats
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg hover:translate-y-4 transition-shadow transform transition duration-300 ease-in-out">
            <CardHeader className="text-center">
              <BarChart3 className="h-8 w-8 text-[#fe7743] mx-auto mb-2" />
              <CardTitle className="text-lg">Seat Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Analyse flight statistics such as empty seats to maximise cost effectiveness on future flights
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:translate-y-4 transition-shadow transform transition duration-300 ease-in-out">
            <CardHeader className="text-center">
              <Plane className="h-8 w-8 text-[#fe7743] mx-auto mb-2" />
              <CardTitle className="text-lg">Route Optimizer</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Suggest route changes and timing adjustments to maximize load
                factors and minimise operations costs
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:translate-y-4 transition-shadow transform transition duration-300 ease-in-out">
            <CardHeader className="text-center">
              <DollarSign className="h-8 w-8 text-[#fe7743] mx-auto mb-2" />
              <CardTitle className="text-lg">Dynamic Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Community-friendly pricing recommendations for last-minute deals to optimise flight prices for customers
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:translate-y-4 transition-shadow transform transition duration-300 ease-in-out">
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-[#fe7743] mx-auto mb-2" />
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
          <Button asChild size="lg" className="bg-[#fe7743] hover:bg-[#447d9b]">
            <Link href="/dashboard">Airline Dashboard</Link>
          </Button>
          <Button asChild size="lg" className="bg-[#fe7743] hover:bg-[#447d9b]">
            <Link href="/community">Community Booking</Link>
          </Button>
          <Button asChild size="lg" className="bg-[#fe7743] hover:bg-[#447d9b]">
            <Link href="/optimization">Route Optimization</Link>
          </Button>
          <Button asChild size="lg" className="bg-[#fe7743] hover:bg-[#447d9b]">
            <Link href="/pricing">Real-time Pricing</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
