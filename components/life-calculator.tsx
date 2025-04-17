import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface LifeCalculatorProps {
  lifeLost: number
  isTotal?: boolean
}

export default function LifeCalculator({ lifeLost, isTotal = false }: LifeCalculatorProps) {
  // Format minutes into hours and minutes
  const hours = Math.floor(lifeLost / 60)
  const minutes = Math.floor(lifeLost % 60)

  let displayText = ""

  if (hours > 0) {
    displayText = `${hours} hr ${minutes} min`
  } else {
    displayText = `${minutes} min`
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Clock className="mr-2 h-5 w-5 text-orange-500" />
          {isTotal ? "Total Life Lost" : "Today's Life Lost"}
        </CardTitle>
        <CardDescription>Time taken off your life</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{displayText}</div>
      </CardContent>
    </Card>
  )
}
