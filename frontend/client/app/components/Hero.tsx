import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { Map, ShieldCheck, Bell, CalendarCheck2 } from "lucide-react"

const FEATURES = [
  { title: "Route Tracking", desc: "Interactive routes map & stops", Icon: Map },
  { title: "Safe Transport", desc: "Verified drivers & vehicles", Icon: ShieldCheck },
  { title: "Real-Time Alerts", desc: "Pickup & drop-off updates", Icon: Bell },
  { title: "Easy Booking", desc: "Reserve seats in a few steps", Icon: CalendarCheck2 },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-200/70 via-brand-50 to-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-28 h-[34rem] w-[34rem] rounded-full bg-brand-600/15 blur-3xl" />
        <div className="absolute top-24 -right-28 h-[34rem] w-[34rem] rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300/70 to-transparent" />
      </div>

      <div className="container-max grid gap-10 py-12 md:grid-cols-2 md:items-center">
        {/* LEFT */}
        <div>
          <span className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-brand-800 ring-1 ring-brand-200 backdrop-blur">
            Safe & Affordable School Transport
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
            Safer school rides with{" "}
            <span className="text-brand-700">smart route management</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-slate-700 md:text-lg">
            Book reliable minibus transport for your children, follow routes, and receive instant pickup and drop-off
            updates for peace of mind.
          </p>

          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href={ROUTES.signup}
              className="btn btn-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              href={ROUTES.howItWorks}
              className="btn btn-ghost bg-white/70 ring-1 ring-brand-200 hover:bg-white hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              Learn More
            </Link>
          </div>

          {/* compact proof row */}
          <div className="mt-7 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/75 p-4 ring-1 ring-brand-200 backdrop-blur">
              <div className="text-2xl font-extrabold text-brand-800">500+</div>
              <div className="mt-1 text-xs text-slate-600">Students</div>
            </div>
            <div className="rounded-2xl bg-white/75 p-4 ring-1 ring-brand-200 backdrop-blur">
              <div className="text-2xl font-extrabold text-brand-800">50+</div>
              <div className="mt-1 text-xs text-slate-600">Routes</div>
            </div>
            <div className="rounded-2xl bg-white/75 p-4 ring-1 ring-brand-200 backdrop-blur">
              <div className="text-2xl font-extrabold text-brand-800">99%</div>
              <div className="mt-1 text-xs text-slate-600">On-time</div>
            </div>
          </div>
        </div>

        {/* RIGHT: Only feature cards (no live tracking panel) */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {FEATURES.map(({ title, desc, Icon }) => (
              <div
                key={title}
                className="group rounded-2xl bg-white/80 p-5 ring-1 ring-brand-200 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-brand-400"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 ring-1 ring-brand-200 transition-colors group-hover:bg-brand-200/70">
                    <Icon className="h-5 w-5 text-brand-800" />
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm text-slate-700">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-1 w-full rounded-full bg-gradient-to-r from-brand-300 via-brand-600/60 to-brand-200 opacity-70" />
        </div>
      </div>
    </section>
  )
}
