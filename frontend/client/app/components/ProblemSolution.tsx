import React from 'react';

interface ProblemSolutionItem {
  id: number;
  type: 'problem' | 'solution';
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
}

export default function ProblemSolution() {
  const items: ProblemSolutionItem[] = [
    {
      id: 1,
      type: 'problem',
      title: "The Problem",
      description: "Traditional school transportation faces multiple challenges that affect children's safety and parents' peace of mind.",
      features: [
        "Unreliable timing and frequent delays",
        "Limited safety measures and monitoring",
        "High costs making it inaccessible for many",
        "Lack of real-time tracking and communication",
        "Poor vehicle maintenance and comfort"
      ],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.406 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    {
      id: 2,
      type: 'solution',
      title: "Our Solution",
      description: "Mini-Truck revolutionizes school transportation with technology-driven solutions focused on safety, reliability, and accessibility.",
      features: [
        "Real-time GPS tracking and arrival notifications",
        "Certified drivers with background checks",
        "Affordable subscription-based pricing",
        "24/7 parent support and communication",
        "Modern, well-maintained vehicles"
      ],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`relative rounded-2xl p-8 border transition-all duration-300 hover:shadow-xl ${
              item.type === 'problem' 
                ? 'bg-gradient-to-br from-red-50 to-red-100/30 border-red-200 hover:border-red-300' 
                : 'bg-gradient-to-br from-brand-50 to-brand-100/30 border-brand-200 hover:border-brand-300'
            }`}
          >
            {/* Icon Badge */}
            <div className={`inline-flex p-3 rounded-xl mb-6 ${
              item.type === 'problem' 
                ? 'bg-red-100 text-red-600' 
                : 'bg-brand-100 text-brand-600'
            }`}>
              {item.icon}
            </div>
            
            {/* Title */}
            <h3 className={`text-2xl font-bold mb-4 ${
              item.type === 'problem' ? 'text-red-800' : 'text-brand-800'
            }`}>
              {item.title}
            </h3>
            
            {/* Description */}
            <p className="text-gray-700 mb-6">
              {item.description}
            </p>
            
            {/* Features List */}
            <div className="space-y-3">
              {item.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                    item.type === 'problem' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-brand-100 text-brand-600'
                  }`}>
                    {item.type === 'problem' ? '✗' : '✓'}
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            {/* Decorative Corner */}
            <div className={`absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl ${
              item.type === 'problem' ? 'bg-red-500/10' : 'bg-brand-500/10'
            }`}>
              <div className={`absolute top-0 right-0 w-8 h-8 ${
                item.type === 'problem' ? 'bg-red-500/20' : 'bg-brand-500/20'
              }`}></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Comparison Table */}
      <div className="mt-12 bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
          <div className="p-4 font-semibold text-gray-700">Feature</div>
          <div className="p-4 font-semibold text-red-600 text-center">Traditional</div>
          <div className="p-4 font-semibold text-brand-600 text-center">Mini-Truck</div>
        </div>
        
        {[
          { feature: "Real-time Tracking", traditional: "✗", minitruck: "✓" },
          { feature: "Safety Monitoring", traditional: "Limited", minitruck: "24/7" },
          { feature: "Cost per Month", traditional: "$$$", minitruck: "$" },
          { feature: "Parent Communication", traditional: "Phone Only", minitruck: "App + SMS + Email" },
          { feature: "Vehicle Quality", traditional: "Varies", minitruck: "Premium" }
        ].map((item, index) => (
          <div key={index} className="grid grid-cols-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
            <div className="p-4 text-gray-700">{item.feature}</div>
            <div className="p-4 text-center text-red-500 font-medium">{item.traditional}</div>
            <div className="p-4 text-center text-brand-600 font-medium">{item.minitruck}</div>
          </div>
        ))}
      </div>
    </div>
  );
}