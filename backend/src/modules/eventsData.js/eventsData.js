// Shared events data for the application
export const eventsData = [
  {
    id: 1,
    title: 'Startup Funding Masterclass 2026',
    category: 'workshops',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
      'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200',
    ],
    date: 'Jan 15, 2025',
    time: '10:00 AM - 6:00 PM',
    duration: '8 hours',
    location: 'Hyderabad Convention Center',
    locationUrl: 'https://maps.google.com',
    price: 999,
    originalPrice: 1499,
    priceLabel: '₹999 onwards',
    seats: 50,
    featured: true,
    tags: ['Funding', 'Investment', 'Pitch'],
    organizer: 'StartupsIndia',
    attendees: 234,
    ageLimit: '18yrs +',
    language: 'English & Hindi',
    genre: 'Workshop',
    status: 'Filling Fast',
    description: `Master the art of securing funding for your startup in this comprehensive full-day workshop. Learn from successful founders and investors who have raised millions in funding.

This intensive masterclass covers everything from crafting the perfect pitch deck to negotiating term sheets. You'll get hands-on practice with real pitch scenarios and receive personalized feedback from industry experts.

Topics covered include: Understanding different funding stages, Building relationships with investors, Valuation strategies, Due diligence preparation, and Post-funding growth strategies.`,
    highlights: [
      'Hands-on pitch practice with real investors',
      'Personalized feedback on your pitch deck',
      'Networking lunch with angel investors included',
      'All materials and templates provided',
    ],
    artists: [
      {
        name: 'Rajesh Kumar',
        role: 'Serial Entrepreneur & Angel Investor',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        bio: 'Founded 3 successful startups, raised $50M+ in funding',
      },
      {
        name: 'Priya Sharma',
        role: 'VC Partner',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        bio: 'Partner at leading VC firm, invested in 100+ startups',
      }
    ],
  },
  {
    id: 2,
    title: 'Tech Innovation Summit',
    category: 'conferences',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
    images: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200',
    ],
    date: 'Jan 20, 2025',
    time: '9:00 AM - 8:00 PM',
    duration: '11 hours',
    location: 'Bangalore Tech Park',
    locationUrl: 'https://maps.google.com',
    price: 2499,
    originalPrice: 3999,
    priceLabel: '₹2499 onwards',
    seats: 25,
    featured: true,
    tags: ['Technology', 'AI', 'Innovation'],
    organizer: 'Tech Leaders',
    attendees: 567,
    ageLimit: '16yrs +',
    language: 'English',
    genre: 'Conference',
    status: 'Almost Full',
    description: `Join India's premier technology conference featuring keynotes from global tech leaders, hands-on workshops, and networking opportunities with the brightest minds in tech.

Explore the latest trends in AI, machine learning, blockchain, and emerging technologies. Get insights from CTOs of unicorn startups and tech giants about building scalable technology solutions.

The summit includes multiple tracks covering AI/ML, Cloud Architecture, DevOps, Cybersecurity, and Product Innovation. Network with 500+ tech professionals and discover partnership opportunities.`,
    highlights: [
      'Keynotes from 10+ global tech leaders',
      'Hands-on workshops on AI and ML',
      'Networking dinner with speakers included',
      'Access to exclusive tech demos and product launches',
    ],
    artists: [
      {
        name: 'Dr. Amit Patel',
        role: 'AI Research Scientist',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        bio: 'Leading AI researcher, published 50+ papers, ex-Google',
      }
    ],
  },
  {
    id: 3,
    title: 'Digital Marketing Workshop',
    category: 'workshops',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    images: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
      'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
    ],
    date: 'Jan 18, 2025',
    time: '2:00 PM - 5:00 PM',
    duration: '3 hours',
    location: 'Mumbai Startup Hub',
    locationUrl: 'https://maps.google.com',
    price: 499,
    originalPrice: 799,
    priceLabel: '₹499 onwards',
    seats: 100,
    featured: false,
    tags: ['Marketing', 'Social Media', 'SEO'],
    organizer: 'Marketing Pros',
    attendees: 123,
    ageLimit: 'All ages',
    language: 'English & Hindi',
    genre: 'Workshop',
    status: 'Open',
    description: `Learn proven digital marketing strategies that drive real results. This practical workshop covers SEO, social media marketing, content marketing, and paid advertising.

Get hands-on experience with industry-standard tools and learn how to create campaigns that convert. Perfect for startup founders, marketers, and business owners looking to grow their online presence.

Walk away with a complete digital marketing plan for your business and actionable strategies you can implement immediately.`,
    highlights: [
      'Live campaign creation and optimization',
      'Access to premium marketing tools (30-day trial)',
      'Digital marketing toolkit included',
      'Certificate of completion provided',
    ],
    artists: [
      {
        name: 'Sneha Reddy',
        role: 'Digital Marketing Expert',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        bio: 'Grew 20+ startups to 1M+ followers, ex-Meta',
      }
    ],
  },
  {
    id: 4,
    title: 'Founder\'s Networking Mixer',
    category: 'networking',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
      'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=1200',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200',
    ],
    date: 'Jan 22, 2025',
    time: '6:00 PM - 10:00 PM',
    duration: '4 hours',
    location: 'Delhi Innovation Center',
    locationUrl: 'https://maps.google.com',
    price: 0,
    originalPrice: 0,
    priceLabel: 'Free Entry',
    seats: 200,
    featured: true,
    tags: ['Networking', 'Founders', 'Community'],
    organizer: 'StartupsIndia',
    attendees: 892,
    ageLimit: '21yrs +',
    language: 'English',
    genre: 'Networking',
    status: 'Open',
    description: `Connect with fellow founders, investors, and startup enthusiasts in a relaxed evening setting. This is your chance to build meaningful relationships that can accelerate your startup journey.

Enjoy curated networking sessions, lightning talks from successful founders, and plenty of opportunities for one-on-one conversations. Food and beverages provided throughout the evening.

Whether you're looking for co-founders, investors, mentors, or just want to expand your network, this mixer is the perfect place to make valuable connections.`,
    highlights: [
      'Complimentary food and beverages',
      'Structured networking sessions',
      'Lightning talks from 5 successful founders',
      'No sales pitches - pure networking',
    ],
    artists: [
      {
        name: 'Community Team',
        role: 'Event Organizers',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
        bio: 'Organizing startup events since 2018',
      }
    ],
  },
  {
    id: 5,
    title: 'Product Design Bootcamp',
    category: 'workshops',
    image: 'https://images.unsplash.com/photo-1558403194-611308249627?w=800',
    images: [
      'https://images.unsplash.com/photo-1558403194-611308249627?w=1200',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200',
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200',
    ],
    date: 'Jan 25, 2025',
    time: '10:00 AM - 4:00 PM',
    duration: '6 hours',
    location: 'Pune Design Studio',
    locationUrl: 'https://maps.google.com',
    price: 1299,
    originalPrice: 1999,
    priceLabel: '₹1299 onwards',
    seats: 30,
    featured: false,
    tags: ['Design', 'UX', 'Product'],
    organizer: 'Design Masters',
    attendees: 345,
    ageLimit: '18yrs +',
    language: 'English',
    genre: 'Bootcamp',
    status: 'Filling Fast',
    description: `Intensive one-day bootcamp covering the complete product design process from research to prototyping. Learn industry-standard tools and methodologies used by top design teams.

Work on real product challenges and get feedback from experienced designers. Master Figma, user research techniques, wireframing, prototyping, and design systems.

Perfect for aspiring product designers, developers wanting to learn design, and founders who want to improve their product's UX.`,
    highlights: [
      'Hands-on project with real product challenge',
      'Figma Pro access for 3 months included',
      'Design resources and templates library',
      'Portfolio review and career guidance session',
    ],
    artists: [
      {
        name: 'Arjun Mehta',
        role: 'Lead Product Designer',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        bio: 'Ex-Airbnb designer, designed products used by 10M+ users',
      }
    ],
  },
  {
    id: 6,
    title: 'Blockchain & Web3 Summit',
    category: 'conferences',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    images: [
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200',
      'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200',
      'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=1200',
    ],
    date: 'Feb 01, 2025',
    time: '9:00 AM - 7:00 PM',
    duration: '10 hours',
    location: 'Goa Tech Beach',
    locationUrl: 'https://maps.google.com',
    price: 3999,
    originalPrice: 5999,
    priceLabel: '₹3999 onwards',
    seats: 15,
    featured: true,
    tags: ['Blockchain', 'Web3', 'Crypto'],
    organizer: 'Crypto Leaders',
    attendees: 678,
    ageLimit: '18yrs +',
    language: 'English',
    genre: 'Summit',
    status: 'Almost Full',
    description: `Dive deep into the world of blockchain, cryptocurrencies, and Web3 technologies. Learn from pioneers who are building the decentralized future.

Explore DeFi, NFTs, DAOs, and emerging blockchain use cases. Network with crypto entrepreneurs, developers, and investors. Get insights into building and launching Web3 projects.

The summit includes technical workshops, investment panels, and exclusive networking sessions with Web3 leaders.`,
    highlights: [
      'Exclusive NFT badge for all attendees',
      'Access to private Web3 founder community',
      'Beachside networking dinner included',
      'Early access to upcoming Web3 projects',
    ],
    artists: [
      {
        name: 'Vikram Singh',
        role: 'Blockchain Architect',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
        bio: 'Built 5 DeFi protocols, $500M+ TVL',
      }
    ],
  },
  {
    id: 7,
    title: 'Startup Legal Workshop',
    category: 'webinars',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    images: [
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200',
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200',
    ],
    date: 'Jan 28, 2025',
    time: '3:00 PM - 5:00 PM',
    duration: '2 hours',
    location: 'Online Event',
    locationUrl: 'https://zoom.us',
    price: 299,
    originalPrice: 499,
    priceLabel: '₹299 onwards',
    seats: 500,
    featured: false,
    tags: ['Legal', 'Compliance', 'Startup'],
    organizer: 'Legal Experts',
    attendees: 456,
    ageLimit: 'All ages',
    language: 'English & Hindi',
    genre: 'Webinar',
    status: 'Open',
    description: `Navigate the complex legal landscape of starting and running a business in India. This online workshop covers incorporation, compliance, contracts, and intellectual property.

Learn how to protect your startup legally from day one. Understand founder agreements, employee contracts, fundraising documents, and regulatory compliance requirements.

Get your legal questions answered by experienced startup lawyers in a live Q&A session.`,
    highlights: [
      'Live Q&A with startup lawyers',
      'Legal document templates included',
      'Recording available for 30 days',
      'Certificate of attendance provided',
    ],
    artists: [
      {
        name: 'Adv. Meera Kapoor',
        role: 'Startup Legal Expert',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
        bio: 'Advised 200+ startups on legal matters',
      }
    ],
  },
  {
    id: 8,
    title: 'Coffee with Founders',
    category: 'meetups',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200',
    ],
    date: 'Jan 30, 2025',
    time: '8:00 AM - 10:00 AM',
    duration: '2 hours',
    location: 'Cafe Innovation, Bangalore',
    locationUrl: 'https://maps.google.com',
    price: 0,
    originalPrice: 0,
    priceLabel: 'Free Entry',
    seats: 50,
    featured: false,
    tags: ['Casual', 'Networking', 'Coffee'],
    organizer: 'Community',
    attendees: 234,
    ageLimit: 'All ages',
    language: 'English & Hindi',
    genre: 'Meetup',
    status: 'Open',
    description: `Start your day with great coffee and even better conversations. This casual morning meetup brings together founders, aspiring entrepreneurs, and startup enthusiasts.

No formal agenda, no presentations - just authentic conversations over coffee. Share your challenges, learn from others' experiences, and make genuine connections.

Perfect for early risers who want to network in a relaxed, informal setting before the workday begins.`,
    highlights: [
      'Complimentary coffee and breakfast',
      'Casual, no-pressure environment',
      'Small group for meaningful conversations',
      'Weekly recurring event',
    ],
    artists: [
      {
        name: 'Community Hosts',
        role: 'Event Facilitators',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400',
        bio: 'Building the startup community one coffee at a time',
      }
    ],
  },
];

// Helper function to get event by ID
export const getEventById = (id) => {
  return eventsData.find(event => event.id === parseInt(id));
};

// Helper function to get all events
export const getAllEvents = () => {
  return eventsData;
};
