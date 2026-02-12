'use client';

import React, { useState, useEffect } from 'react';

export default function CTASection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 22,
    seconds: 41
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          return { ...prev, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { hours, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          return { hours: hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFreeTrial = () => {
    console.log('Starting free trial...');
  };

  const handleScheduleDemo = () => {
    console.log('Scheduling demo...');
  };

  const handleClaimDiscount = () => {
    console.log('Claiming discount...');
  };

  return (
    <div className="py-12">
      <div className="text-center">
        {/* Main CTA - Updated for dark blue background */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white/95 mb-6">
            Ready to Transform Your Child's 
            <span className="block text-brand-200">School Commute?</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Join thousands of parents who trust Mini-Truck for safe, reliable, and affordable school transportation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={handleFreeTrial}
              className="bg-white text-brand-700 px-10 py-5 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg shadow-brand-900/30 hover:shadow-xl"
            >
              Start Free Trial
            </button>
            <button 
              onClick={handleScheduleDemo}
              className="bg-transparent text-white px-10 py-5 rounded-xl font-semibold text-lg border-2 border-white/40 hover:border-white/80 hover:bg-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              Schedule a Demo
            </button>
          </div>
          
          <p className="text-white/60 mt-6 text-sm">
            No credit card required • 7-day free trial • Cancel anytime
          </p>
        </div>

        {/* Feature Highlights - Modern Cards with SVG Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              title: "Book in 2 Minutes",
              description: "Simple online booking process",
              bgColor: "bg-blue-50",
              iconColor: "text-blue-600",
              borderColor: "border-blue-100",
              icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )
            },
            {
              title: "Mobile App Access",
              description: "Track rides on any device",
              bgColor: "bg-brand-50",
              iconColor: "text-brand-600",
              borderColor: "border-brand-100",
              icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 3.954v.01M8 3.954v.01" />
                </svg>
              )
            },
            {
              title: "Safety Guarantee",
              description: "100% safety verified",
              bgColor: "bg-emerald-50",
              iconColor: "text-emerald-600",
              borderColor: "border-emerald-100",
              icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className={`group ${item.bgColor} rounded-2xl p-8 border ${item.borderColor} transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer`}
            >
              <div className={`${item.iconColor} mb-5`}>
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-700 transition-colors">
                {item.title}
              </h4>
              <p className="text-gray-600">
                {item.description}
              </p>
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="inline-flex items-center text-brand-600 font-medium">
                  Learn more
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators - Modern Design */}
        <div className="bg-gradient-to-r from-brand-50 to-blue-50 rounded-3xl p-10 mb-12 border border-gray-100">
          <div className="flex flex-col items-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6">
              <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Trusted By</h3>
            <p className="text-gray-600 text-center max-w-md">
              Leading schools across the city choose Mini-Track for their transportation needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { 
                name: "Sunshine Academy", 
                students: "450+ students",
                logoColor: "from-emerald-500 to-green-500"
              },
              { 
                name: "Kibera School of Excellence", 
                students: "320+ students",
                logoColor: "from-amber-500 to-orange-500"
              },
              { 
                name: "Karen C Primary school", 
                students: "280+ students",
                logoColor: "from-blue-500 to-cyan-500"
              },
              { 
                name: "Brookhouse School", 
                students: "380+ students",
                logoColor: "from-purple-500 to-pink-500"
              }
            ].map((school, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-brand-200"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${school.logoColor} rounded-xl flex items-center justify-center mb-4`}>
                  <span className="text-white font-bold text-lg">
                    {school.name.split(' ')[0].charAt(0)}
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900 mb-2">{school.name}</div>
                <div className="text-sm text-gray-500">{school.students}</div>
                <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">4.8/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 pt-10 border-t border-gray-200 text-center">
            <div className="inline-flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>98% Satisfaction Rate</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA - Limited Time Offer */}
        <div className="relative bg-gradient-to-br from-brand-700 to-brand-900 rounded-3xl p-8 md:p-12 overflow-hidden border border-brand-600/20 shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 bg-brand-400 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-brand-300 rounded-full blur-xl"></div>
          </div>
          
          {/* Decorative Accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-400/20 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              {/* Left Content */}
              <div className="text-left flex-1">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 rounded-full px-5 py-2.5 mb-6 shadow-lg">
                  <span className="w-2 h-2 bg-gray-900 rounded-full animate-pulse"></span>
                  <span className="text-gray-900 text-sm font-bold tracking-wider">LIMITED TIME OFFER</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  Get <span className="text-amber-400">20% Off</span> Your First Month
                </h3>
                
                <div className="mb-6">
                  <p className="text-white/80 text-lg mb-2">
                    Use discount code:
                  </p>
                  <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-6 py-3">
                    <span className="font-mono font-bold text-white text-2xl tracking-wider">SAFE20</span>
                    <button className="ml-4 bg-white text-brand-700 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
                      Copy
                    </button>
                  </div>
                </div>
                
                <p className="text-white/70 max-w-md">
                  Secure your child's safe commute today with our most popular plan. Limited spots available!
                </p>
              </div>
              
              {/* Right Content - Button & Timer */}
              <div className="flex flex-col items-center lg:items-end gap-6">
                {/* Discount Button */}
                <button 
                  onClick={handleClaimDiscount}
                  className="group relative bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 px-12 py-5 rounded-2xl font-bold text-xl hover:from-amber-500 hover:to-amber-600 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-amber-500/30"
                >
                  <span className="relative z-10">Claim 20% Discount Now</span>
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                {/* Countdown Timer */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-white/90 font-semibold">Offer expires in:</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Hours */}
                      <div className="text-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px]">
                          <div className="font-mono font-bold text-white text-3xl">
                            {String(timeLeft.hours).padStart(2, '0')}
                          </div>
                        </div>
                        <div className="text-white/70 text-xs mt-2">HOURS</div>
                      </div>
                      
                      <div className="text-white/70 text-2xl font-bold pb-6">:</div>
                      
                      {/* Minutes */}
                      <div className="text-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px]">
                          <div className="font-mono font-bold text-white text-3xl">
                            {String(timeLeft.minutes).padStart(2, '0')}
                          </div>
                        </div>
                        <div className="text-white/70 text-xs mt-2">MINUTES</div>
                      </div>
                      
                      <div className="text-white/70 text-2xl font-bold pb-6">:</div>
                      
                      {/* Seconds */}
                      <div className="text-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px]">
                          <div className="font-mono font-bold text-white text-3xl">
                            {String(timeLeft.seconds).padStart(2, '0')}
                          </div>
                        </div>
                        <div className="text-white/70 text-xs mt-2">SECONDS</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Stats */}
            <div className="mt-10 pt-8 border-t border-white/20">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">2,500+</div>
                  <div className="text-white/70 text-sm">Families Joined</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">98%</div>
                  <div className="text-white/70 text-sm">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">24/7</div>
                  <div className="text-white/70 text-sm">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}