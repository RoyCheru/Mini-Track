import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { ArrowRight, UserPlus, MapPin, CheckCircle, BusFront } from "lucide-react"

const steps = [
  { title: "Create an Account", description: "Sign up as a parent and set up your child’s profile securely.", icon: UserPlus },
  { title: "Choose Route", description: "Select a school route and convenient pickup location.", icon: MapPin },
  { title: "Reserve a Seat", description: "Confirm availability and reserve a seat on the minibus.", icon: CheckCircle },
  { title: "Track the Bus", description: "Get real-time tracking and pickup/drop-off alerts.", icon: BusFront },
]

export default function HowItWorksPage() {
  return (
    <div className="bg-linear-to-b from-brand-50 via-white to-white">
      <div className="container-max py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h1>
          <p className="mt-4 text-slate-700">
            Getting started with Mini-Track is simple, secure, and designed for peace of mind.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon

            return (
              <div
                key={step.title}
                className="group rounded-3xl bg-white/80 p-7 ring-1 ring-brand-100 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-md hover:ring-brand-200"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 ring-1 ring-brand-200 group-hover:bg-brand-200/70 transition-colors">
                  <Icon className="h-6 w-6 text-brand-800" />
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm text-slate-700">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Centered single CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            href={ROUTES.signup}
            className="btn btn-primary shadow-sm hover:shadow-md transition-all"
          >
            Sign up
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
