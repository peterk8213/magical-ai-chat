"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface UserPreferences {
  name: string
  interests: string[]
  responseLength: string
  topics: {
    technology: boolean
    science: boolean
    arts: boolean
    business: boolean
    health: boolean
  }
}

export default function ProfilePage() {
  const [username, setUsername] = useState("Username")
  const [credits, setCredits] = useState(100)
  const [preferences, setPreferences] = useState<UserPreferences>({
    name: "",
    interests: [],
    responseLength: "medium",
    topics: {
      technology: true,
      science: false,
      arts: false,
      business: false,
      health: false,
    },
  })
  const [newInterest, setNewInterest] = useState("")
  const [saved, setSaved] = useState(false)

  // Load credits and preferences from localStorage
  useEffect(() => {
    const storedCredits = localStorage.getItem("userCredits")
    if (storedCredits) {
      setCredits(Number.parseInt(storedCredits))
    }

    const storedPreferences = localStorage.getItem("userPreferences")
    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences))
    }
  }, [])

  const handleSavePreferences = () => {
    localStorage.setItem("userPreferences", JSON.stringify(preferences))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addInterest = () => {
    if (newInterest.trim() && !preferences.interests.includes(newInterest.trim())) {
      setPreferences({
        ...preferences,
        interests: [...preferences.interests, newInterest.trim()],
      })
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setPreferences({
      ...preferences,
      interests: preferences.interests.filter((i) => i !== interest),
    })
  }

  const handleTopicToggle = (topic: keyof typeof preferences.topics) => {
    setPreferences({
      ...preferences,
      topics: {
        ...preferences.topics,
        [topic]: !preferences.topics[topic],
      },
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white overflow-y-auto">
      <div className="flex h-14 items-center gap-4 border-b border-zinc-800 px-4 sticky top-0 bg-black z-10">
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Chat</span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <Avatar className="mx-auto h-24 w-24">
              <AvatarFallback className="bg-red-600 text-xl">U</AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-4 bg-zinc-900 p-6 rounded-xl">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Credits Available</label>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{credits}</p>
                <Link href="/buy-credits">
                  <Button className="bg-red-600 hover:bg-red-700 rounded-xl">Buy More Credits</Button>
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Usage</label>
              <p className="text-sm text-zinc-300">Each message costs 10 credits</p>
              <div className="mt-2 bg-zinc-800 rounded-full h-2.5">
                <div
                  className="bg-red-600 h-2.5 rounded-full"
                  style={{ width: `${Math.min(100, (credits / 100) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* AI Preferences Section */}
          <div className="space-y-6 bg-zinc-900 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">AI Preferences</h2>
              <Button
                onClick={handleSavePreferences}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saved ? "Saved!" : "Save Preferences"}
              </Button>
            </div>

            <p className="text-sm text-zinc-400">
              Customize how the AI responds to you. These preferences will be used to tailor responses to your needs.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Your Name</label>
                <input
                  type="text"
                  value={preferences.name}
                  onChange={(e) => setPreferences({ ...preferences, name: e.target.value })}
                  placeholder="How should the AI address you?"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Your Interests</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {preferences.interests.map((interest) => (
                    <div key={interest} className="bg-zinc-800 px-3 py-1 rounded-lg flex items-center gap-2">
                      <span>{interest}</span>
                      <button onClick={() => removeInterest(interest)} className="text-zinc-500 hover:text-red-500">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest"
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    onKeyDown={(e) => e.key === "Enter" && addInterest()}
                  />
                  <Button onClick={addInterest} className="bg-zinc-800 hover:bg-zinc-700">
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Preferred Response Length</label>
                <select
                  value={preferences.responseLength}
                  onChange={(e) => setPreferences({ ...preferences, responseLength: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="concise">Concise</option>
                  <option value="medium">Medium</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Topics You're Interested In</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.entries(preferences.topics).map(([topic, isSelected]) => (
                    <div
                      key={topic}
                      onClick={() => handleTopicToggle(topic as keyof typeof preferences.topics)}
                      className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? "bg-red-900/50 border border-red-700" : "bg-zinc-800 border border-zinc-700"
                      }`}
                    >
                      <span className="capitalize">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

