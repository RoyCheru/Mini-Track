import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { ShieldCheck, Users, TrendingUp, BellRing, ArrowRight } from "lucide-react"

export default function Values() {
  const items = [
    {
      title: "Safety First",
      desc: "Verified drivers and well-maintained vehicles for safer school rides.",
      tag: "Safety",
      Icon: ShieldCheck,
      href: ROUTES.howItWorks,
      cta: "How safety works",
    },
    {
      title: "Parent Visibility",
      desc: "Clear schedules and live updates so parents stay informed daily.",
      tag: "Updates",
      Icon: BellRing,
      href: ROUTES.faqs,
      cta: "Read FAQs",
    },
    {
      title: "Accessible Pricing",
      desc: "Affordable transport designed for families of all income levels.",
      tag: "Pricing",
      Icon: Users,
      href: ROUTES.signup,
      cta: "Create account",
    },
    {
      title: "Service Reliability",
      desc: "Consistent pickups, predictable timing, and dependable communication.",
      tag: "Reliability",
      Icon: TrendingUp,
      href: ROUTES.howItWorks,
      cta: "See how it works",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {items.map(({ title, desc, tag, Icon, href, cta }) => (
        <div
          key={title}
          className="group rounded-3xl bg-white/85 p-6 ring-1 ring-brand-100 shadow-sm backdrop-blur
                     transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-brand-200
                     flex flex-col"
        >
          {/* Icon + Tag */}
          <div className="flex items-start justify-between">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 ring-1 ring-brand-200">
              <Icon className="h-6 w-6 text-brand-800" />
            </span>

            <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800 ring-1 ring-brand-100">
              {tag}
            </span>
          </div>

          {/* Text */}
          <h3 className="mt-5 text-lg font-extrabold tracking-tight text-slate-900">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {desc}
          </p>

          {/* Divider */}
          <div className="mt-5 h-px bg-gradient-to-r from-transparent via-brand-200/60 to-transparent" />

          {/* Actions pinned to bottom — ORIGINAL BUTTON STYLE */}
          <div className="mt-auto pt-5 flex items-center justify-between">
            <Link
              href={href}
              className="inline-flex items-center text-sm font-semibold text-brand-800 hover:text-brand-900"
            >
              {cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link
              href={ROUTES.signup}
              className="btn btn-ghost bg-white/70 ring-1 ring-brand-100 hover:bg-white"
            >
              Start
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
