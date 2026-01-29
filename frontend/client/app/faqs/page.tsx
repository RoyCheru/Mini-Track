import FAQAccordion from "@/app/components/FAQAccordion"

export default function FAQsPage() {
  return (
    <div className="container-max py-14">
      <h1 className="text-4xl font-extrabold">FAQs</h1>
      <p className="mt-4 text-slate-600">Common questions about booking, tracking, and safety.</p>
      <div className="mt-10">
        <FAQAccordion />
      </div>
    </div>
  )
}
