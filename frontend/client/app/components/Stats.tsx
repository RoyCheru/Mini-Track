export default function Stats() {
  return (
    <section className="container-max">
      <div className="mt-6 grid gap-10 border-t border-slate-100 py-10 md:grid-cols-3">
        <div>
          <div className="text-4xl font-extrabold">500+</div>
          <div className="mt-1 text-slate-600">Students</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold">50+</div>
          <div className="mt-1 text-slate-600">Routes</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold">99%</div>
          <div className="mt-1 text-slate-600">On-Time</div>
        </div>
      </div>
    </section>
  )
}
