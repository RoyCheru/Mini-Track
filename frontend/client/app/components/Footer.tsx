import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { Truck, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-200">
      <div className="container-max py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm ring-1 ring-white/10">
                <Truck className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight">
                Mini-Track
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Making school transportation safe, affordable, and accessible for
              every child in developing countries.
            </p>

            <div className="mt-5 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Safety-first routes
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1">
                Live tracking
              </span>
            </div>
          </div>

          {/* CENTERED QUICK LINKS */}
          <div className="flex flex-col items-center">
            <h4 className="font-bold">Quick Links</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-300 text-center">
              <li>
                <Link
                  className="transition-colors hover:text-white"
                  href={ROUTES.about}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-white"
                  href={ROUTES.faqs}
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold">Contact Us</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-200" />
                <span>support@mini-truck.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-200" />
                <span>+254112166635</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-200" />
                <span>Biashara Street, Nairobi CBD</span>
              </li>
            </ul>

            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400">
              Need help fast? Check the FAQs or email support and we’ll get back
              to you.
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-400 text-center">
          © 2026 Mini-Track. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
