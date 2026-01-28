import Link from "next/link"
import { ROUTES } from "@/lib/routes"

export default function FeatureGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card p-7">
        <h3 className="text-xl font-bold">Built for parents</h3>
        <p className="mt-2 text-slate-600">
          Everything you need to safely manage school transport: routes, schedules, bookings, and tracking.
        </p>
        <div className="mt-4 flex gap-3">
          <Link className=" btn btn-primary" href={ROUTES.signup}>Create account</Link>
          <Link className="btn btn-ghost" href={ROUTES.faqs}>Read FAQs</Link>
        </div>
      </div>

      <div className="card p-7">
        <h3 className="text-xl font-bold">Designed for reliability</h3>
        <p className="mt-2 text-slate-600">
          Fixed routes optimized for safety, clear pickup points, and real-time alerts for peace of mind.
        </p>
        <div className="mt-4 flex gap-3">
          <Link className="btn btn-ghost" href={ROUTES.routes}>Explore routes</Link>
          <Link className="btn btn-ghost" href={ROUTES.howItWorks}>How it works</Link>
        </div>
      </div>
    </div>
  )
}
