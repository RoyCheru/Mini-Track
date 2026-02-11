import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { Headset } from "lucide-react"

export default function CTASection() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-100/70 via-brand-50 to-white p-10 text-center ring-1 ring-brand-200">
      <div className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-brand-400/15 blur-3xl" />

      <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-brand-800 ring-1 ring-brand-200 backdrop-blur">
        <Headset className="h-4 w-4" />
        Support
      </div>

      <h3 className="mt-5 text-3xl font-extrabold tracking-tight">Still have questions?</h3>
      <p className="mx-auto mt-3 max-w-2xl text-slate-700">
        Our support team is here to help you with any queries.
      </p>

      <div className="mt-7 flex justify-center gap-4">
        <Link href={ROUTES.support} className="btn btn-primary shadow-sm hover:shadow-md transition-all">
          Contact Support
        </Link>
      </div>
    </div>
  )
}
