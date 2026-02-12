import React from 'react';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function FeatureGrid() {
  const features: Feature[] = [
    {
      id: 1,
      title: "Real-Time Tracking",
      description: "Live GPS tracking lets parents monitor their child's journey in real-time with automated arrival notifications.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 2,
      title: "Safety First",
      description: "Trained drivers, CCTV cameras, and emergency alert systems ensure maximum safety for every child.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      id: 3,
      title: "Affordable Pricing",
      description: "Flexible payment plans and subsidized rates make transportation accessible for all families.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-amber-100 text-amber-600"
    },
    {
      id: 4,
      title: "Smart Scheduling",
      description: "AI-powered route optimization and flexible scheduling for efficient transportation management.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: 5,
      title: "Parent Dashboard",
      description: "Comprehensive dashboard for bookings, payments, and communication with drivers.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
      color: "bg-brand-100 text-brand-600"
    },
    {
      id: 6,
      title: "Eco-Friendly",
      description: "Electric and hybrid vehicles reducing carbon footprint for a greener future.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "bg-green-100 text-green-600"
    }
  ];

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div 
            key={feature.id} 
            className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-brand-200 transition-all duration-300 hover:shadow-lg"
          >
            {/* Icon Container */}
            <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
              {feature.icon}
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-700 transition-colors">
              {feature.title}
            </h3>
            
            {/* Description */}
            <p className="text-gray-600 mb-4 leading-relaxed">
              {feature.description}
            </p>
            
            {/* Learn More Link */}
            <div className="flex items-center text-brand-600 font-medium group-hover:text-brand-700 transition-colors">
              <span>Learn more</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}