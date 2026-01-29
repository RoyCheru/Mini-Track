import Link from "next/link"
import { ROUTES } from "@/lib/routes"

export default function HowItWorksPage() {
  return (
    <div className="container-max py-14">
      <h1 className="text-4xl font-extrabold">How It Works</h1>
      <ol className="mt-8 list-decimal space-y-3 pl-6 text-slate-700">
        <li>Create an account (Parent).</li>
        <li>Choose a route and pickup location.</li>
        <li>Reserve a seat and confirm availability.</li>
        <li>Track the bus and receive pickup/drop-off alerts.</li>
      </ol>
      <div className="mt-8 flex gap-3">
        <Link className=" btn btn-primary" href={ROUTES.signup}>Sign up</Link>
        <Link className="btn btn-ghost" href={ROUTES.routes}>Explore routes</Link>
      </div>
    </div>
  )
}
