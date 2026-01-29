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
      <section className="container-max mt-14">
        <ProblemSolution />
      </section>

      <section className="container-max mt-16">
        <Values />
      </section>

      <section className="container-max mt-14">
        <CTASection />
      </section>
    </div>
  )
}
