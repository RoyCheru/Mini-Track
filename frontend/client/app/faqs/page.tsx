import FAQAccordion from "@/app/components/FAQAccordion"
// import CTASection from "@/app/components/CTASection"

export default function FAQsPage() {
  return (
    <div className="bg-linear-to-b from-brand-50 via-white to-white">
      <div className="container-max py-14">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight">FAQs</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-700">
            Common questions about booking, tracking, and safety.
          </p>
        </div>

        <div className="mt-10">
          <FAQAccordion />
        </div>

        <div className="mt-12">
          {/* <CTASection /> */}
        </div>
      </div>
    </div>
  )
}
