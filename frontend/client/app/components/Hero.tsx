import Link from "next/link"
import Button from "@/app/components/Button"
import { ROUTES } from "@/lib/routes"

export default function Hero() {
  return (
    <section className="bg-linear-to-b from-brand-50 to-white">
      <div className="container-max grid gap-10 py-14 md:grid-cols-2 md:items-center">
        <div>
          <span className="badge">Safe & Affordable School Transport</span>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Making School Journeys{" "}
            <span className="text-brand-600">Safe & Simple</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-7 text-slate-600">
            Book reliable minibus transport for your children. Track routes in real-time, receive instant notifications,
            and ensure safe pickup and drop-off every day.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={ROUTES.signup} className=" btn btn-primary">
              Get Started
            </Link>
            <Link href={ROUTES.howItWorks} className="btn btn-ghost">
              Learn More
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="mt-4 text-xl font-bold">Route Tracking</h3>
            <p className="mt-2 text-slate-600">View all available routes on an interactive map</p>
     
          </div>

          <div className="card p-6">
            <h3 className="mt-4 text-xl font-bold">Safe Transport</h3>
            <p className="mt-2 text-slate-600">Verified drivers and secure minibuses</p>
  
          </div>

          <div className="card p-6">
            <h3 className="mt-4 text-xl font-bold">Real-Time Alerts</h3>
            <p className="mt-2 text-slate-600">Get notified on pickup and drop-off</p>

          </div>

          <div className="card p-6">
            <h3 className="mt-4 text-xl font-bold">Easy Booking</h3>
            <p className="mt-2 text-slate-600">Book seats with just a few clicks</p>

          </div>
        </div>
      </div>
    </section>
  )
}
