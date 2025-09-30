import { RealTimePricing } from "@/components/real-time-pricing"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Real-Time Pricing</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Live pricing updates powered by AI analytics and market conditions
          </p>
        </div>

        <RealTimePricing />
      </div>
    </div>
  )
}
