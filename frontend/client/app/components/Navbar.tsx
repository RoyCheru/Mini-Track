'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import Button from "@/app/components/Button"
import { ROUTES } from "@/lib/routes"

export default function Navbar() {
  const pathname = usePathname()
  if (pathname.startsWith("/dashboard")) return null

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="container-max flex h-16 items-center justify-between">
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <span className="text-lg font800 font-extrabold">Mini-Track</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
            href={ROUTES.about}
          >
            About Us
          </Link>
          <Link
            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
            href={ROUTES.faqs}
          >
            FAQs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link className="btn btn-ghost" href={ROUTES.signin}>
            Sign In
          </Link>
          <Link className="btn btn-primary" href={ROUTES.signup}>
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  )
}
