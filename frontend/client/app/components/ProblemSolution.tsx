import { AlertTriangle, Target } from "lucide-react"

export default function ProblemSolution() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-3xl bg-white/80 p-8 ring-1 ring-red-100 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </span>
          <h3 className="text-2xl font-extrabold tracking-tight">The Problem</h3>
        </div>

        <ul className="mt-6 space-y-4 text-slate-700">
          <li>Children walk long distances on unsafe roads, exposing them to risks and fatigue</li>
          <li>Public transportation is unreliable, and private taxis are too expensive</li>
          <li>Parents have no visibility on routes, schedules, or real-time tracking</li>
          <li>Only wealthier families can afford safe, reliable transportation</li>
        </ul>
      </div>

      <div className="rounded-3xl bg-white/80 p-8 ring-1 ring-emerald-100 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
            <Target className="h-5 w-5 text-emerald-600" />
          </span>
          <h3 className="text-2xl font-extrabold tracking-tight">Our Solution</h3>
        </div>

        <ul className="mt-6 space-y-4 text-slate-700">
          <li>Affordable minibus seats with fixed routes optimized for safety</li>
          <li>Interactive maps showing all available routes and schedules</li>
          <li>Real-time tracking so parents know exactly where their children are</li>
          <li>Instant notifications for pickup and drop-off confirmations</li>
        </ul>
      </div>
    </div>
  )
}
