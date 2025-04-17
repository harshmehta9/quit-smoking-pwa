"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cigarette, TreesIcon as Lungs, Plus, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useSmokeData } from "@/hooks/use-smoke-data"
import LifeCalculator from "./life-calculator"
import CostCalculator from "./cost-calculator"
import PwaInstallPrompt from "./pwa-install-prompt"
import SmokingReasonDialog from "./smoking-reason-dialog"

export default function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const { todayCount, totalCount, addCigarette, todayCost, totalCost, todayLifeLost, totalLifeLost } = useSmokeData()

  const [mounted, setMounted] = useState(false)
  const [showReasonDialog, setShowReasonDialog] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Register service worker with better error handling
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        // In production, we would register the service worker
        // For development/preview environments, we'll skip registration if it fails
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope)
          })
          .catch((error) => {
            console.log("Service Worker registration skipped in development/preview environment:", error)
            // The app will still work without the service worker
          })
      })
    }
  }, [])

  if (!mounted) return null

  const handleAddCigaretteClick = () => {
    // Show the reason dialog instead of immediately adding
    setShowReasonDialog(true)
  }

  const handleReasonDialogClose = (reason?: string) => {
    setShowReasonDialog(false)

    // Add the cigarette with the optional reason
    addCigarette(reason)

    toast({
      title: "Cigarette logged",
      description: "We've added a cigarette to your daily count.",
    })
  }

  const handleUrgeClick = () => {
    router.push("/breathing")
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-600">QuitNow</h1>
        <Button variant="ghost" size="icon" onClick={() => router.push("/settings")}>
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="total">Total</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Cigarette className="mr-2 h-5 w-5 text-red-500" />
                  Today's Cigarettes
                </CardTitle>
                <CardDescription>Cigarettes smoked today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold">{todayCount}</span>
                  <Button onClick={handleAddCigaretteClick} className="bg-red-500 hover:bg-red-600">
                    <Plus className="mr-1 h-4 w-4" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <CostCalculator cost={todayCost} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <LifeCalculator lifeLost={todayLifeLost} />
          </motion.div>
        </TabsContent>

        <TabsContent value="total" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Cigarette className="mr-2 h-5 w-5 text-red-500" />
                  Total Cigarettes
                </CardTitle>
                <CardDescription>All-time cigarettes smoked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalCount}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <CostCalculator cost={totalCost} isTotal={true} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <LifeCalculator lifeLost={totalLifeLost} isTotal={true} />
          </motion.div>
        </TabsContent>
      </Tabs>

      <motion.div className="mt-8" whileTap={{ scale: 0.95 }}>
        <Button onClick={handleUrgeClick} className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-700">
          <Lungs className="mr-2 h-5 w-5" />
          Having an Urge?
        </Button>
      </motion.div>

      {/* PWA Install Prompt */}
      <PwaInstallPrompt />

      {/* Smoking Reason Dialog */}
      <SmokingReasonDialog isOpen={showReasonDialog} onClose={handleReasonDialogClose} />
    </div>
  )
}
