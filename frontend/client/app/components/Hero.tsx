export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 md:pt-32">
      {/* Main Background Container */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0">
          {/* Background Image */}
          <img 
            src="/images/bgimage.png" 
            alt="School transportation background"
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/50 -z-10" />
          
          {/* blue for top section */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/30 via-transparent to-transparent" />
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-brand-300/20 rounded-full blur-3xl -z-10" />
      
      <div className="container-max relative z-10">
        {/* Top Section*/}
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-500/90 backdrop-blur-sm border border-brand-400 rounded-full px-4 py-2 mb-8 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-white">Safe & Reliable School Transport</span>
          </div>
          
          {/* Main Heading */}
          <div className="relative mb-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Safe Rides for 
              <span className="relative inline-block ml-4">
                <span className="relative z-10 text-white">Every Child</span>
                {/* Light blue underline */}
                <span className="absolute bottom-2 left-0 w-full h-3 bg-brand-400/50 -z-0 rounded-lg backdrop-blur-sm"></span>
              </span>
            </h1>
          </div>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Affordable, tracked, and secure minibus transportation for students. 
            Join thousands of parents who trust us for their children's daily commute.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {/* Primary Button */}
            <button className="bg-brand-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-600 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5">
              Book a Ride Now
            </button>
            
            {/* Secondary Button */}
            <button className="bg-transparent text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-brand-400/70 hover:border-brand-400 hover:bg-brand-500/20 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See How It Works
              </div>
            </button>
          </div>
          
          {/* Stats Preview */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl max-w-2xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-white/80">Students Transported</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99%</div>
                <div className="text-sm text-white/80">On-Time Arrival</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-white/80">Schools Covered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9★</div>
                <div className="text-sm text-white/80">Parent Rating</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-20 relative">
          {/* White Background Container */}
          {/* <div className="absolute inset-0 bg-white -z-20 rounded-3xl shadow-2xl"></div> */}
          
          {/* Main Dashboard Card */}
          {/* <div className="relative rounded-3xl overflow-hidden border border-gray-200 bg-white">
            <div className="p-6 md:p-8"> */}
              {/* Header */}
              {/* <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Live Tracking through our dashboard</h2>
                  <p className="text-gray-600 mt-1">Monitor your child's journey in real-time</p>
                </div>
                <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-2">
                  <div className="text-brand-700 font-semibold">Our active routes: 12</div>
                </div>
              </div> */}
              
              {/* Dashboard Content */}
              {/* <div className="bg-gradient-to-r from-brand-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Current Active Routes</h3>
                    <p className="text-gray-600 text-sm">All routes operating normally</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-600 font-medium">All Systems Active</span>
                  </div>
                </div> */}
                
                {/* Map Visualization */}
                {/* <div className="h-48 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📍</div>
                      <p className="text-gray-700 font-medium">Live Route Visualization</p>
                      <p className="text-gray-500 text-sm mt-1">Real-time tracking enabled</p>
                    </div>
                  </div>
                </div> */}
                
                {/* Stats Row */}
                {/* <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                    <div className="text-lg font-bold text-brand-600">45 min</div>
                    <div className="text-gray-600 text-sm">Avg. Travel Time</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                    <div className="text-lg font-bold text-brand-600">98%</div>
                    <div className="text-gray-600 text-sm">On-Time Today</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                    <div className="text-lg font-bold text-brand-600">250+</div>
                    <div className="text-gray-600 text-sm">Parents Tracking</div>
                  </div>
                </div>
              </div> */}
              
              {/* CTA Button */}
              {/* <div className="mt-8 text-center">
                <button className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Tracking Your Child's Route
                </button>
              </div> */}
            {/* </div>
          </div> */}
          
          {/* Floating Elements - Adjusted for white background */}
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl shadow-xl -z-10 opacity-80"></div>
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl shadow-xl -z-10 opacity-80"></div>
        </div>
      </div>
    </section>
  );
}