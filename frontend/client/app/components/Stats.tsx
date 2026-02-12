import React from 'react';

interface StatItem {
  id: number;
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function Stats() {
  const stats: StatItem[] = [
    {
      id: 1,
      value: "10,000+",
      label: "Students Transported",
      description: "Across 50+ schools",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      value: "99.5%",
      label: "Safety Record",
      description: "Zero major incidents",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "from-emerald-500 to-green-500"
    },
    {
      id: 3,
      value: "24/7",
      label: "Live Tracking",
      description: "Real-time parent updates",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "from-brand-500 to-brand-600"
    },
    {
      id: 4,
      value: "40%",
      label: "More Affordable",
      description: "Than traditional transport",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-orange-500 to-amber-500"
    }
  ];

  return (
    <div className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.id} 
            className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 rounded-2xl -z-10 group-hover:opacity-10 transition-opacity`} />
            
            {/* Icon*/}
            <div className={`mb-4 ${stat.color.split(' ')[0].replace('from-', 'text-')} group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            
            {/* Value */}
            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
            
            {/* Label */}
            <div className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</div>
            
            {/* Description */}
            <div className="text-sm text-gray-600">{stat.description}</div>
            
            {/* Decorative Line */}
            <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-brand-300 transition-colors"></div>
          </div>
        ))}
      </div>
      
      {/* Additional Info */}
      <div className="mt-10 text-center">
        <p className="text-gray-600">
          <span className="font-semibold text-brand-600">Trusted by 2,500+ parents</span> across the city
        </p>
        <div className="flex items-center justify-center mt-4 gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-gray-700 font-medium ml-2">4.9/5 based on 1,200 reviews</span>
        </div>
      </div>
    </div>
  );
}