export default function VehicleStatus() {

interface VehicleStatusProps {
  status: "active" | "inactive" | "maintenance"
}

export default function VehicleStatus({ status }: VehicleStatusProps) {

   return (
    <div>
      Vehicle Status
    </div>
  )
}
}