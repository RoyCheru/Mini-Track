"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ROUTES } from "@/lib/routes"
import { BusFront } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  if (pathname.startsWith("/dashboard")) return null

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100/60 bg-white/80 backdrop-blur">
      <div className="container-max flex h-16 items-center justify-between">
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 shadow-md ring-2 ring-blue-300/40">
            <BusFront className="h-5 w-5 text-white drop-shadow-sm" />
          </span>

          <span className="text-lg font-extrabold tracking-tight">Mini-Track</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link className="text-sm font-semibold text-slate-700 hover:text-slate-900" href={ROUTES.about}>
            About Us
          </Link>
          <Link className="text-sm font-semibold text-slate-700 hover:text-slate-900" href={ROUTES.faqs}>
            FAQs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link className="btn btn-ghost bg-white/70 ring-1 ring-brand-100 hover:bg-white" href={ROUTES.signin}>
            Sign In
          </Link>
          <Link className="btn btn-primary shadow-sm hover:shadow-md transition-all" href={ROUTES.signup}>
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  )
}
