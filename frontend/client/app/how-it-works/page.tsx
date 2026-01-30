import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { ArrowRight, UserPlus, MapPin, CheckCircle, Bus } from "lucide-react"

const steps = [
  {
    title: "Create an Account",
    description: "Sign up as a parent and set up your child’s profile securely.",
    icon: UserPlus,
  },
  {
    title: "Choose Route",
    description: "Select a school route and convenient pickup location.",
    icon: MapPin,
  },
  {
    title: "Reserve a Seat",
    description: "Confirm availability and reserve a seat on the minibus.",
    icon: CheckCircle,
  },
  {
    title: "Track the Bus",
    description: "Get real-time tracking and pickup/drop-off alerts.",
    icon: Bus,
  },
]

export default function HowItWorksPage() {
  return (
    <div className="container-max py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900">
          How It Works
        </h1>
        <p className="mt-4 text-slate-600">
          Getting started with Mini-Track is simple and secure.
        </p>
      </div>

      {/* Steps */}
      <div className="mt-14 flex flex-col md:flex-row items-center justify-between gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon

          return (
            <div key={step.title} className="flex items-center">
              {/* Card */}
              <div className="group w-64 bg-white border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-4 group-hover:scale-105 transition-transform">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {step.description}
                </p>
              </div>

              {/* Arrow (hide on last item) */}
              {index !== steps.length - 1 && (
                <div className="hidden md:flex mx-4 text-blue-400">
                  <ArrowRight size={28} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="mt-14 flex justify-center gap-4">
        <Link href={ROUTES.signup} className="btn btn-primary">
          Sign up
        </Link>
        <Link href={ROUTES.routes} className="btn btn-ghost">
          Explore routes
        </Link>
      </div>
    </div>
  )
}
