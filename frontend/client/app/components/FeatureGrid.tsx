import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { ArrowRight, MapPinned, ShieldCheck } from "lucide-react"

export default function FeatureGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Card 1 */}
      <div className="rounded-3xl bg-white/80 p-7 ring-1 ring-brand-100 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 ring-1 ring-brand-200">
            <MapPinned className="h-5 w-5 text-brand-800" />
          </span>
          <h3 className="text-xl font-extrabold tracking-tight">Built for parents</h3>
        </div>

        <p className="mt-3 text-slate-700">
          Everything you need to safely manage school transport: schedules, bookings, and live updates.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="btn btn-primary shadow-sm hover:shadow-md transition-all" href={ROUTES.signup}>
            Create account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link className="btn btn-ghost bg-white/70 ring-1 ring-brand-100 hover:bg-white" href={ROUTES.faqs}>
            Read FAQs
          </Link>
        </div>
      </div>

      {/* Card 2 */}
      <div className="rounded-3xl bg-white/80 p-7 ring-1 ring-brand-100 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 ring-1 ring-brand-200">
            <ShieldCheck className="h-5 w-5 text-brand-800" />
          </span>
          <h3 className="text-xl font-extrabold tracking-tight">Designed for reliability</h3>
        </div>

        <p className="mt-3 text-slate-700">
          Predictable pickups, safer rides, and instant notifications for peace of mind.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            className="btn btn-ghost bg-white/70 ring-1 ring-brand-100 hover:bg-white"
            href={ROUTES.howItWorks}
          >
            How it works
          </Link>
        </div>
      </div>
    </div>
  )
}
