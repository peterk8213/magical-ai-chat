"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Sparkles, Zap, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CreditPackage {
  id: string
  name: string
  messages: number
  price: number
  perMessage: number
  popular?: boolean
  features: string[]
  icon: React.ReactNode
}

export default function BuyCreditsPage() {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<string>("standard")

  // Credit packages
  const packages: CreditPackage[] = [
    {
      id: "starter",
      name: "Starter",
      messages: 10,
      price: 1.99,
      perMessage: 0.199,
      features: ["10 AI conversations", "Basic response quality", "24/7 availability"],
      icon: <Zap className="h-5 w-5 text-blue-400" />,
    },
    {
      id: "standard",
      name: "Standard",
      messages: 50,
      price: 4.99,
      perMessage: 0.0998,
      popular: true,
      features: ["50 AI conversations", "Enhanced response quality", "Priority support", "Conversation history"],
      icon: <Star className="h-5 w-5 text-yellow-400" />,
    },
    {
      id: "premium",
      name: "Premium",
      messages: 200,
      price: 14.99,
      perMessage: 0.07495,
      features: [
        "200 AI conversations",
        "Premium response quality",
        "Priority support",
        "Unlimited conversation history",
        "Advanced AI features",
      ],
      icon: <Sparkles className="h-5 w-5 text-purple-400" />,
    },
  ]

  const handleCheckout = () => {
    // Simulate payment processing
    alert("WorldPay integration would go here. For now, we'll add credits directly.")

    // Get current credits
    const currentCredits = Number.parseInt(localStorage.getItem("userCredits") || "0")
    const selectedPkg = packages.find((pkg) => pkg.id === selectedPackage)

    if (selectedPkg) {
      // Add credits (10 credits per message)
      const newCredits = currentCredits + selectedPkg.messages * 10
      localStorage.setItem("userCredits", newCredits.toString())

      // Redirect back to chat
      router.push("/")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white overflow-y-auto relative">
      <div className="flex h-14 items-center gap-4 border-b border-zinc-800 px-4 sticky top-0 bg-black z-10">
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Chat</span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 pb-32">
        <div className="w-full max-w-4xl space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Supercharge Your AI Experience
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Choose the perfect package and unlock the full potential of MagicalAI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-zinc-900 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 border-2 ${
                  selectedPackage === pkg.id
                    ? "border-red-500 shadow-lg shadow-red-500/20"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {pkg.popular && (
                  <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 text-center">MOST POPULAR</div>
                )}
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    {pkg.icon}
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                  </div>

                  <div className="mb-4">
                    <span className="text-4xl font-bold">${pkg.price}</span>
                    <span className="text-zinc-400 ml-1">one-time</span>
                  </div>

                  <div className="mb-6 text-sm text-zinc-400">
                    <span className="text-white font-medium">{pkg.messages} messages</span>
                    <span> (${pkg.perMessage.toFixed(4)} per message)</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      selectedPackage === pkg.id ? "bg-red-600 hover:bg-red-700" : "bg-zinc-800 hover:bg-zinc-700"
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {selectedPackage === pkg.id ? "Selected" : "Select Package"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed checkout section at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 md:p-6 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Ready to upgrade your experience?</h3>
              <p className="text-sm md:text-base text-zinc-400">
                Get started with your selected package and enjoy enhanced AI conversations.
              </p>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 md:px-8 md:py-6 text-base md:text-lg font-medium rounded-xl"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

