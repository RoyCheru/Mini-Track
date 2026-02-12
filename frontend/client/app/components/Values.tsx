import React from 'react';

interface ValueItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function Values() {
  const values: ValueItem[] = [
    {
      id: 1,
      title: "Safety First",
      description: "Every vehicle is equipped with safety features, GPS tracking, and driven by verified professionals.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Accessibility",
      description: "Affordable pricing and flexible plans ensure every child has access to safe transportation.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Reliability",
      description: "Consistent on-time performance with backup vehicles and contingency plans for uninterrupted service.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Transparency",
      description: "Clear communication, real-time updates, and no hidden fees - we believe in building trust through openness.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 5,
      title: "Community",
      description: "Building relationships with schools, parents, and neighborhoods to create safer routes and better service.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 6,
      title: "Innovation",
      description: "Continuously improving our technology and services to provide the best transportation experience.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((value) => (
          <div 
            key={value.id} 
            className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-brand-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Icon Container */}
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                {value.icon}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                <span className="text-brand-600 font-bold text-sm">{value.id}</span>
              </div>
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-700 transition-colors">
              {value.title}
            </h3>
            
            {/* Description */}
            <p className="text-gray-600">
              {value.description}
            </p>
            
            {/* Hover Indicator */}
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-1 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Values Summary */}
      <div className="mt-12 bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">100%</div>
            <div className="text-brand-100">Safety Verified Drivers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-brand-100">Support Availability</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">98%</div>
            <div className="text-brand-100">Parent Satisfaction Rate</div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-brand-500/30 text-center">
          <p className="text-brand-100 text-lg">
            These values guide every decision we make and every service we provide. 
            <span className="font-semibold text-white"> Your child's safety is our highest priority.</span>
          </p>
        </div>
      </div>
    </div>
  );
}