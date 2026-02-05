import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, Shield, Phone, BadgeCheck } from 'lucide-react'

interface ProfileCardProps {
  name: string
  license: string
  phone: string
  rating: number
  totalTrips: number
}

export default function ProfileCard({ name, license, phone, rating, totalTrips }: ProfileCardProps) {
  return (
    <Card className="border-border/50 bg-card shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg font-semibold">{name.charAt(0)}</span>
          </div>

          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {name}
              <BadgeCheck className="w-4 h-4 text-blue-500" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">Professional Driver</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <span>
            License: <span className="font-medium">{license}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{phone}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-medium">{Number.isFinite(rating) ? rating.toFixed(1) : '0.0'}</span>
            <span className="text-xs text-muted-foreground ml-1">rating</span>
          </div>

          <div className="text-right">
            <div className="font-medium">{Number.isFinite(totalTrips) ? totalTrips.toLocaleString() : '0'}</div>
            <div className="text-xs text-muted-foreground">total trips</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
