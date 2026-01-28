export default function ProblemSolution() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card border-red-100 bg-red-50/40 p-8">
        <div className="text-2xl">❤️</div>
        <h3 className="mt-4 text-2xl font-extrabold">The Problem</h3>
        <ul className="mt-6 space-y-4 text-slate-700">
          <li>• Children walk long distances on unsafe roads, exposing them to risks and fatigue</li>
          <li>• Public transportation is unreliable, and private taxis are too expensive</li>
          <li>• Parents have no visibility on routes, schedules, or real-time tracking</li>
          <li>• Only wealthier families can afford safe, reliable transportation</li>
        </ul>
      </div>

      <div className="card border-green-100 bg-green-50/40 p-8">
        <div className="text-2xl">🎯</div>
        <h3 className="mt-4 text-2xl font-extrabold">Our Solution</h3>
        <ul className="mt-6 space-y-4 text-slate-700">
          <li>✅ Affordable minibus seats with fixed routes optimized for safety</li>
          <li>✅ Interactive maps showing all available routes and schedules</li>
          <li>✅ Real-time tracking so parents know exactly where their children are</li>
          <li>✅ Instant notifications for pickup and drop-off confirmations</li>
        </ul>
      </div>
    </div>
  )
}
