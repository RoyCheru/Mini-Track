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
  
}