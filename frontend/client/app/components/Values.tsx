export default function Values() {
  const items = [
    { title: "Safety First", desc: "Verified drivers and well-maintained vehicles ensure your child’s safety", icon: "🛡️" },
    { title: "Accessibility", desc: "Making transport affordable for families of all income levels", icon: "👥" },
    { title: "Efficiency", desc: "Optimized routes that save time and reduce environmental impact", icon: "📈" },
    { title: "Community", desc: "Building trust between parents, operators, and schools", icon: "❤️" },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {items.map((i) => (
        <div key={i.title} className="card p-7 text-center">
          <div className="text-3xl">{i.icon}</div>
          <h3 className="mt-4 text-xl font-extrabold">{i.title}</h3>
          <p className="mt-3 text-slate-600">{i.desc}</p>
        </div>
      ))}
    </div>
  )
}
