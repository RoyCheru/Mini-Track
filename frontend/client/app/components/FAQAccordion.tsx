'use client';

import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function FAQAccordion() {
  const [activeId, setActiveId] = useState<number | null>(1);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "How does the real-time tracking work?",
      answer: "Our minibuses are equipped with GPS trackers that provide live location updates. Parents can track their child's journey in real-time through our mobile app or web portal, receiving notifications for pickups, drop-offs, and any route changes.",
      category: "Technology"
    },
    {
      id: 2,
      question: "What safety measures are in place?",
      answer: "We implement multiple safety layers: certified drivers with background checks, CCTV cameras in vehicles, emergency alert systems, regular vehicle maintenance checks, and mandatory seat belt usage. All trips are monitored in real-time by our safety team.",
      category: "Safety"
    },
    {
      id: 3,
      question: "How much does the service cost?",
      answer: "Pricing varies based on distance and plan type. Monthly subscriptions start at $49. We offer sibling discounts (15% off for second child), quarterly/annual payment discounts (10%), and need-based scholarships for eligible families.",
      category: "Pricing"
    },
    {
      id: 4,
      question: "What if my child misses the bus?",
      answer: "If your child misses the scheduled pick-up, our driver will wait for 2 minutes and then call the parent. We have a protocol for missed pickups with alternative arrangements and a backup vehicle system for emergencies.",
      category: "Operations"
    },
    {
      id: 5,
      question: "Can I change my pick-up location?",
      answer: "Yes, you can update pick-up locations through the app with 24 hours notice. For last-minute changes, there's a $5 fee and availability depends on route optimization. Emergency location changes are handled case-by-case.",
      category: "Flexibility"
    },
    {
      id: 6,
      question: "What vehicles do you use?",
      answer: "We use modern minibuses (12-15 seaters) that are regularly serviced and equipped with safety features. All vehicles have air conditioning, first-aid kits, fire extinguishers, and are wheelchair accessible upon request.",
      category: "Vehicles"
    },
    {
      id: 7,
      question: "How are drivers selected and trained?",
      answer: "Drivers undergo rigorous screening: background checks, driving record review, psychological evaluation, and reference checks. They receive regular training in child safety, first aid, emergency response, and customer service.",
      category: "Drivers"
    },
    {
      id: 8,
      question: "What's your cancellation policy?",
      answer: "You can cancel your subscription with 30 days notice. No cancellation fees apply. For temporary suspensions (illness/vacation), we offer flexible hold options up to 4 weeks per year at no extra cost.",
      category: "Policies"
    }
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const toggleFAQ = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
          onClick={() => setActiveId(1)}
        >
          All Questions
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            onClick={() => {
              const firstInCategory = faqs.find(faq => faq.category === category);
              if (firstInCategory) setActiveId(firstInCategory.id);
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      {faqs.map((faq) => (
        <div
          key={faq.id}
          className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-brand-300"
        >
          <button
            className="w-full p-6 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
            onClick={() => toggleFAQ(faq.id)}
            aria-expanded={activeId === faq.id}
            aria-controls={`faq-answer-${faq.id}`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-brand-100 text-brand-700 text-xs font-semibold rounded-full">
                  {faq.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {faq.question}
              </h3>
            </div>
            <div className={`ml-4 transform transition-transform duration-300 ${activeId === faq.id ? 'rotate-180' : ''}`}>
              <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          <div
            id={`faq-answer-${faq.id}`}
            className={`overflow-hidden transition-all duration-300 ${
              activeId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
            role="region"
            aria-hidden={activeId !== faq.id}
          >
            <div className="p-6 pt-0">
              <div className="pl-4 border-l-2 border-brand-400">
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
                {faq.id === 3 && (
                  <div className="mt-4 p-4 bg-brand-50 rounded-lg">
                    <h4 className="font-semibold text-brand-700 mb-2">Popular Plans:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-sm">
                        <div className="font-medium">Basic Plan</div>
                        <div className="text-brand-600">$49/month</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Family Plan</div>
                        <div className="text-brand-600">$84/month</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Contact Support */}
      <div className="mt-8 p-6 bg-gradient-to-r from-brand-50 to-brand-100/50 rounded-2xl border border-brand-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Still have questions?</h3>
            <p className="text-gray-600">Our support team is here to help you 24/7</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors">
              Contact Support
            </button>
            <button className="bg-white text-brand-600 px-6 py-3 rounded-lg font-semibold border border-brand-200 hover:bg-brand-50 transition-colors">
              Call Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}