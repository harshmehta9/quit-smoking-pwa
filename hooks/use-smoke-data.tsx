"use client"

import { useState, useEffect } from "react"

// Constants
const CIGARETTE_COST = 20 // rupees
const LIFE_MINUTES_PER_CIGARETTE = 11 // minutes of life lost per cigarette

interface CigaretteEntry {
  timestamp: number
  reason?: string
}

interface SmokeDataStorage {
  todayEntries: CigaretteEntry[]
  allEntries: CigaretteEntry[]
  lastUpdated: string
}

interface SmokeData {
  todayCount: number
  totalCount: number
  todayCost: number
  totalCost: number
  todayLifeLost: number
  totalLifeLost: number
  lastUpdated: string
  addCigarette: (reason?: string) => void
  resetToday: () => void
  todayEntries: CigaretteEntry[]
  allEntries: CigaretteEntry[]
}

export function useSmokeData(): SmokeData {
  const [todayEntries, setTodayEntries] = useState<CigaretteEntry[]>([])
  const [allEntries, setAllEntries] = useState<CigaretteEntry[]>([])
  const [lastUpdated, setLastUpdated] = useState("")

  // Calculate derived values
  const todayCount = todayEntries.length
  const totalCount = allEntries.length
  const todayCost = todayCount * CIGARETTE_COST
  const totalCost = totalCount * CIGARETTE_COST
  const todayLifeLost = todayCount * LIFE_MINUTES_PER_CIGARETTE
  const totalLifeLost = totalCount * LIFE_MINUTES_PER_CIGARETTE

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedData = localStorage.getItem("smokeData")

        if (storedData) {
          const data = JSON.parse(storedData) as SmokeDataStorage

          // Check if we need to reset the daily count (new day)
          const today = new Date().toDateString()

          if (data.lastUpdated !== today) {
            // It's a new day, reset today's entries
            setTodayEntries([])
            setAllEntries(data.allEntries || [])
            setLastUpdated(today)
          } else {
            // Same day, load all data
            setTodayEntries(data.todayEntries || [])
            setAllEntries(data.allEntries || [])
            setLastUpdated(data.lastUpdated)
          }
        } else {
          // Initialize with default values
          setLastUpdated(new Date().toDateString())
        }
      }
    } catch (error) {
      console.error("Error loading smoke data:", error)
      // Initialize with default values if there's an error
      setLastUpdated(new Date().toDateString())
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && lastUpdated) {
        localStorage.setItem(
          "smokeData",
          JSON.stringify({
            todayEntries,
            allEntries,
            lastUpdated,
          }),
        )
      }
    } catch (error) {
      console.error("Error saving smoke data:", error)
      // Continue without saving if there's an error
    }
  }, [todayEntries, allEntries, lastUpdated])

  // Add a cigarette to the count
  const addCigarette = (reason?: string) => {
    const newEntry: CigaretteEntry = {
      timestamp: Date.now(),
      reason,
    }

    setTodayEntries((prev) => [...prev, newEntry])
    setAllEntries((prev) => [...prev, newEntry])
  }

  // Reset today's count
  const resetToday = () => {
    setTodayEntries([])
    setLastUpdated(new Date().toDateString())
  }

  return {
    todayCount,
    totalCount,
    todayCost,
    totalCost,
    todayLifeLost,
    totalLifeLost,
    lastUpdated,
    addCigarette,
    resetToday,
    todayEntries,
    allEntries,
  }
}
