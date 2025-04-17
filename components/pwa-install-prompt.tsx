"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PwaInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if the app is already installed (in standalone mode or installed PWA)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://")

    // Check if we've already shown the prompt
    const hasPromptBeenShown = localStorage.getItem("pwaPromptShown") === "true"

    if (isStandalone || hasPromptBeenShown) {
      // Don't show the prompt if already installed or previously shown
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show our custom prompt
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice

    // Clear the saved prompt
    setDeferredPrompt(null)

    // Hide our custom prompt
    setShowPrompt(false)

    // Mark that we've shown the prompt
    localStorage.setItem("pwaPromptShown", "true")

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt")
    } else {
      console.log("User dismissed the install prompt")
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Mark that we've shown the prompt even if they dismiss it
    localStorage.setItem("pwaPromptShown", "true")
  }

  if (!showPrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 left-4 right-4 z-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-emerald-600">Install QuitNow App</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleDismiss}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <p>Install QuitNow on your device for a better experience and offline access.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleInstallClick} className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Download className="mr-2 h-4 w-4" /> Install App
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
