import Link from "next/link"
import { ROUTES } from "@/lib/routes"

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-900 text-slate-200">
      <div className="container-max py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            
              </span>
              <span className="text-lg font-extrabold">Mini-Truck</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Making school transportation safe, affordable, and accessible for every child in developing countries.
            </p>
          </div>

          <div>
            <h4 className="font-bold">Quick Links</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li><Link href={ROUTES.about}>About Us</Link></li>
              <li><Link href={ROUTES.faqs}>FAQs</Link></li>
              <li><Link href={ROUTES.howItWorks}>How It Works</Link></li>
              <li><Link href={ROUTES.pricing}>Pricing</Link></li>
              <li><Link href={ROUTES.routes}>Routes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold">For Parents</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li><Link href={ROUTES.parentDashboard}>Parent Dashboard</Link></li>
              <li><Link href={ROUTES.trackChild}>Track Your Child</Link></li>
              <li><Link href={ROUTES.bookingHistory}>Booking History</Link></li>
              <li><Link href={ROUTES.safetyGuidelines}>Safety Guidelines</Link></li>
              <li><Link href={ROUTES.support}>Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold">Contact Us</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>📧 support@mini-truck.com</li>
              <li>📞 +254112166635</li>
              <li>📍 Biashara Street, Nairobi CBD</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-sm text-slate-400">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span>© 2026 Mini-Truck. All rights reserved.</span>
            <div className="flex gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Cookie Policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
