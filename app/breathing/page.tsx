"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Pause, Play } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BreathingPage() {
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [counter, setCounter] = useState(4)

  // Breathing technique: 4-7-8 technique
  // Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds
  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev === 1) {
          // Move to next phase
          if (phase === "inhale") {
            setPhase("hold")
            return 7 // Hold for 7 seconds
          } else if (phase === "hold") {
            setPhase("exhale")
            return 8 // Exhale for 8 seconds
          } else {
            setPhase("inhale")
            return 4 // Inhale for 4 seconds
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, phase, counter])

  const toggleActive = () => {
    if (!isActive) {
      // Reset to beginning of cycle when starting
      setPhase("inhale")
      setCounter(4)
    }
    setIsActive(!isActive)
  }

  const getInstructions = () => {
    switch (phase) {
      case "inhale":
        return "Breathe in slowly through your nose"
      case "hold":
        return "Hold your breath"
      case "exhale":
        return "Exhale slowly through your mouth"
    }
  }

  const getCircleSize = () => {
    switch (phase) {
      case "inhale":
        return "scale(1.3)"
      case "hold":
        return "scale(1.3)"
      case "exhale":
        return "scale(1)"
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <header className="flex items-center mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-emerald-600 ml-2">Breathing Technique</h1>
      </header>

      <Card className="mb-6">
        <CardContent className="p-6">
          <p className="text-center mb-4">
            The 4-7-8 breathing technique can help reduce cravings and anxiety. Follow along with the animation below.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center justify-center py-8">
        <motion.div
          className="w-48 h-48 rounded-full bg-emerald-100 border-4 border-emerald-500 flex items-center justify-center mb-8"
          animate={{
            transform: getCircleSize(),
          }}
          transition={{
            duration: phase === "inhale" ? 4 : phase === "hold" ? 0 : 8,
            ease: phase === "exhale" ? "easeInOut" : "easeOut",
          }}
        >
          <div className="text-5xl font-bold text-emerald-600">{counter}</div>
        </motion.div>

        <h2 className="text-2xl font-semibold text-center mb-4">{getInstructions()}</h2>

        <Button onClick={toggleActive} className="mt-4 bg-emerald-600 hover:bg-emerald-700" size="lg">
          {isActive ? (
            <>
              <Pause className="mr-2 h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> Start
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
