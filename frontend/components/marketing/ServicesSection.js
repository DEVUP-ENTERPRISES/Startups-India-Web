'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ServicesSection() {
  const services = [
    {
      title: 'Startup Incubation Program',
      description: 'Transform your idea into a viable business with our comprehensive 6-month incubation program. We provide mentorship, resources, and strategic guidance to help you build a strong foundation.',
      bgColor: '#FFB3D9',
      icon: (
        <svg viewBox="0 0 120 120" className="service-icon">
          <rect x="20" y="30" width="80" height="70" rx="4" fill="#FF1493" opacity="0.2"/>
          <rect x="25" y="35" width="70" height="60" rx="3" fill="white" stroke="#FF1493" strokeWidth="2"/>
          <line x1="35" y1="45" x2="85" y2="45" stroke="#FF1493" strokeWidth="2"/>
          <line x1="35" y1="55" x2="75" y2="55" stroke="#FF1493" strokeWidth="2"/>
          <line x1="35" y1="65" x2="80" y2="65" stroke="#FF1493" strokeWidth="2"/>
          <line x1="35" y1="75" x2="70" y2="75" stroke="#FF1493" strokeWidth="2"/>
          <rect x="75" y="70" width="25" height="15" rx="2" fill="#FF1493"/>
          <path d="M 82 75 L 88 80 L 93 73" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
      )
    },
    {
      title: 'Funding & Investment Support',
      description: 'Connect with angel investors, VCs, and funding opportunities. We help you craft compelling pitch decks, prepare for investor meetings, and navigate the fundraising process successfully.',
      bgColor: '#C7C7FF',
      icon: (
        <svg viewBox="0 0 120 120" className="service-icon">
          <rect x="25" y="70" width="70" height="40" rx="3" fill="#6366F1" opacity="0.2"/>
          <rect x="30" y="40" width="60" height="50" rx="3" fill="white" stroke="#6366F1" strokeWidth="2"/>
          <line x1="40" y1="50" x2="80" y2="50" stroke="#6366F1" strokeWidth="2"/>
          <line x1="40" y1="60" x2="75" y2="60" stroke="#6366F1" strokeWidth="2"/>
          <line x1="40" y1="70" x2="70" y2="70" stroke="#6366F1" strokeWidth="2"/>
          <circle cx="70" cy="35" r="15" fill="#6366F1"/>
          <text x="70" y="42" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">$</text>
        </svg>
      )
    },
    {
      title: 'Mentorship & Networking',
      description: 'Get guidance from successful entrepreneurs and industry experts. Access our network of mentors, participate in workshops, and connect with fellow founders to accelerate your growth journey.',
      bgColor: '#FFE699',
      icon: (
        <svg viewBox="0 0 120 120" className="service-icon">
          <rect x="30" y="40" width="60" height="50" rx="4" fill="white" stroke="#FFA500" strokeWidth="2"/>
          <circle cx="45" cy="55" r="8" fill="#FFA500" opacity="0.3"/>
          <circle cx="75" cy="55" r="8" fill="#FFA500" opacity="0.3"/>
          <circle cx="60" cy="70" r="12" fill="#FFA500"/>
          <path d="M 50 75 Q 60 85 70 75" stroke="white" strokeWidth="2" fill="none"/>
          <line x1="45" y1="55" x2="55" y2="65" stroke="#FFA500" strokeWidth="2"/>
          <line x1="75" y1="55" x2="65" y2="65" stroke="#FFA500" strokeWidth="2"/>
        </svg>
      )
    },
    {
      title: 'Technical Infrastructure & Tools',
      description: 'Access cloud credits, development tools, and technical infrastructure. Our partnerships with leading tech companies provide you with the resources needed to build and scale your product.',
      bgColor: '#B3F5D1',
      icon: (
        <svg viewBox="0 0 120 120" className="service-icon">
          <rect x="25" y="35" width="70" height="55" rx="3" fill="white" stroke="#10B981" strokeWidth="2"/>
          <rect x="30" y="40" width="25" height="20" rx="2" fill="#10B981" opacity="0.3"/>
          <rect x="60" y="40" width="25" height="20" rx="2" fill="#10B981" opacity="0.3"/>
          <rect x="30" y="65" width="25" height="20" rx="2" fill="#10B981" opacity="0.3"/>
          <rect x="60" y="65" width="25" height="20" rx="2" fill="#10B981"/>
          <line x1="35" y1="45" x2="50" y2="45" stroke="#10B981" strokeWidth="1.5"/>
          <line x1="35" y1="50" x2="48" y2="50" stroke="#10B981" strokeWidth="1.5"/>
          <line x1="65" y1="45" x2="80" y2="45" stroke="#10B981" strokeWidth="1.5"/>
          <line x1="65" y1="50" x2="78" y2="50" stroke="#10B981" strokeWidth="1.5"/>
          <line x1="35" y1="70" x2="50" y2="70" stroke="#10B981" strokeWidth="1.5"/>
          <line x1="35" y1="75" x2="48" y2="75" stroke="#10B981" strokeWidth="1.5"/>
          <line x1="65" y1="70" x2="80" y2="70" stroke="white" strokeWidth="1.5"/>
          <line x1="65" y1="75" x2="78" y2="75" stroke="white" strokeWidth="1.5"/>
        </svg>
      )
    }
  ];

  return (
    <section className="services-section">
      {/* Decorative Stars */}
      <div className="service-star service-star-1">✦</div>
      <div className="service-star service-star-2">✦</div>
      
      <div className="container">
        <motion.div 
          className="services-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="services-title">
            Popular Startup Support Services<br/>to Build Your Business
          </h2>
          <p className="services-subtitle">
            Our expert team specializes in delivering tailored solutions designed to elevate your brand and drive measurable results.
          </p>
        </motion.div>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              style={{ backgroundColor: service.bgColor }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="service-card-title">{service.title}</h3>
              <div className="service-icon-wrapper">
                {service.icon}
              </div>
              <p className="service-card-description">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="services-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/signup" className="services-cta-button">
            <span>View More Services</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
