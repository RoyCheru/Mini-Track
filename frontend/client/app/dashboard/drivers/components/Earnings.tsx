export default function Earnings() {
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react' 

  interface EarningsProps {
  earnings: {
    today: number
    thisWeek: number
    thisMonth: number
    totalTrips: number
    avgRating: number
  }
}

export default function Earnings({ earnings }: EarningsProps) {
  return null
}

const formatCurrency = (amount: number) => {
  return `KES ${amount.toLocaleString()}`
}

return (
  <div className="space-y-6">
  </div>
)
<Card className="border-border/50 bg-card shadow-sm">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <DollarSign className="w-5 h-5" />
      Earnings Overview
    </CardTitle>
    <CardDescription>
      Your earnings breakdown and performance metrics
    </CardDescription>
  </CardHeader>
  <CardContent />
</Card>

}