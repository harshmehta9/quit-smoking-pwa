import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

interface CostCalculatorProps {
  cost: number
  isTotal?: boolean
}

export default function CostCalculator({ cost, isTotal = false }: CostCalculatorProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <DollarSign className="mr-2 h-5 w-5 text-emerald-500" />
          {isTotal ? "Total Cost" : "Today's Cost"}
        </CardTitle>
        <CardDescription>Money spent on cigarettes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">₹{cost.toFixed(2)}</div>
      </CardContent>
    </Card>
  )
}
