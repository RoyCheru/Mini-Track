import Link from "next/link"
import { ROUTES } from "@/lib/routes"

export default function ParentDashboard() {
  return (
    <div className="container-max py-14">
      <h1 className="text-4xl font-extrabold">Parent Dashboard</h1>
      <p className="mt-4 text-slate-600">Manage bookings, track buses, and view your transport history.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Link className="card p-7 hover:bg-slate-50" href={ROUTES.routes}>
          <h3 className="text-xl font-extrabold">Choose Route</h3>
          <p className="mt-2 text-slate-600">Browse routes & pickup points</p>
        </Link>

        <Link className="card p-7 hover:bg-slate-50" href={ROUTES.trackChild}>
          <h3 className="text-xl font-extrabold">Track Your Child</h3>
          <p className="mt-2 text-slate-600">Live bus location & ETA</p>
        </Link>

        <Link className="card p-7 hover:bg-slate-50" href={ROUTES.bookingHistory}>
          <h3 className="text-xl font-extrabold">Booking History</h3>
          <p className="mt-2 text-slate-600">View, change, or cancel bookings</p>
        </Link>
      </div>
    </div>
  )
}
