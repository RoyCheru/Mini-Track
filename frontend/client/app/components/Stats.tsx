type StatsProps = {
  bordered?: boolean
  className?: string
}

export default function Stats({ bordered = true, className = "" }: StatsProps) {
  return (
    <div className={[bordered ? "border-t border-brand-100/60 pt-10" : "", className].join(" ")}>
      <div className="grid gap-10 md:grid-cols-3">
        <div>
          <div className="text-4xl font-extrabold text-slate-900">500+</div>
          <div className="mt-1 text-slate-600">Students</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold text-slate-900">50+</div>
          <div className="mt-1 text-slate-600">Routes</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold text-slate-900">99%</div>
          <div className="mt-1 text-slate-600">On-Time</div>
        </div>
      </div>
    </div>
  )
}
