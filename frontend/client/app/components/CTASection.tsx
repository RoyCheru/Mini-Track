import Link from "next/link"
import { ROUTES } from "@/lib/routes"

export default function CTASection() {
  return (
    <div className="rounded-3xl bg-brand-50 p-10 text-center">
      <h3 className="text-3xl font-extrabold">Still have questions?</h3>
      <p className="mx-auto mt-3 max-w-2xl text-slate-600">
        Our support team is here to help you with any queries.
      </p>
      <div className="mt-7 flex justify-center gap-4">
        <Link href={ROUTES.support} className="btn btn-primary">
          Contact Support
        </Link>
      </div>
    </div>
  )
}
