export default function Earnings() {
  
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

}