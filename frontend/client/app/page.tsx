import Hero from "@/app/components/Hero"
import FeatureGrid from "@/app/components/FeatureGrid"
import Stats from "@/app/components/Stats"
import ProblemSolution from "@/app/components/ProblemSolution"
import Values from "@/app/components/Values"
// import FAQAccordion from "@/app/components/FAQAccordion"
// import CTASection from "@/app/components/CTASection"

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-brand-100/30 -z-10" />
        <Hero />
      </div>

      {/* Stats Section with Modern Background */}
      <section className="relative mt-12 lg:mt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/5 via-transparent to-brand-600/5 -z-10" />
        <div className="container-max py-8">
          <Stats />
        </div>
      </section>

      {/* Features Section */}
      <section className="container-max mt-16 lg:mt-24">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold mb-4">
            WHY CHOOSE US
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Smarter School <span className="text-brand-600">Transportation</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Modern solutions for safe, reliable, and affordable student transportation
          </p>
        </div>
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-gray-100">
          <FeatureGrid />
        </div>
      </section>

      {/* About Section */}
      <section className="container-max mt-20 lg:mt-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold mb-4">
              OUR MISSION
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Making School Transport <span className="text-brand-600">Accessible</span> For All
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We're revolutionizing school transportation by combining technology with community values to create 
              safe, affordable, and reliable transport solutions for every family.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-brand-600 font-bold">✓</span>
                </div>
                <p className="text-gray-700">Accessible pricing for all income levels</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-brand-600 font-bold">✓</span>
                </div>
                <p className="text-gray-700">Real-time tracking and safety monitoring</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-brand-600 font-bold">✓</span>
                </div>
                <p className="text-gray-700">Community-focused service approach</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <div className="w-full h-full relative overflow-hidden">
  {/* Background Image */}
  <img 
    src="/images/Firefly.png" 
    alt="Happy parents and children"
    className="absolute inset-0 w-full h-full object-cover"
  />
  {/* Dark overlay for text contrast */}
  {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/30" /> */}
  
  {/* Content */}
  {/* <div className="relative z-10 text-white text-center p-8 flex flex-col items-center justify-center h-full">
    <div className="text-5xl font-bold mb-4 drop-shadow-lg">98%</div>
    <div className="text-xl font-semibold mb-2 drop-shadow-md">Parent Satisfaction</div>
    <div className="text-white/90 drop-shadow-md">Based on 1000+ reviews</div>
  </div> */}
</div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl shadow-xl -z-10" />
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="relative mt-20 lg:mt-28">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-brand-50/50 -z-10" />
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold mb-4">
              OUR APPROACH
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              From <span className="text-red-500">Problem</span> to <span className="text-brand-600">Solution</span>
            </h2>
          </div>
          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-6 md:p-8">
            <ProblemSolution />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container-max mt-20 lg:mt-28">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold mb-4">
            OUR CORE VALUES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Built on <span className="text-brand-600">Trust & Safety</span>
          </h2>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600/10 via-transparent to-brand-600/10 rounded-3xl -z-10" />
          <Values />
        </div>
      </section>

      {/* FAQ Section */}
      {/* <section className="container-max mt-20 lg:mt-28">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold mb-4">
              NEED HELP?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked <span className="text-brand-600">Questions</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Everything you need to know about our minibus booking system, safety features, and services.
            </p>
            <div className="bg-brand-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">Still have questions?</h3>
              <p className="text-gray-600 mb-4">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <button className="bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
            <FAQAccordion />
          </div>
        </div>
      </section> */}

     {/* CTA Section */}
{/* <section className="container-max mt-20 lg:mt-28 mb-12">
  <div className="relative overflow-hidden rounded-3xl">
    <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-900 -z-10" />
    <div className="relative z-10 p-8 md:p-12">
      <CTASection />
    </div>
  </div>
</section> */}

      {/* Decorative Elements */}
      <div className="fixed top-20 left-0 w-72 h-72 bg-brand-200/20 rounded-full blur-3xl -z-20" />
      <div className="fixed bottom-20 right-0 w-96 h-96 bg-brand-300/10 rounded-full blur-3xl -z-20" />
    </div>
  )
}