import Hero from "@/app/components/Hero"
import FeatureGrid from "@/app/components/FeatureGrid"
import Stats from "@/app/components/Stats"
import ProblemSolution from "@/app/components/ProblemSolution"
import Values from "@/app/components/Values"
import FAQAccordion from "@/app/components/FAQAccordion"
import CTASection from "@/app/components/CTASection"

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Stats />
      <section className="container-max mt-10">
        <FeatureGrid />
      </section>

      <section className="container-max mt-20">
        <h2 className="text-center text-4xl font-extrabold">
          About <span className="text-brand-600">Mini-Truck</span>
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-center text-lg text-slate-600">
          We’re on a mission to make school transportation accessible, safe, and affordable for every child,
          regardless of their family’s income.
        </p>
      </section>

      <section className="container-max mt-14">
        <ProblemSolution />
      </section>

      <section className="container-max mt-16">
        <Values />
      </section>

      <section className="container-max mt-20">
        <h2 className="text-center text-5xl font-extrabold">
          Frequently Asked <span className="text-brand-600">Questions</span>
        </h2>
        <p className="mt-4 text-center text-slate-600">
          Find answers to common questions about our minibus booking system
        </p>
        <div className="mt-10">
          <FAQAccordion />
        </div>
      </section>

      <section className="container-max mt-14">
        <CTASection />
      </section>
    </div>
  )
}
