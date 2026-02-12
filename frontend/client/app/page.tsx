import Link from "next/link"
import { ROUTES } from "@/lib/routes"

import Hero from "@/app/components/Hero"
import Values from "@/app/components/Values"
import FeatureGrid from "@/app/components/FeatureGrid"
import ProblemSolution from "@/app/components/ProblemSolution"
import CTASection from "@/app/components/CTASection"
import Stats from "@/app/components/Stats"

export default function HomePage() {
  return (
    <div>
      <Hero />

      <section className="container-max py-16">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight">
            Built for <span className="text-brand-600">Safe School Rides</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-700">
            A modern school transport system for bookings, route visibility, and reliable updates.
          </p>
        </div>

        <div className="mt-10">
          <Values />
        </div>
      </section>

      <section className="border-y border-brand-100/60 bg-linear-to-r from-brand-100/70 via-brand-50 to-white">
        <div className="container-max grid gap-10 py-16 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900">
              Clear schedules. Safer routes.{" "}
              <span className="text-brand-700">Instant updates.</span>
            </h3>

            <p className="mt-4 max-w-xl text-slate-700">
              Designed for peace of mind — fixed routes optimized for safety, simple bookings,
              and timely notifications around pickups and drop-offs.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link className="btn btn-primary shadow-sm hover:shadow-md transition-all" href={ROUTES.signup}>
                Create account
              </Link>
              <Link className="btn btn-ghost bg-white/70 ring-1 ring-brand-100 hover:bg-white" href={ROUTES.howItWorks}>
                How it works
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white/85 p-8 ring-1 ring-brand-200 shadow-sm backdrop-blur">
            <div className="text-sm font-extrabold text-slate-900">Service snapshot</div>
            <p className="mt-2 text-slate-600">
              A quick overview of the scale and punctuality you can expect.
            </p>
            <Stats bordered={false} className="mt-6" />
          </div>
        </div>
      </section>

      <section className="container-max py-16">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Why Mini-Track exists
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-700">
            We’re solving the daily stress of school commutes with safer, trackable, and affordable transport.
          </p>
        </div>

        <div className="mt-12">
          <ProblemSolution />
        </div>

        <div className="mt-10">
          <FeatureGrid />
        </div>
      </section>

      <section className="border-t border-brand-100/60 bg-linear-to-b from-brand-50/60 via-white to-white">
        <div className="container-max py-16">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-700">
              Create an account, choose a route, and start receiving pickup and drop-off updates.
            </p>
          </div>

          <div className="mt-12">
            <CTASection />
          </div>
        </div>
      </section>
    </div>
  )
}
