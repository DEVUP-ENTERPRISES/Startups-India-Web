'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { apiGet, apiPatch, apiPost, apiDelete } from '@/lib/api';
import Link from 'next/link';

const LOCKED_TABS = ['requests', 'sessions', 'calendar', 'mentees', 'messages', 'reviews', 'earnings', 'resources', 'analytics'];

import { 
  LayoutDashboard, 
  User, 
  UserCheck, 
  Video, 
  Calendar, 
  Users, 
  MessageSquare, 
  Star, 
  DollarSign, 
  BookOpen, 
  BarChart3, 
  Bell, 
  Settings, 
  HelpCircle,
  LogOut,
  Search,
  Plus,
  Send,
  FileText,
  Share2,
  Lock,
  ChevronRight,
  TrendingUp,
  Award,
  Wallet,
  Clock,
  Sparkles,
  Info,
  Check,
  X,
  MapPin,
  Mail,
  Trash2,
  Briefcase,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

const Linkedin = ({ size = 16, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

function MentorDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') || 'dashboard';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTabState] = useState(tabParam);
  
  // Custom Toast Alerts State
  const [toasts, setToasts] = useState([]);
  
  // Interactive UI Data States
  const [requests, setRequests] = useState([
    { _id: 'req_1', fullName: 'Rohit Verma', role: 'Early-stage Founder', message: 'Looking for guidance on scaling my SaaS product and building initial product marketing strategies.', time: '2h ago', status: 'new', avatar: 'RV', company: 'DevFlow AI', email: 'rohit@devflow.ai' },
    { _id: 'req_2', fullName: 'Ananya Singh', role: 'Student | B.Tech', message: 'Need help in building my career in Product Management. Seeking a structured pathway to learn GTM and user research.', time: '5h ago', status: 'new', avatar: 'AS', company: 'College Project', email: 'ananya@iiit.ac.in' },
    { _id: 'req_3', fullName: 'Karan Malhotra', role: 'Idea Stage Founder', message: 'Seeking mentorship for MVP validation and feedback on our campus logistics model.', time: '1d ago', status: 'pending', avatar: 'KM', company: 'DropShip Campus', email: 'karan@dropship.com' },
    { _id: 'req_4', fullName: 'Siddharth Roy', role: 'Growth Lead', message: 'Need review on our user retention strategies and product loop configurations.', time: '2d ago', status: 'pending', avatar: 'SR', company: 'CollabSpace', email: 'siddharth@collabspace.co' },
    { _id: 'req_5', fullName: 'Tanvi Goyal', role: 'Solo Founder', message: 'Preparing for Pitching to campus micro-VCs. Need review of deck slides 4 to 8.', time: '3d ago', status: 'pending', avatar: 'TG', company: 'FitBite', email: 'tanvi@fitbite.io' }
  ]);
  const [sessions, setSessions] = useState([
    { _id: 'ses_1', studentName: 'Arjun Mehta', topic: 'Startup Strategy Review', time: 'Mon, 20 May 2025 · 07:00 PM', duration: '60 min', status: 'upcoming', avatar: 'AM', meetLink: 'https://meet.google.com/abc-defg-hij', rating: 0, feedback: '' },
    { _id: 'ses_2', studentName: 'Sneha Kapoor', topic: 'Product & Growth', time: 'Tue, 21 May 2025 · 06:00 PM', duration: '60 min', status: 'upcoming', avatar: 'SK', meetLink: 'https://meet.google.com/xyz-lmn-opq', rating: 0, feedback: '' },
    { _id: 'ses_3', studentName: 'Vikram Joshi', topic: 'Fundraising Session', time: 'Wed, 22 May 2025 · 11:00 AM', duration: '45 min', status: 'upcoming', avatar: 'VJ', meetLink: 'https://meet.google.com/pqr-stu-vwx', rating: 0, feedback: '' },
    { _id: 'ses_4', studentName: 'Priya Nair', topic: 'Marketing Strategy', time: 'Thu, 23 May 2025 · 05:00 PM', duration: '60 min', status: 'upcoming', avatar: 'PN', meetLink: 'https://meet.google.com/klm-nop-qrs', rating: 0, feedback: '' },
    { _id: 'ses_5', studentName: 'Kunal Sen', topic: 'MVP Feedback Walkthrough', time: 'Last Thursday', duration: '30 min', status: 'completed', avatar: 'KS', meetLink: '', rating: 5, feedback: 'Extremely helpful advice on cutting down secondary features.' },
    { _id: 'ses_6', studentName: 'Riya Gupta', topic: 'GTM Launch Strategy', time: 'Last Week', duration: '60 min', status: 'completed', avatar: 'RG', meetLink: '', rating: 5, feedback: 'Rahul helped us redefine our target beta cohort accurately.' }
  ]);
  const [messages, setMessages] = useState([
    {
      _id: 'chat_1',
      sender: 'Sneha Kapoor',
      avatar: 'SK',
      text: 'Thanks for the session! It was very insightful.',
      time: '10m ago',
      unread: true,
      chatHistory: [
        { sender: 'me', text: 'Hi Sneha, looking forward to our session tomorrow. Do bring your user persona deck.', time: 'Yesterday' },
        { sender: 'Sneha Kapoor', text: 'I have updated the deck with our latest survey results. See you at 6:00 PM!', time: 'Today, 2:00 PM' },
        { sender: 'Sneha Kapoor', text: 'Thanks for the session! It was very insightful.', time: '10m ago' }
      ]
    },
    {
      _id: 'chat_2',
      sender: 'Arjun Mehta',
      avatar: 'AM',
      text: 'Sharing the product roadmap as discussed.',
      time: '2h ago',
      unread: true,
      chatHistory: [
        { sender: 'Arjun Mehta', text: 'Hey Rahul, could you review the roadmap before our Monday meeting?', time: 'Yesterday' },
        { sender: 'me', text: 'Sure Arjun. Send it over here.', time: 'Yesterday' },
        { sender: 'Arjun Mehta', text: 'Sharing the product roadmap as discussed.', time: '2h ago' }
      ]
    },
    {
      _id: 'chat_3',
      sender: 'Priya Nair',
      avatar: 'PN',
      text: 'Can we reschedule to tomorrow?',
      time: '1d ago',
      unread: false,
      chatHistory: [
        { sender: 'Priya Nair', text: 'Can we reschedule to tomorrow?', time: '1d ago' }
      ]
    },
    {
      _id: 'chat_4',
      sender: 'Vikram Joshi',
      avatar: 'VJ',
      text: 'Thanks for your guidance!',
      time: '2d ago',
      unread: false,
      chatHistory: [
        { sender: 'me', text: 'Best of luck with the pitch, Vikram!', time: '2d ago' },
        { sender: 'Vikram Joshi', text: 'Thanks for your guidance!', time: '2d ago' }
      ]
    }
  ]);
  const [activeChatId, setActiveChatId] = useState('chat_1');
  const [newMessageText, setNewMessageText] = useState('');
  const [mentees, setMentees] = useState([
    { name: 'Arjun Mehta', company: 'GlowRoot', sector: 'AgriTech', stage: 'MVP Built', lastMet: '15 May 2025', progress: 75, email: 'arjun@glowroot.in', bio: 'GlowRoot optimizes micro-irrigation using low-power IoT soil probes.' },
    { name: 'Sneha Kapoor', company: 'FitBite', sector: 'HealthTech', stage: 'Early Sales', lastMet: '10 May 2025', progress: 90, email: 'sneha@fitbite.io', bio: 'FitBite offers sugar-free nutrient snacking packages for tech employees.' },
    { name: 'Vikram Joshi', company: 'DevFlow AI', sector: 'SaaS', stage: 'Beta Launch', lastMet: '12 May 2025', progress: 60, email: 'vikram@devflow.ai', bio: 'DevFlow AI automates pull-request documentation reviews using custom LLMs.' },
    { name: 'Priya Nair', company: 'LogiCampus', sector: 'Logistics', stage: 'Idea Validated', lastMet: 'Today', progress: 40, email: 'priya@logicampus.co', bio: 'Intra-campus swift logistics matching students for delivery tasks.' }
  ]);

  // Schedule Session Modal States
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedFounder, setSchedFounder] = useState('');
  const [schedTopic, setSchedTopic] = useState('');
  const [schedDateTime, setSchedDateTime] = useState('');
  const [schedDuration, setSchedDuration] = useState('30 min');
  const [schedStatus, setSchedStatus] = useState('upcoming');

  // Interactive Monthly Calendar States
  const [currentCalYear, setCurrentCalYear] = useState(new Date().getFullYear());
  const [currentCalMonth, setCurrentCalMonth] = useState(new Date().getMonth());
  const [selectedCalDay, setSelectedCalDay] = useState(new Date().getDate());

  // Starts blank - real values come from /me/profile on load. No mock/preset data.
  const [profileData, setProfileData] = useState({
    fullName: '',
    currentRole: '',
    company: '',
    experience: '',
    location: '',
    email: '',
    phone: '',
    linkedin: '',
    bio: '',
    achievements: '',
    expertise: [],
    availabilitySlots: []
  });

  const [resources, setResources] = useState([
    { _id: 'res_1', title: 'Startup Pitch Deck Checklist', category: 'Fundraising', downloads: 142, date: '12 May 2025', link: 'https://example.com/pitch-deck-checklist' },
    { _id: 'res_2', title: 'Product Market Fit Framework', category: 'Product Strategy', downloads: 389, date: '08 May 2025', link: 'https://example.com/pmf-framework' },
    { _id: 'res_3', title: 'B2B SaaS Go-To-Market Template', category: 'GTM Launch', downloads: 256, date: '01 May 2025', link: 'https://example.com/gtm-template' }
  ]);
  const [newResource, setNewResource] = useState({ title: '', category: 'Product Strategy', link: '' });

  const [notifications, setNotifications] = useState([
    { id: 'not_1', text: 'Welcome to Startup India Mentorship dashboard!', time: '1 week ago', read: true }
  ]);

  const [supportTicket, setSupportTicket] = useState({ subject: '', category: 'General', message: '' });

  // Payout request modal/state
  const [earningsBalance, setEarningsBalance] = useState(12500);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [earnings, setEarnings] = useState({
    balance: 12500,
    totalEarned: 53250,
    payouts: [
      { _id: 'pay_1', amount: 40750, status: 'completed', date: 'Yesterday' }
    ]
  });
  const [reviews, setReviews] = useState([
    { _id: 'rev_1', studentName: 'Kunal Sen', avatar: 'KS', rating: 5, feedback: 'Extremely helpful advice on cutting down secondary features.', date: '3 days ago' },
    { _id: 'rev_2', studentName: 'Riya Gupta', avatar: 'RG', rating: 5, feedback: 'Rahul helped us redefine our target beta cohort accurately.', date: '1 week ago' },
    { _id: 'rev_3', studentName: 'Sneha Kapoor', avatar: 'SK', rating: 4, feedback: 'Great inputs on product onboarding loop.', date: '2 weeks ago' }
  ]);
  const [analytics, setAnalytics] = useState({
    totalSessions: 42,
    upcomingSessions: 4,
    completedSessions: 38,
    averageRating: 4.8,
    monthlyGrowth: 15
  });

  // Real dashboard stats from the backend (/me/dashboard).
  const [stats, setStats] = useState({ totalMentees: 0, upcomingSessionsCount: 0, totalSessions: 0, rating: 0 });

  const setActiveTab = (tab) => {
    if (LOCKED_TABS.includes(tab)) { addToast('This section is coming soon.', 'warning'); return; }
    setActiveTabState(tab);
    router.push(`/dashboard/mentor?tab=${tab}`);
  };

  useEffect(() => {
    const requested = searchParams.get('tab') || 'dashboard';
    // A locked tab reached via a direct URL falls back to the dashboard.
    const tab = LOCKED_TABS.includes(requested) ? 'dashboard' : requested;
    if (tab !== activeTab) {
      setActiveTabState(tab);
    }
  }, [searchParams, activeTab]);

  // Retrieve user & customized profile
  useEffect(() => {
    async function load() {
      const userRes = await getCurrentUser();
      if (!userRes.data?.user) { window.location.href = '/login'; return; }
      setUser(userRes.data.user);
      try {
        // Real data only: dashboard summary + full profile. The other tabs are
        // locked (coming soon), so we don't fetch/seed their data.
        const [dashRes, profileRes] = await Promise.all([
          apiGet('/api/v1/mentors/me/dashboard'),
          apiGet('/api/v1/mentors/me/profile'),
        ]);

        const d = dashRes.data || {};
        if (d.stats) setStats(prev => ({ ...prev, ...d.stats }));

        // Pending mentee requests → the shape the request cards expect.
        const pending = Array.isArray(d.pendingRequests) ? d.pendingRequests : [];
        setRequests(pending.map(r => ({
          _id: r._id,
          fullName: r.name || 'Founder',
          role: r.area || '',
          company: r.company || '',
          message: r.message || '',
          avatar: (r.name || 'F').charAt(0).toUpperCase(),
        })));

        setMentees(Array.isArray(d.matchedRequests) ? d.matchedRequests : []);
        // Locked features start empty - no mock data shown.
        setSessions([]); setMessages([]); setResources([]); setReviews([]);

        const p = (profileRes.data && profileRes.data.fullName) ? profileRes.data : (d.profile || null);
        if (p) {
          setProfileData(prev => ({
            ...prev,
            ...p,
            linkedin: p.linkedinUrl || p.linkedin || prev.linkedin,
            expertise: Array.isArray(p.expertise) ? p.expertise : prev.expertise,
            availabilitySlots: Array.isArray(p.availabilitySlots) ? p.availabilitySlots : [],
          }));
        }
      } catch (err) {
        console.error('Failed to load mentor dashboard data from backend:', err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('auth_user');
    window.location.href = '/login';
  };

  // Actions
  // Request management is part of the locked "Requests" section (coming soon).
  const handleAcceptRequest = async () => {
    addToast('Accepting requests is coming soon.', 'warning');
  };

  const handleDeclineRequest = async () => {
    addToast('Managing requests is coming soon.', 'warning');
  };

  const handleSendMessage = async () => {
    if (!newMessageText.trim() || !activeChatId) return;
    const res = await apiPost('/api/v1/mentors/messages', { chatId: activeChatId, text: newMessageText });
    if (!res.error) {
      const messagesRes = await apiGet('/api/v1/mentors/messages');
      if (messagesRes.data) setMessages(messagesRes.data);
      setNewMessageText('');
      addToast('Message sent!');
    } else {
      addToast('Failed to send message', 'warning');
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    if (!newResource.title || !newResource.link) {
      addToast('Please fill all fields', 'warning');
      return;
    }
    const res = await apiPost('/api/v1/mentors/resources', newResource);
    if (!res.error) {
      const resourcesRes = await apiGet('/api/v1/mentors/resources');
      if (resourcesRes.data) setResources(resourcesRes.data);
      setNewResource({ title: '', category: 'Product Strategy', link: '' });
      addToast('Resource shared successfully!');
    } else {
      addToast('Failed to share resource', 'warning');
    }
  };

  const handleDeleteResource = async (id) => {
    const res = await apiDelete(`/api/v1/mentors/resources/${id}`);
    if (!res.error) {
      setResources(prev => prev.filter(r => (r._id || r.id) !== id));
      addToast('Resource deleted successfully.');
    } else {
      addToast('Failed to delete resource', 'warning');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const patchRes = await apiPatch('/api/v1/mentors/me/profile', {
      fullName: profileData.fullName,
      currentRole: profileData.currentRole,
      company: profileData.company,
      experience: profileData.experience,
      linkedinUrl: profileData.linkedin,
      bio: profileData.bio,
      expertise: profileData.expertise,
      availabilitySlots: profileData.availabilitySlots,
      location: profileData.location,
      phone: profileData.phone,
      achievements: profileData.achievements
    });
    if (!patchRes.error) {
      addToast('Profile changes saved successfully!');
    } else {
      addToast('Failed to save profile changes', 'warning');
    }
  };

  const handleAddExpertise = (tag) => {
    if (!tag.trim()) return;
    if (profileData.expertise.includes(tag)) return;
    setProfileData(prev => ({
      ...prev,
      expertise: [...prev.expertise, tag]
    }));
  };

  const handleRemoveExpertise = (tag) => {
    setProfileData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(e => e !== tag)
    }));
  };

  const handleRequestPayout = async () => {
    if (earningsBalance <= 0) {
      addToast('Balance is 0. No funds available to withdraw.', 'warning');
      return;
    }
    const res = await apiPost('/api/v1/mentors/earnings/payout', { amount: earningsBalance });
    if (!res.error) {
      const earningsRes = await apiGet('/api/v1/mentors/earnings');
      if (earningsRes.data) {
        setEarnings(earningsRes.data);
        setEarningsBalance(earningsRes.data.balance || 0);
      }
      setShowPayoutModal(false);
      addToast('Payout request sent successfully.');
    } else {
      addToast('Failed to request payout', 'warning');
    }
  };

  const handleSendTicket = async (e) => {
    e.preventDefault();
    if (!supportTicket.subject || !supportTicket.message) {
      addToast('Please fill all fields', 'warning');
      return;
    }
    const res = await apiPost('/api/v1/mentors/me/support', supportTicket);
    if (!res.error) {
      addToast('Support ticket raised successfully. We will get back to you soon.');
      setSupportTicket({ subject: '', category: 'General', message: '' });
    } else {
      addToast('Failed to raise support ticket', 'warning');
    }
  };

  const calculateProfileCompletion = () => {
    const fields = [
      profileData.fullName,
      profileData.email,
      profileData.currentRole,
      profileData.company,
      profileData.experience,
      profileData.location,
      profileData.linkedin,
      profileData.phone,
      profileData.bio,
      profileData.achievements,
      profileData.expertise?.length > 0 ? 'yes' : '',
      profileData.availabilitySlots?.length > 0 ? 'yes' : ''
    ];
    const filledFields = fields.filter(f => f && String(f).trim() !== '');
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const getSessionsForDate = (y, m, d) => {
    return sessions.filter(ses => {
      if (!ses.time) return false;
      const parts = ses.time.split('·');
      const datePart = parts[0].trim().toLowerCase();
      
      const today = new Date();
      if (datePart.includes('today')) {
        return y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
      }
      if (datePart.includes('yesterday')) {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return y === yesterday.getFullYear() && m === yesterday.getMonth() && d === yesterday.getDate();
      }
      
      try {
        const cleanDate = datePart.replace(/^[a-z]{3},\s*/, '');
        const parsedDate = new Date(cleanDate);
        if (!isNaN(parsedDate.getTime())) {
          return y === parsedDate.getFullYear() && m === parsedDate.getMonth() && d === parsedDate.getDate();
        }
      } catch (e) {
        // fallback
      }
      return false;
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'Poppins, Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #f1f5f9', borderTopColor: '#7A1F2B', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontWeight: '500' }}>Loading Dashboard...</p>
        </div>
        <style jsx global>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Count unread
  const unreadMsgCount = messages.filter(m => m.unread).length;
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div style={s.layoutContainer}>

      <style jsx global>{`
        /* Sidebar: keep it scrollable but hide the ugly native scrollbar */
        .ms-scroll::-webkit-scrollbar { width: 0; height: 0; }
        .ms-scroll { scrollbar-width: none; -ms-overflow-style: none; }

        /* Main content: slim, subtle scrollbar */
        .ms-content::-webkit-scrollbar { width: 8px; }
        .ms-content::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.14); border-radius: 10px; }
        .ms-content::-webkit-scrollbar-thumb:hover { background: rgba(15,23,42,0.26); }
        .ms-content::-webkit-scrollbar-track { background: transparent; }
        .ms-content { scrollbar-width: thin; scrollbar-color: rgba(15,23,42,0.16) transparent; }

        /* Header interactions */
        .ms-icon-btn { transition: all .18s ease; }
        .ms-icon-btn:hover { background: #f8fafc; border-color: #cbd5e1; transform: translateY(-1px); }
        .ms-user-chip { transition: all .18s ease; }
        .ms-user-chip:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .ms-logout { transition: all .18s ease; }
        .ms-logout:hover { background: #fef2f2; border-color: #fecaca; }
        .ms-search:focus-within { background: #fff; border-color: #C5975B; box-shadow: 0 0 0 3px rgba(197,151,91,0.12); }

        /* Keep the greeting + actions on one row (title shrinks instead of pushing
           the actions to a second line) until the mobile breakpoint. */
        .ms-title-block { flex: 1 1 240px; min-width: 0; }

        /* Responsive layout */
        @media (max-width: 1024px) {
          .ms-header { padding: 12px 20px !important; }
          .ms-grid-split { grid-template-columns: 1fr !important; }
          .ms-content { padding: 16px 18px !important; }
        }
        @media (max-width: 820px)  { .ms-header-right { gap: 8px !important; } .ms-search { flex-basis: 150px !important; } }
        @media (max-width: 640px)  {
          .ms-search { display: none !important; }
          .ms-user-text { display: none !important; }
          .ms-title { font-size: 18px !important; }
          .ms-header { padding: 10px 14px !important; }
          .ms-content { padding: 14px 14px !important; }
        }
      `}</style>

      {/* Toast notifications container */}
      <div style={s.toastContainer}>
        {toasts.map(t => (
          <div key={t.id} style={s.toast(t.type)}>
            {t.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* 1. Left Navigation Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.logoArea}>
          <img 
            src="/assets/images/logo-new.png" 
            alt="Startups India Logo" 
            style={{ height: '38px', objectFit: 'contain', display: 'block' }} 
          />
        </div>

        <nav className="ms-scroll" style={s.sidebarMenu}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
            { id: 'requests', label: 'Requests', icon: <UserCheck size={18} />, locked: true },
            { id: 'sessions', label: 'Sessions', icon: <Video size={18} />, locked: true },
            { id: 'calendar', label: 'Calendar', icon: <Calendar size={18} />, locked: true },
            { id: 'mentees', label: 'My Mentees', icon: <Users size={18} />, locked: true },
            { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} />, locked: true },
            { id: 'earnings', label: 'Earnings', icon: <DollarSign size={18} />, locked: true },
            { id: 'resources', label: 'Resources', icon: <BookOpen size={18} />, locked: true },
            { id: 'analytics', label: 'Reports & Analytics', icon: <BarChart3 size={18} />, locked: true },
            { id: 'help', label: 'Help & Support', icon: <HelpCircle size={18} /> }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => item.locked ? addToast('This section is coming soon.', 'warning') : setActiveTab(item.id)}
              style={{ ...s.sidebarBtn(activeTab === item.id), opacity: item.locked ? 0.5 : 1, cursor: item.locked ? 'not-allowed' : 'pointer' }}
              title={item.locked ? 'Coming soon' : undefined}
            >
              <div style={s.sidebarBtnLeft}>
                {item.icon}
                <span style={{ fontSize: '13.5px' }}>{item.label}</span>
              </div>
              {item.locked
                ? <Lock size={13} style={{ opacity: 0.7 }} />
                : (item.badge > 0 && <span style={s.badgeLabel(item.badgeColor || '#ef4444')}>{item.badge}</span>)}
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. Main Workspace Layout */}
      <div style={s.mainWorkspace}>
        
        {/* Workspace Top Header */}
        <header className="ms-header" style={s.workspaceHeader}>
          <div className="ms-title-block">
            <h1 className="ms-title" style={{ ...s.welcomeText, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {activeTab === 'dashboard' ? (
                <>
                  Welcome back, {profileData.fullName}! <Sparkles size={20} color="#eab308" />
                </>
              ) : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p style={s.welcomeSubText}>
              {activeTab === 'dashboard' ? 'Mentor Dashboard' : 'Manage your mentorship properties'}
            </p>
          </div>

          <div className="ms-header-right" style={s.headerRight}>
            <div className="ms-search" style={s.searchBar}>
              <Search size={16} color="#94a3b8" />
              <input type="text" placeholder="Search anything…" style={s.searchInput} />
              <span style={s.searchKbd}>⌘K</span>
            </div>

            <button onClick={() => setActiveTab('messages')} className="ms-icon-btn" style={s.iconButton} aria-label="Messages">
              <MessageSquare size={18} color="#64748b" />
              {unreadMsgCount > 0 && <span style={s.headerBadge} />}
            </button>

            <button onClick={() => setActiveTab('notifications')} className="ms-icon-btn" style={s.iconButton} aria-label="Notifications">
              <Bell size={18} color="#64748b" />
              {unreadNotifCount > 0 && <span style={s.headerBadge} />}
            </button>

            <div className="ms-user-chip" style={s.headerUser} onClick={() => setActiveTab('profile')}>
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt="Avatar"
                  style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={s.avatar(36)}>{profileData.fullName.split(' ').map(n=>n[0]).join('')}</div>
              )}
              <div className="ms-user-text" style={s.headerUserInfo}>
                <div style={s.headerName}>{profileData.fullName}</div>
                <div style={s.headerRole}>Mentor</div>
              </div>
              <ChevronDown size={14} color="#64748b" className="ms-user-text" />
            </div>

            <button onClick={handleLogout} className="ms-logout" style={s.logoutBtn} aria-label="Log out">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* 3. Dynamic Tabs Viewport */}
        <div className="ms-content" style={s.tabViewport}>
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Stat Row */}
              <div style={s.dashboardStatsRow}>
                <div style={s.statCard}>
                  <div style={s.statIconCircle('#fcf4f5')}>
                    <Users size={22} color="#7A1F2B" />
                  </div>
                  <div>
                    <div style={s.statValue}>{stats.totalMentees}</div>
                    <div style={s.statLabel}>Total Mentees</div>
                  </div>
                </div>

                <div style={s.statCard}>
                  <div style={s.statIconCircle('#ecfdf5')}>
                    <Calendar size={22} color="#059669" />
                  </div>
                  <div>
                    <div style={s.statValue}>{stats.upcomingSessionsCount}</div>
                    <div style={s.statLabel}>Upcoming Sessions</div>
                  </div>
                </div>

                <div onClick={() => setActiveTab('requests')} style={{ ...s.statCard, cursor: 'pointer' }}>
                  <div style={s.statIconCircle('#fff7ed')}>
                    <UserCheck size={22} color="#ea580c" />
                  </div>
                  <div>
                    <div style={s.statValue}>{requests.length}</div>
                    <div style={s.statLabel}>Pending Requests</div>
                    <span style={s.statLinkText}>View all requests →</span>
                  </div>
                </div>

                <div style={s.statCard}>
                  <div style={s.statIconCircle('#faf5ff')}>
                    <Video size={22} color="#7c3aed" />
                  </div>
                  <div>
                    <div style={s.statValue}>{stats.totalSessions || 0}</div>
                    <div style={s.statLabel}>Total Sessions</div>
                  </div>
                </div>
              </div>

              {/* Grid split */}
              <div className="ms-grid-split" style={s.gridSplit}>
                
                {/* Left Split widgets */}
                <div style={s.splitLeft}>
                  
                  {/* Widget: Upcoming Sessions */}
                  <div style={s.widgetCard}>
                    <div style={s.widgetHeader}>
                      <h3 style={s.widgetTitle}>Upcoming Sessions</h3>
                      <button onClick={() => setActiveTab('sessions')} style={s.widgetHeaderLink}>View Calendar</button>
                    </div>
                    <div style={s.listContainer}>
                      {sessions.filter(s=>s.status==='upcoming').slice(0, 4).map(item => (
                        <div key={item._id || item.id} style={s.listItem}>
                          <div style={s.listUserLeft}>
                            <div style={s.avatar(40, '#fcf4f5', '#7A1F2B')}>{item.avatar}</div>
                            <div>
                              <div style={s.listItemName}>{item.studentName}</div>
                              <div style={s.listItemSubtitle}>{item.topic}</div>
                            </div>
                          </div>
                          <div style={s.sessionMetaInfo}>
                            <div style={s.metaText}><Calendar size={12} /> {item.time.replace(/Mon, |Tue, |Wed, |Thu, /,'')}</div>
                            <div style={s.metaText}><Clock size={12} /> {item.duration}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setActiveTab('sessions')} style={s.widgetFooterBtn}>View All Sessions →</button>
                  </div>

                  {/* Widget: Mentorship Requests */}
                  <div style={s.widgetCard}>
                    <div style={s.widgetHeader}>
                      <h3 style={s.widgetTitle}>Mentorship Requests</h3>
                      <button onClick={() => setActiveTab('requests')} style={s.widgetHeaderLink}>View All</button>
                    </div>
                    <div style={s.listContainer}>
                      {requests.slice(0, 3).map(req => (
                        <div key={req._id || req.id} style={s.listItem}>
                          <div style={s.listUserLeft}>
                            <div style={s.avatar(40, '#fef2f2', '#ef4444')}>{req.avatar}</div>
                            <div>
                              <div style={s.listItemName}>{req.fullName}</div>
                              <div style={s.listItemSubtitle}>{req.role} · <span style={{fontWeight:'500'}}>{req.company}</span></div>
                              <p style={s.listItemSnippet}>"{req.message}"</p>
                            </div>
                          </div>
                          <div style={s.actionBtnGroup}>
                            <button onClick={() => handleDeclineRequest(req._id || req.id)} style={s.iconActionBtn('#fee2e2', '#ef4444')}><X size={14} /></button>
                            <button onClick={() => handleAcceptRequest(req._id || req.id)} style={s.iconActionBtn('#dcfce7', '#22c55e')}><Check size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setActiveTab('requests')} style={s.widgetFooterBtn}>View All Requests →</button>
                  </div>

                  {/* Widget: Recent Messages */}
                  <div style={s.widgetCard}>
                    <div style={s.widgetHeader}>
                      <h3 style={s.widgetTitle}>Recent Messages</h3>
                      <button onClick={() => setActiveTab('messages')} style={s.widgetHeaderLink}>View All</button>
                    </div>
                    <div style={s.listContainer}>
                      {messages.slice(0, 4).map(msg => (
                        <div key={msg._id || msg.id} onClick={() => { setActiveChatId(msg._id || msg.id); setActiveTab('messages'); }} style={{ ...s.listItem, cursor: 'pointer' }}>
                          <div style={s.listUserLeft}>
                            <div style={s.avatar(40, '#f0fdf4', '#15803d')}>{msg.avatar}</div>
                            <div>
                              <div style={s.listItemName}>{msg.sender}</div>
                              <div style={msg.unread ? s.listItemSnippetUnread : s.listItemSnippet}>
                                {msg.text}
                              </div>
                            </div>
                          </div>
                          <div style={s.messageMetaRight}>
                            <span style={s.metaTextTime}>{msg.time}</span>
                            {msg.unread && <span style={s.unreadDot} />}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setActiveTab('messages')} style={s.widgetFooterBtn}>Go to Messages →</button>
                  </div>

                </div>

                {/* Right Split widgets */}
                <div style={s.splitRight}>
                  
                  {/* Widget: Profile Summary */}
                  <div style={s.widgetCard}>
                    <div style={s.widgetHeader}>
                      <h3 style={s.widgetTitle}>My Profile Summary</h3>
                      <button onClick={() => setActiveTab('profile')} style={s.profileHeaderLink}>View Profile</button>
                    </div>
                    
                    <div style={s.profileSummaryTop}>
                      <div style={s.profileAvatarLarge}>{profileData.fullName.split(' ').map(n=>n[0]).join('')}</div>
                      <div style={s.profileHeaderDetails}>
                        <div style={s.profileHeaderName}>
                          {profileData.fullName}
                          <Award size={16} color="#C5975B" style={{ marginLeft: '4px' }} />
                        </div>
                        <div style={s.profileHeaderTitle}>{profileData.currentRole}</div>
                        <div style={s.profileHeaderCompany}>{profileData.company}</div>
                      </div>
                    </div>

                    <div style={s.profileMetaList}>
                      <div style={s.profileMetaItem}>
                        <Briefcase size={16} color="#94a3b8" />
                        <span>{profileData.experience} Experience</span>
                      </div>
                      <div style={s.profileMetaItem}>
                        <MapPin size={16} color="#94a3b8" />
                        <span>{profileData.location}</span>
                      </div>
                      <div style={s.profileMetaItem}>
                        <Calendar size={16} color="#94a3b8" />
                        <span>Mentor since Jan 2024</span>
                      </div>
                    </div>

                    <div style={s.profileExpertiseSec}>
                      <div style={s.profileExpertiseTitle}>Areas of Expertise</div>
                      <div style={s.expertiseChipGroup}>
                        {profileData.expertise.slice(0, 5).map((e, i) => (
                          <span key={i} style={s.expertiseBadge}>{e}</span>
                        ))}
                        {profileData.expertise.length > 5 && (
                          <span style={s.expertiseBadgeMore}>+{profileData.expertise.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Widget: Availability This Week */}
                  <div style={s.widgetCard}>
                    <div style={s.widgetHeader}>
                      <h3 style={s.widgetTitle}>Availability This Week</h3>
                      <button onClick={() => setActiveTab('calendar')} style={s.profileHeaderLink}>Edit Availability</button>
                    </div>
                    <div style={s.listContainer}>
                      {profileData.availabilitySlots.map((slot, i) => (
                        <div key={i} style={s.availRow}>
                          <div style={s.availDay}>{slot.day}</div>
                          <div style={s.availTime}>
                            {slot.time}
                            <span style={s.availActiveDot} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setActiveTab('calendar')} style={s.widgetFooterBtn}>Manage Calendar →</button>
                  </div>

                  {/* Widget: Quick Actions */}
                  <div style={s.widgetCard}>
                    <h3 style={s.widgetTitle}>Quick Actions</h3>
                    <div style={s.quickActionsGrid}>
                      <button onClick={() => setActiveTab('calendar')} style={s.quickActionBtn}>
                        <div style={s.quickActionIconBg('#fcf4f5')}><Plus size={18} color="#7A1F2B" /></div>
                        <span>Add Availability</span>
                      </button>
                      <button onClick={() => setActiveTab('resources')} style={s.quickActionBtn}>
                        <div style={s.quickActionIconBg('#ecfdf5')}><BookOpen size={18} color="#059669" /></div>
                        <span>Create Resource</span>
                      </button>
                      <button onClick={() => { setActiveTab('messages'); addToast('Invite links can be generated and sent inside chats!'); }} style={s.quickActionBtn}>
                        <div style={s.quickActionIconBg('#faf5ff')}><Users size={18} color="#7c3aed" /></div>
                        <span>Invite Mentee</span>
                      </button>
                      <button onClick={() => setActiveTab('analytics')} style={s.quickActionBtn}>
                        <div style={s.quickActionIconBg('#fff7ed')}><BarChart3 size={18} color="#ea580c" /></div>
                        <span>View Reports</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB: MY PROFILE */}
          {activeTab === 'profile' && (
            <div style={s.tabContentCard}>
              <div style={s.tabCardHeader}>
                <h2>Edit Mentorship Profile</h2>
                <p>Manage your campus public information, bios, expertise areas, and contact links.</p>
              </div>

              {(() => {
                const profilePct = calculateProfileCompletion();
                return (
                  <div style={{
                    background: '#090e1a',
                    border: '1.5px solid #1e293b',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>Profile Completion Status</span>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: profilePct === 100 ? '#10b981' : '#C5975B' }}>{profilePct}% Complete</span>
                      </div>
                      <div style={{ height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${profilePct}%`, background: profilePct === 100 ? '#10b981' : 'linear-gradient(90deg, #C5975B, #dfb782)', borderRadius: '4px', transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                    {profilePct === 100 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#047857', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                        <Check size={14} /> Profile Complete
                      </div>
                    ) : (
                      <div style={{ color: '#94a3b8', fontSize: '12.5px', maxWidth: '220px', textAlign: 'right' }}>
                        Fill out all fields to reach 100% completion.
                      </div>
                    )}
                  </div>
                );
              })()}

              <form onSubmit={handleSaveProfile} style={s.profileForm}>
                <div style={s.formGrid}>
                  <div style={s.formGroup}>
                    <label style={s.formLabel}>Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.fullName} 
                      onChange={e => setProfileData({...profileData, fullName: e.target.value})} 
                      style={s.formInput} 
                      required
                    />
                  </div>

                  <div style={s.formGroup}>
                    <label style={s.formLabel}>Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email} 
                      onChange={e => setProfileData({...profileData, email: e.target.value})} 
                      style={s.formInput} 
                      required
                    />
                  </div>

                  <div style={s.formGroup}>
                    <label style={s.formLabel}>Current Title/Role</label>
                    <input 
                      type="text" 
                      value={profileData.currentRole} 
                      onChange={e => setProfileData({...profileData, currentRole: e.target.value})} 
                      style={s.formInput} 
                      required
                    />
                  </div>

                  <div style={s.formGroup}>
                    <label style={s.formLabel}>Company/Organization</label>
                    <input 
                      type="text" 
                      value={profileData.company} 
                      onChange={e => setProfileData({...profileData, company: e.target.value})} 
                      style={s.formInput} 
                      required
                    />
                  </div>

                  <div style={s.formGroup}>
                    <label style={s.formLabel}>Years of Experience</label>
                    <input 
                      type="text" 
                      value={profileData.experience} 
                      onChange={e => setProfileData({...profileData, experience: e.target.value})} 
                      style={s.formInput}
                    />
                  </div>

                  <div style={s.formGroup}>
                    <label style={s.formLabel}>Location</label>
                    <input 
                      type="text" 
                      value={profileData.location} 
                      onChange={e => setProfileData({...profileData, location: e.target.value})} 
                      style={s.formInput}
                    />
                  </div>

                  <div style={s.formGroup}>
                    <label style={s.formLabel}>LinkedIn Profile URL</label>
                    <input 
                      type="text" 
                      value={profileData.linkedin} 
                      onChange={e => setProfileData({...profileData, linkedin: e.target.value})} 
                      style={s.formInput}
                    />
                  </div>

                  <div style={s.formGroup}>
                    <label style={s.formLabel}>Mobile Number</label>
                    <input 
                      type="text" 
                      value={profileData.phone} 
                      onChange={e => setProfileData({...profileData, phone: e.target.value})} 
                      style={s.formInput}
                    />
                  </div>

                  <div style={s.formGroup}>
                    <label style={s.formLabel}>Achievements & Accolades</label>
                    <input 
                      type="text" 
                      value={profileData.achievements || ''} 
                      onChange={e => setProfileData({...profileData, achievements: e.target.value})} 
                      placeholder="e.g. Helped 15+ startups secure Seed funding"
                      style={s.formInput} 
                    />
                  </div>
                </div>

                <div style={{...s.formGroup, marginTop: '20px'}}>
                  <label style={s.formLabel}>Short Bio</label>
                  <textarea 
                    value={profileData.bio} 
                    onChange={e => setProfileData({...profileData, bio: e.target.value})} 
                    style={s.formTextarea} 
                    rows={4}
                  />
                </div>

                {/* Expertise Tag Editor */}
                <div style={{...s.formGroup, marginTop: '24px'}}>
                  <label style={s.formLabel}>Areas of Expertise (Chips)</label>
                  <div style={s.tagEditorContainer}>
                    <div style={s.tagCloud}>
                      {profileData.expertise.map((tag, i) => (
                        <span key={i} style={s.tagCloudChip}>
                          {tag}
                          <button type="button" onClick={() => handleRemoveExpertise(tag)} style={s.tagCloudChipDel}>×</button>
                        </span>
                      ))}
                    </div>
                    <div style={s.tagAdder}>
                      <input 
                        type="text" 
                        placeholder="Add expertise (e.g. B2B Sales)" 
                        id="newExpertiseInput" 
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddExpertise(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        style={s.formInputTag}
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          const el = document.getElementById('newExpertiseInput');
                          if (el) {
                            handleAddExpertise(el.value);
                            el.value = '';
                          }
                        }}
                        style={s.tagAdderBtn}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div style={s.formActions}>
                  <button type="submit" style={s.saveProfileBtn}>Save Changes</button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: REQUESTS */}
          {activeTab === 'requests' && (
            <div style={s.tabContentCard}>
              <div style={s.tabCardHeader}>
                <h2>Mentorship Applications</h2>
                <p>Accept or decline requests from campus startups seeking 1-on-1 guidance slots.</p>
              </div>

              <div style={s.requestsLayoutList}>
                {requests.length === 0 ? (
                  <div style={s.emptyState}>
                    <UserCheck size={48} color="#94a3b8" />
                    <h3>All Requests Processed!</h3>
                    <p>You have no pending mentorship requests. Check back later.</p>
                  </div>
                ) : (
                  requests.map(req => (
                    <div key={req._id || req.id} style={s.requestDetailCard}>
                      <div style={s.reqCardHeader}>
                        <div style={s.reqCardHeaderLeft}>
                          <div style={s.avatar(48, '#fcf4f5', '#7A1F2B')}>{req.avatar}</div>
                          <div>
                            <div style={s.reqName}>{req.fullName}</div>
                            <div style={s.reqTitle}>{req.role} · <span style={{fontWeight:'600'}}>{req.company}</span></div>
                          </div>
                        </div>
                        <div style={s.reqMetaRight}>
                          <span style={s.reqBadge(req.status)}>{req.status.toUpperCase()}</span>
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>{req.time}</span>
                        </div>
                      </div>

                      <div style={s.reqCardBody}>
                        <h4>Introduction & Goals:</h4>
                        <p style={s.reqMessage}>"{req.message}"</p>
                        
                        <div style={s.reqFooterDetails}>
                          <div style={s.reqDetailItem}><Mail size={13} /> {req.email}</div>
                          <div style={s.reqDetailItem}><Linkedin size={13} /> linkedin.com/in/{req.fullName.toLowerCase().replace(' ', '')}</div>
                        </div>
                      </div>

                      <div style={s.reqCardActions}>
                        <button onClick={() => handleDeclineRequest(req._id || req.id)} style={s.declineBtn}>Decline Application</button>
                        <button onClick={() => handleAcceptRequest(req._id || req.id)} style={s.approveBtn}>Approve & Schedule</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: SESSIONS */}
          {activeTab === 'sessions' && (
            <div style={s.tabContentCard}>
              <div style={s.tabCardHeader}>
                <h2>Mentorship Sessions / Meetings</h2>
                <p>Track your scheduled, completed, and rescheduled calls with student founders.</p>
              </div>

              <div style={s.sessionsTableArea}>
                <div style={s.tableToolbar}>
                  <h3>Schedule List ({sessions.length})</h3>
                  <button onClick={() => setShowScheduleModal(true)} style={s.createBtn}>
                    <Plus size={16} /> Schedule Call
                  </button>
                </div>

                <table style={s.dashboardTable}>
                  <thead>
                    <tr>
                      <th style={s.tableTh}>Founder</th>
                      <th style={s.tableTh}>Topic</th>
                      <th style={s.tableTh}>Date & Time</th>
                      <th style={s.tableTh}>Duration</th>
                      <th style={s.tableTh}>Status</th>
                      <th style={s.tableTh}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map(ses => (
                      <tr key={ses._id || ses.id} style={s.tableTr}>
                        <td style={s.tableTd}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={s.avatar(32, '#fcf4f5', '#7A1F2B')}>{ses.avatar}</div>
                            <span style={{ fontWeight: '600', color: '#0f172a' }}>{ses.studentName}</span>
                          </div>
                        </td>
                        <td style={s.tableTd}>{ses.topic}</td>
                        <td style={s.tableTd}>{ses.time}</td>
                        <td style={s.tableTd}>{ses.duration}</td>
                        <td style={s.tableTd}>
                          <span style={s.sessionStatusBadge(ses.status)}>{ses.status}</span>
                        </td>
                        <td style={s.tableTd}>
                          {ses.status === 'upcoming' ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <a href={ses.meetLink || '#'} target="_blank" rel="noopener noreferrer" style={s.joinMeetBtn}>Join Call</a>
                              <button onClick={async () => {
                                const res = await apiPatch(`/api/v1/mentors/sessions/${ses._id || ses.id}`, { status: 'completed' });
                                if (!res.error) {
                                  setSessions(prev => prev.map(s => (s._id || s.id) === (ses._id || ses.id) ? { ...s, status: 'completed' } : s));
                                  addToast('Marked session as completed!');
                                } else {
                                  addToast('Failed to complete session', 'warning');
                                }
                              }} style={s.completeActionBtn}>Complete</button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '12.5px', color: '#94a3b8', fontStyle: 'italic' }}>
                              {ses.rating > 0 ? `Rating: ${ses.rating}⭐` : 'No reviews'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CALENDAR */}
          {activeTab === 'calendar' && (
            <div style={s.tabContentCard}>
              <div style={s.tabCardHeader}>
                <h2>Availability Calendar</h2>
                <p>Configure recurring weekly slots for student booking. Unchecked days are unavailable.</p>
              </div>

              <div style={s.calendarGridSplit}>
                <div style={s.calendarLeft}>
                  <h3>Weekly Slots</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                    {profileData.availabilitySlots.map((slot, i) => (
                      <div key={i} style={s.calSlotEditor}>
                        <div style={s.calSlotLeft}>
                          <input 
                            type="checkbox" 
                            checked={slot.enabled} 
                            onChange={(e) => {
                              const updated = [...profileData.availabilitySlots];
                              updated[i].enabled = e.target.checked;
                              setProfileData({ ...profileData, availabilitySlots: updated });
                              addToast(`Availability for ${slot.day} ${e.target.checked ? 'enabled' : 'disabled'}`);
                            }}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <span style={{ fontWeight: '600', color: '#334155' }}>{slot.day}</span>
                        </div>
                        
                        <input 
                          type="text" 
                          value={slot.time}
                          disabled={!slot.enabled}
                          onChange={(e) => {
                            const updated = [...profileData.availabilitySlots];
                            updated[i].time = e.target.value;
                            setProfileData({ ...profileData, availabilitySlots: updated });
                          }}
                          style={s.slotTimeInput}
                        />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => addToast('Weekly schedule updated!')} style={{ ...s.saveProfileBtn, marginTop: '20px' }}>
                    Save Schedule
                  </button>
                </div>

                <div style={s.calendarRight}>
                  <h3>Availability Calendar</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Visual check for mentorship activities and booking schedule.</p>
                  
                  <div style={s.calMockMonth}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <button 
                        type="button"
                        onClick={() => {
                          if (currentCalMonth === 0) {
                            setCurrentCalMonth(11);
                            setCurrentCalYear(prev => prev - 1);
                          } else {
                            setCurrentCalMonth(prev => prev - 1);
                          }
                        }}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#f8fafc', padding: '4px' }}
                      >
                        <ChevronRight size={18} style={{ transform: 'rotate(180deg)', color: '#94a3b8' }} />
                      </button>
                      <div style={{ fontWeight: '800', fontSize: '15px', color: '#0f172a' }}>
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][currentCalMonth]} {currentCalYear}
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          if (currentCalMonth === 11) {
                            setCurrentCalMonth(0);
                            setCurrentCalYear(prev => prev + 1);
                          } else {
                            setCurrentCalMonth(prev => prev + 1);
                          }
                        }}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#f8fafc', padding: '4px' }}
                      >
                        <ChevronRight size={18} style={{ color: '#94a3b8' }} />
                      </button>
                    </div>

                    <div style={s.calMockDaysHeader}>
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} style={s.calMockDayLabel}>{d}</span>)}
                    </div>

                    <div style={s.calMockGrid}>
                      {/* Empty padding slots */}
                      {Array.from({ length: new Date(currentCalYear, currentCalMonth, 1).getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      
                      {/* Active month days */}
                      {Array.from({ length: new Date(currentCalYear, currentCalMonth + 1, 0).getDate() }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const daySessions = getSessionsForDate(currentCalYear, currentCalMonth, dayNum);
                        const isSelected = selectedCalDay === dayNum;
                        const hasSessions = daySessions.length > 0;
                        const upcomingSessions = daySessions.filter(s => s.status === 'upcoming');
                        const completedSessions = daySessions.filter(s => s.status === 'completed');
                        
                        return (
                          <div 
                            key={idx}
                            onClick={() => setSelectedCalDay(dayNum)}
                            style={{
                              padding: '10px 4px',
                              textAlign: 'center',
                              borderRadius: '8px',
                              fontSize: '12.5px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              position: 'relative',
                              background: isSelected ? '#7A1F2B' : (hasSessions ? '#fcf4f5' : '#fff'),
                              color: isSelected ? '#fff' : (hasSessions ? '#7A1F2B' : '#334155'),
                              border: isSelected ? '1px solid #7A1F2B' : (hasSessions ? '1px solid #f5dcc1' : '1px solid #f1f5f9'),
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {dayNum}
                            {/* Session status dots */}
                            {hasSessions && !isSelected && (
                              <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', position: 'absolute', bottom: '3px', left: 0, right: 0 }}>
                                {upcomingSessions.length > 0 && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#C5975B' }} />}
                                {completedSessions.length > 0 && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10b981' }} />}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
                      Agenda for {selectedCalDay} {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][currentCalMonth]} {currentCalYear}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {(() => {
                        const daySessions = getSessionsForDate(currentCalYear, currentCalMonth, selectedCalDay);
                        if (daySessions.length === 0) {
                          return (
                            <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>
                              No mentorship sessions scheduled on this date.
                            </p>
                          );
                        }
                        return daySessions.map(ses => (
                          <div key={ses._id || ses.id} style={{
                            padding: '12px',
                            background: '#090e1a',
                            border: '1.5px solid #1e293b',
                            borderLeft: `4px solid ${ses.status === 'completed' ? '#10b981' : '#C5975B'}`,
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div>
                              <div style={{ fontWeight: '700', fontSize: '13px', color: '#f8fafc' }}>{ses.studentName}</div>
                              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{ses.topic} · {ses.duration}</div>
                            </div>
                            <div>
                              <span style={s.sessionStatusBadge(ses.status)}>{ses.status}</span>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MY MENTEES */}
          {activeTab === 'mentees' && (
            <div style={s.tabContentCard}>
              <div style={s.tabCardHeader}>
                <h2>Active Mentees Directory</h2>
                <p>View startup profiles, progress stages, and meeting logs for your assigned campus mentees.</p>
              </div>

              <div style={s.menteesGrid}>
                {mentees.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', marginTop: '10px' }}>No active mentees assigned.</p>
                ) : (
                  mentees.map((mentee, i) => (
                    <div key={i} style={s.menteeCard}>
                      <div style={s.menteeCardHeader}>
                        <div style={s.avatar(44, '#fcf4f5', '#7A1F2B')}>{mentee.name.split(' ').map(n=>n[0]).join('')}</div>
                        <div>
                          <div style={s.menteeName}>{mentee.name}</div>
                          <div style={s.menteeCompany}>{mentee.company} · <span style={{color: '#C5975B'}}>{mentee.sector}</span></div>
                        </div>
                      </div>

                      <div style={s.menteeCardBody}>
                        <p style={s.menteeBio}>{mentee.bio}</p>
                        
                        <div style={s.progressContainer}>
                          <div style={s.progressLabelRow}>
                            <span>Milestone Progress</span>
                            <span>{mentee.progress}%</span>
                          </div>
                          <div style={s.progressBarBg}>
                            <div style={s.progressBarFill(mentee.progress)} />
                          </div>
                        </div>

                        <div style={s.menteeStatsList}>
                          <div style={s.menteeStatItem}>
                            <strong>Stage:</strong> <span>{mentee.stage}</span>
                          </div>
                          <div style={s.menteeStatItem}>
                            <strong>Last Met:</strong> <span>{mentee.lastMet}</span>
                          </div>
                          <div style={s.menteeStatItem}>
                            <strong>Email:</strong> <span style={{fontSize:'12px'}}>{mentee.email}</span>
                          </div>
                        </div>
                      </div>

                      <div style={s.menteeCardActions}>
                        <button onClick={() => {
                          const foundChat = messages.find(m => m.sender === mentee.name);
                          if (foundChat) {
                            setActiveChatId(foundChat._id || foundChat.id);
                          }
                          setActiveTab('messages');
                        }} style={s.menteeActionBtn}>Send Message</button>
                        <button onClick={() => addToast(`Logs opened for ${mentee.name}`)} style={s.menteeActionBtnSec}>View Logs</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div style={s.chatWorkspace}>
              {/* Chat Sidebar */}
              <div style={s.chatSidebar}>
                <div style={s.chatSidebarHeader}>
                  <h3>Conversations</h3>
                </div>
                <div style={s.chatList}>
                  {messages.map(chat => {
                    const chatId = chat._id || chat.id;
                    return (
                      <div 
                        key={chatId} 
                        onClick={() => {
                          setActiveChatId(chatId);
                          setMessages(prev => prev.map(m => (m._id || m.id) === chatId ? { ...m, unread: false } : m));
                        }}
                        style={s.chatListItem(chatId === activeChatId)}
                      >
                        <div style={s.avatar(40, '#fcf4f5', '#7A1F2B')}>{chat.avatar}</div>
                        <div style={s.chatListInfo}>
                          <div style={s.chatListNameRow}>
                            <span style={s.chatListName}>{chat.sender}</span>
                            <span style={s.chatListTime}>{chat.time}</span>
                          </div>
                          <p style={chat.unread ? s.chatListTextUnread : s.chatListText}>{chat.text}</p>
                        </div>
                        {chat.unread && <span style={s.chatUnreadIndicator} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chat Main View */}
              <div style={s.chatMainView}>
                {(() => {
                  const activeChat = messages.find(m => (m._id || m.id) === activeChatId);
                  if (!activeChat) return <div style={s.emptyChat}>Select a chat to begin messaging</div>;
                  return (
                    <>
                      <div style={s.chatHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={s.avatar(40, '#fcf4f5', '#7A1F2B')}>{activeChat.avatar}</div>
                          <div>
                            <div style={s.chatHeaderName}>{activeChat.sender}</div>
                            <div style={s.chatHeaderStatus}>Online · Campus Mentee</div>
                          </div>
                        </div>
                        <button onClick={() => addToast('Call scheduled in chat!')} style={s.chatHeaderCallBtn}>Schedule Call</button>
                      </div>

                      <div style={s.chatBody}>
                        {activeChat.chatHistory.map((item, idx) => (
                          <div key={idx} style={item.sender === 'me' ? s.chatBubbleRowMe : s.chatBubbleRowOther}>
                            <div style={item.sender === 'me' ? s.chatBubbleMe : s.chatBubbleOther}>
                              <div>{item.text}</div>
                              <div style={s.chatBubbleTime}>{item.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={s.chatInputBar}>
                        <input 
                          type="text" 
                          placeholder={`Reply to ${activeChat.sender}...`}
                          value={newMessageText}
                          onChange={e => setNewMessageText(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                          style={s.chatInputField}
                        />
                        <button onClick={handleSendMessage} style={s.chatSendBtn}>
                          <Send size={16} />
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB: REVIEWS & RATINGS */}
          {activeTab === 'reviews' && (
            <div style={s.tabContentCard}>
              <div style={s.tabCardHeader}>
                <h2>Reviews & Evaluations</h2>
                <p>Review quality reports submitted by campus founders after call completions.</p>
              </div>

              <div style={s.reviewsSummaryRow}>
                <div style={s.reviewsRatingCard}>
                  <div style={s.ratingCardScore}>{analytics.averageRating}</div>
                  <div style={{ display: 'flex', gap: '4px', margin: '8px 0' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={18} fill={i < Math.round(analytics.averageRating) ? '#eab308' : 'none'} color="#eab308" />
                    ))}
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>Average rating based on {reviews.length} feedback logs.</p>
                </div>

                <div style={s.reviewsStatsBreakdown}>
                  {[
                    { stars: 5, pct: reviews.length ? Math.round((reviews.filter(r => r.rating === 5).length / reviews.length) * 100) : 85 },
                    { stars: 4, pct: reviews.length ? Math.round((reviews.filter(r => r.rating === 4).length / reviews.length) * 100) : 10 },
                    { stars: 3, pct: reviews.length ? Math.round((reviews.filter(r => r.rating === 3).length / reviews.length) * 100) : 5 },
                    { stars: 2, pct: reviews.length ? Math.round((reviews.filter(r => r.rating === 2).length / reviews.length) * 100) : 0 },
                    { stars: 1, pct: reviews.length ? Math.round((reviews.filter(r => r.rating === 1).length / reviews.length) * 100) : 0 }
                  ].map((row, i) => (
                    <div key={i} style={s.reviewBreakdownRow}>
                      <span style={s.breakdownLabel}>{row.stars} Star</span>
                      <div style={s.breakdownBarBg}>
                        <div style={s.breakdownBarFill(row.pct)} />
                      </div>
                      <span style={s.breakdownValue}>{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '30px' }}>
                <h3>Written Founder Feedback</h3>
                <div style={s.feedbackList}>
                  {reviews.length === 0 ? (
                    <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', marginTop: '10px' }}>No written feedback received yet.</p>
                  ) : (
                    reviews.map((rev, i) => (
                      <div key={rev._id || i} style={s.feedbackItemCard}>
                        <div style={s.feedbackCardHeader}>
                          <div>
                            <div style={s.feedbackFounderName}>{rev.studentName}</div>
                            <div style={s.feedbackStartup}>Startup Founder</div>
                          </div>
                          <div style={s.feedbackMeta}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {Array.from({ length: rev.rating }).map((_, idx) => <Star key={idx} size={12} fill="#eab308" color="#eab308" />)}
                            </div>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{rev.date}</span>
                          </div>
                        </div>
                        <p style={s.feedbackBody}>"{rev.feedback}"</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: EARNINGS */}
          {activeTab === 'earnings' && (
            <div style={s.tabContentCard}>
              <div style={s.tabCardHeader}>
                <h2>Earnings & Payout Ledger</h2>
                <p>Track your paid consultations, withdraw balances, and request direct bank deposits.</p>
              </div>

              <div style={s.earningsHeaderRow}>
                <div style={s.earningsMetricBox}>
                  <div style={s.metricLabel}>Withdrawable Balance</div>
                  <div style={s.metricValue}>₹{earningsBalance.toLocaleString()}</div>
                  <button onClick={() => setShowPayoutModal(true)} style={s.payoutWithdrawBtn}>Request Payout</button>
                </div>

                <div style={s.earningsMetricBox}>
                  <div style={s.metricLabel}>Total Earned to Date</div>
                  <div style={s.metricValue}>₹{earnings.totalEarned?.toLocaleString() || '48,750'}</div>
                  <span style={s.metricSub}>{sessions.filter(s => s.status === 'completed').length} sessions completed</span>
                </div>
              </div>

              {/* Show payout request modal in place */}
              {showPayoutModal && (
                <div style={s.modalOverlay}>
                  <div style={s.modalContent}>
                    <h3>Confirm Payout Withdrawal</h3>
                    <p style={{ fontSize: '13.5px', color: '#64748b', margin: '12px 0 20px' }}>
                      Withdraw <strong>₹{earningsBalance.toLocaleString()}</strong> to your registered bank account? Transfer takes 2-3 business days.
                    </p>
                    <div style={s.modalBtnRow}>
                      <button onClick={() => setShowPayoutModal(false)} style={s.modalCancelBtn}>Cancel</button>
                      <button onClick={handleRequestPayout} style={s.modalApproveBtn}>Yes, Initiate Transfer</button>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '30px' }}>
                <h3>Consultation Billing Ledger</h3>
                <table style={{ ...s.dashboardTable, marginTop: '16px' }}>
                  <thead>
                    <tr>
                      <th style={s.tableTh}>Invoice Date</th>
                      <th style={s.tableTh}>Mentees Startup</th>
                      <th style={s.tableTh}>Session Topic</th>
                      <th style={s.tableTh}>Guided Hours</th>
                      <th style={s.tableTh}>Amount</th>
                      <th style={s.tableTh}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.payouts && earnings.payouts.length > 0 ? (
                      earnings.payouts.map((tx, idx) => (
                        <tr key={tx._id || idx} style={s.tableTr}>
                          <td style={s.tableTd}>{tx.date || 'Today'}</td>
                          <td style={s.tableTd}>System Transfer</td>
                          <td style={s.tableTd}>Payout Withdrawal</td>
                          <td style={s.tableTd}>-</td>
                          <td style={s.tableTd}>₹{tx.amount.toLocaleString()}</td>
                          <td style={s.tableTd}><span style={s.badge(tx.status === 'completed' ? 'approved' : 'pending')}>{tx.status === 'completed' ? 'Paid' : 'Pending'}</span></td>
                        </tr>
                      ))
                    ) : (
                      <tr style={s.tableTr}>
                        <td colSpan={6} style={{ ...s.tableTd, textAlign: 'center', color: '#94a3b8' }}>No payout transactions record found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: RESOURCES */}
          {activeTab === 'resources' && (
            <div style={s.tabContentCard}>
              <div style={s.tabCardHeader}>
                <h2>Mentor Resources & Documents</h2>
                <p>Upload helpful guidelines, deck templates, and cheat sheets to share with your campus startups.</p>
              </div>

              <div style={s.resourcesSplit}>
                {/* Upload resource */}
                <div style={s.resourcesLeft}>
                  <h3>Create New Shared File</h3>
                  <form onSubmit={handleCreateResource} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                    <div style={s.formGroup}>
                      <label style={s.formLabel}>Resource Title</label>
                      <input 
                        type="text" 
                        value={newResource.title} 
                        onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                        placeholder="e.g. Sales Pitch Guidelines" 
                        style={s.formInput} 
                        required 
                      />
                    </div>
                    
                    <div style={s.formGroup}>
                      <label style={s.formLabel}>Category</label>
                      <select 
                        value={newResource.category} 
                        onChange={e => setNewResource({ ...newResource, category: e.target.value })}
                        style={s.formInput}
                      >
                        {['Product Strategy', 'Fundraising', 'Growth Strategy', 'Legal & Compliance'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div style={s.formGroup}>
                      <label style={s.formLabel}>Google Drive / Document Link</label>
                      <input 
                        type="url" 
                        value={newResource.link} 
                        onChange={e => setNewResource({ ...newResource, link: e.target.value })}
                        placeholder="https://docs.google.com/document/..." 
                        style={s.formInput} 
                        required 
                      />
                    </div>

                    <button type="submit" style={s.saveProfileBtn}>Share Resource</button>
                  </form>
                </div>

                {/* Shared Resources List */}
                <div style={s.resourcesRight}>
                  <h3>Active Shared Resources ({resources.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                    {resources.map(res => (
                      <div key={res._id || res.id} style={s.resourceItemCard}>
                        <div style={s.resItemLeft}>
                          <FileText size={24} color="#C5975B" />
                          <div>
                            <div style={s.resItemTitle}>{res.title}</div>
                            <div style={s.resItemMeta}>{res.category} · Shared {res.date}</div>
                          </div>
                        </div>
                        <div style={s.resItemActions}>
                          <a href={res.link} target="_blank" rel="noopener noreferrer" style={s.resActionBtn} title="Open Document"><Share2 size={14} /></a>
                          <button onClick={() => handleDeleteResource(res._id || res.id)} style={s.resActionBtnDel} title="Delete"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REPORTS & ANALYTICS */}
          {activeTab === 'analytics' && (
            <div style={s.tabContentCard}>
              <div style={s.tabCardHeader}>
                <h2>Reports & Analytics Dashboard</h2>
                <p>Visual reports tracking your impact metrics, sessions guided, and star breakdown history.</p>
              </div>

              <div style={s.analyticsGrid}>
                {/* Metric Box */}
                <div style={s.analyticsGraphCard}>
                  <h3>Monthly Active Hours Guided</h3>
                  <div style={s.mockGraphContainer}>
                    <div style={s.graphBars}>
                      {[3, 6, 8, 12, 10, 15].map((val, idx) => (
                        <div key={idx} style={s.graphBarCol}>
                          <div style={s.graphBar(val * 6)} />
                          <span style={s.graphBarLabel}>{['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][idx]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p style={s.graphDesc}>Guided hours increased by 15% this month compared to April.</p>
                </div>

                {/* Focus Areas Analysis */}
                <div style={s.analyticsGraphCard}>
                  <h3>Expertise Request Focus</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Topics most requested by students:</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { topic: 'GTM & Sales Pitching', pct: 45, color: '#C5975B' },
                      { topic: 'MVP Building & Scope Tech', pct: 30, color: '#10b981' },
                      { topic: 'Seed Round Pitch deck reviews', pct: 25, color: '#8b5cf6' }
                    ].map((area, i) => (
                      <div key={i}>
                        <div style={s.analyticsFocusRow}>
                          <span>{area.topic}</span>
                          <span>{area.pct}%</span>
                        </div>
                        <div style={s.focusBarBg}>
                          <div style={s.focusBarFill(area.pct, area.color)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div style={s.tabContentCard}>
              <div style={s.tabCardHeaderRow}>
                <div>
                  <h2>Notifications Hub</h2>
                  <p>Updates on new mentorship requests, messages, and platform payouts.</p>
                </div>
                <button onClick={() => {
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                  addToast('All notifications marked as read.');
                }} style={s.markAllReadBtn}>Mark All as Read</button>
              </div>

              <div style={s.notificationsList}>
                {notifications.map(notif => (
                  <div key={notif.id} style={s.notifItem(notif.read)}>
                    <div style={s.notifLeft}>
                      <div style={s.notifIndicator(notif.read)} />
                      <span style={s.notifText}>{notif.text}</span>
                    </div>
                    <span style={s.notifTime}>{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div style={s.tabContentCard}>
              <div style={s.tabCardHeader}>
                <h2>Dashboard Settings</h2>
                <p>Update credentials, security settings, and notifications alerts settings.</p>
              </div>

              <div style={s.settingsLayout}>
                <div style={s.settingsSection}>
                  <h3>Account Credentials</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', maxWidth: '400px' }}>
                    <div style={s.formGroup}>
                      <label style={s.formLabel}>Current Password</label>
                      <input type="password" placeholder="••••••••" style={s.formInput} />
                    </div>
                    <div style={s.formGroup}>
                      <label style={s.formLabel}>New Password</label>
                      <input type="password" placeholder="New Password" style={s.formInput} />
                    </div>
                    <button onClick={() => addToast('Password successfully changed.')} style={s.saveProfileBtn}>Change Password</button>
                  </div>
                </div>

                <div style={s.divider} />

                <div style={s.settingsSection}>
                  <h3>Preferences & Alerts</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                    {[
                      { title: 'Email Notification Alerts', desc: 'Receive instant emails when a student founder requests a meeting.', key: 'email' },
                      { title: 'Browser Push Notifications', desc: 'Receive popup notifications when chat messages arrive.', key: 'push' },
                      { title: 'Weekly Reports Digests', desc: 'Email digests summarizing monthly ratings and hours guided.', key: 'weekly' }
                    ].map((pref, i) => (
                      <div key={i} style={s.toggleRow}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>{pref.title}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{pref.desc}</div>
                        </div>
                        <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HELP */}
          {activeTab === 'help' && (
            <div style={s.tabContentCard}>
              <div style={s.tabCardHeader}>
                <h2>Help & Support desk</h2>
                <p>Read FAQs or raise a support ticket directly with the Startup India Admin Team.</p>
              </div>

              <div style={s.helpSplit}>
                {/* FAQs */}
                <div style={s.helpLeft}>
                  <h3>Frequently Asked Questions</h3>
                  <div style={s.faqList}>
                    {[
                      { q: 'How do I withdraw my earnings?', a: 'Navigate to the "Earnings" tab, verify your withdrawable balance, and click "Request Payout". Payouts are reviewed and wired within 2-3 business days.' },
                      { q: 'How can I change my availability times?', a: 'Go to the "Calendar" tab, check/uncheck days, and update the time duration slots. Click "Save Schedule" to update student availability calendars.' },
                      { q: 'Can I cancel a confirmed session?', a: 'Yes. Locate the call in the "Sessions" tab, select "Reschedule/Cancel", write a brief reason, and submit. The student will be notified by email.' }
                    ].map((faq, i) => (
                      <div key={i} style={s.faqItem}>
                        <div style={s.faqQuestion}>{faq.q}</div>
                        <p style={s.faqAnswer}>{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Raise Ticket */}
                <div style={s.helpRight}>
                  <h3>Raise Support Ticket</h3>
                  <form onSubmit={handleSendTicket} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                    <div style={s.formGroup}>
                      <label style={s.formLabel}>Category</label>
                      <select 
                        value={supportTicket.category} 
                        onChange={e => setSupportTicket({ ...supportTicket, category: e.target.value })}
                        style={s.formInput}
                      >
                        {['General', 'Earnings/Payout', 'Booking Issues', 'Platform Bugs'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div style={s.formGroup}>
                      <label style={s.formLabel}>Subject</label>
                      <input 
                        type="text" 
                        value={supportTicket.subject}
                        onChange={e => setSupportTicket({ ...supportTicket, subject: e.target.value })}
                        placeholder="Short summary of issue" 
                        style={s.formInput} 
                        required 
                      />
                    </div>

                    <div style={s.formGroup}>
                      <label style={s.formLabel}>Details / Message</label>
                      <textarea 
                        value={supportTicket.message}
                        onChange={e => setSupportTicket({ ...supportTicket, message: e.target.value })}
                        placeholder="Describe the issue in detail..." 
                        style={s.formTextarea} 
                        rows={4} 
                        required 
                      />
                    </div>

                    <button type="submit" style={s.saveProfileBtn}>Submit Ticket</button>
                  </form>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {showScheduleModal && (
        <div style={s.modalOverlay}>
          <div style={{ ...s.modalContent, width: '450px', padding: '24px', background: '#090e1a', border: '1.5px solid #1e293b', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc', marginBottom: '16px' }}>Schedule New Mentorship Session</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              
              let formattedTime = schedDateTime;
              try {
                if (schedDateTime) {
                  const dateObj = new Date(schedDateTime);
                  if (!isNaN(dateObj.getTime())) {
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const dayName = days[dateObj.getDay()];
                    const day = dateObj.getDate();
                    const monthName = months[dateObj.getMonth()];
                    const year = dateObj.getFullYear();
                    
                    let hours = dateObj.getHours();
                    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    
                    formattedTime = `${dayName}, ${day} ${monthName} ${year} · ${hours}:${minutes} ${ampm}`;
                  }
                }
              } catch (err) {
                console.error(err);
              }
              
              const res = await apiPost('/api/v1/mentors/sessions', {
                studentName: schedFounder,
                topic: schedTopic,
                time: formattedTime,
                duration: schedDuration,
                status: schedStatus
              });
              
              if (!res.error) {
                setSessions(prev => [res.data, ...prev]);
                addToast('Session scheduled successfully!');
                setShowScheduleModal(false);
                setSchedFounder('');
                setSchedTopic('');
                setSchedDateTime('');
                setSchedDuration('30 min');
                setSchedStatus('upcoming');
              } else {
                addToast('Failed to schedule session: ' + res.error, 'warning');
              }
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Founder Name</label>
                  <input 
                    type="text" 
                    value={schedFounder} 
                    onChange={e => setSchedFounder(e.target.value)} 
                    placeholder="e.g. Sneha Kapoor" 
                    style={s.formInput} 
                    required 
                  />
                </div>
                
                <div style={s.formGroup}>
                  <label style={s.formLabel}>Session Topic</label>
                  <input 
                    type="text" 
                    value={schedTopic} 
                    onChange={e => setSchedTopic(e.target.value)} 
                    placeholder="e.g. User Acquisition & Growth" 
                    style={s.formInput} 
                    required 
                  />
                </div>

                <div style={s.formGroup}>
                  <label style={s.formLabel}>Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={schedDateTime} 
                    onChange={e => setSchedDateTime(e.target.value)} 
                    style={s.formInput} 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={s.formGroup}>
                    <label style={s.formLabel}>Duration</label>
                    <select 
                      value={schedDuration} 
                      onChange={e => setSchedDuration(e.target.value)} 
                      style={s.formInput}
                    >
                      <option value="30 min">30 mins</option>
                      <option value="45 min">45 mins</option>
                      <option value="60 min">60 mins</option>
                      <option value="90 min">90 mins</option>
                    </select>
                  </div>
                  
                  <div style={s.formGroup}>
                    <label style={s.formLabel}>Status</label>
                    <select 
                      value={schedStatus} 
                      onChange={e => setSchedStatus(e.target.value)} 
                      style={s.formInput}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ ...s.modalBtnRow, marginTop: '24px' }}>
                <button type="button" onClick={() => setShowScheduleModal(false)} style={s.modalCancelBtn}>Cancel</button>
                <button type="submit" style={s.modalApproveBtn}>Schedule Session</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. Premium Stylesheet Object
const s = {
  layoutContainer: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    background: '#f8fafc',
    fontFamily: 'Inter, sans-serif'
  },
  toastContainer: {
    position: 'fixed',
    top: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    pointerEvents: 'none'
  },
  toast: (type) => ({
    background: type === 'success' ? '#10b981' : '#f59e0b',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13.5px',
    fontWeight: '600',
    animation: 'slideIn 0.3s ease-out forwards',
    pointerEvents: 'auto'
  }),
  
  // Left Sidebar Styling
  sidebar: {
    width: '280px',
    background: 'linear-gradient(180deg, #7A1F2B 0%, #4A0F18 100%)',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    flexShrink: 0,
    height: '100%',
    zIndex: 100,
    overflowY: 'hidden',
    boxShadow: '4px 0 25px rgba(0, 0, 0, 0.15)'
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: '20px'
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '800',
    fontSize: '16px'
  },
  logoTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '-0.02em'
  },
  logoSubtitle: {
    fontSize: '10px',
    color: '#64748b',
    fontWeight: '600',
    marginTop: '2px'
  },
  sidebarMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flexGrow: 1,
    overflowY: 'auto'
  },
  sidebarBtn: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    paddingLeft: isActive ? '10px' : '14px',
    borderRadius: isActive ? '0 10px 10px 0' : '10px',
    background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.75)',
    border: 'none',
    borderLeft: isActive ? '4px solid #ffffff' : 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
    outline: 'none'
  }),
  sidebarBtnLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  badgeLabel: (bgColor) => ({
    background: bgColor,
    color: '#fff',
    fontSize: '10.5px',
    fontWeight: '700',
    padding: '2px 7px',
    borderRadius: '100px'
  }),
  badge: (status) => ({
    background: status === 'Paid' || status === 'approved' ? '#dcfce7' : '#fee2e2',
    color: status === 'Paid' || status === 'approved' ? '#15803d' : '#ef4444',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '100px',
    textTransform: 'capitalize'
  }),
  referCard: {
    background: '#131c31',
    borderRadius: '16px',
    padding: '16px',
    marginTop: '20px',
    textAlign: 'center',
    border: '1.5px solid #1e293b'
  },
  referIconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: '#5d141e1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 10px'
  },
  referTitle: {
    color: '#fff',
    fontSize: '13.5px',
    fontWeight: '700'
  },
  referText: {
    color: '#64748b',
    fontSize: '11.5px',
    lineHeight: '1.4',
    margin: '6px 0 12px'
  },
  referBtn: {
    width: '100%',
    padding: '8px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #7A1F2B 0%, #5d141e 100%)',
    color: '#fff',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
  },

  // Main Workspace
  mainWorkspace: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    height: '100%',
    overflow: 'hidden'
  },
  workspaceHeader: {
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'saturate(180%) blur(12px)',
    WebkitBackdropFilter: 'saturate(180%) blur(12px)',
    borderBottom: '1px solid #eef0f3',
    padding: '14px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    position: 'sticky',
    top: 0,
    zIndex: 20,
    boxShadow: '0 1px 2px rgba(16,24,40,0.04)'
  },
  welcomeText: {
    fontSize: 'clamp(18px, 2.2vw, 24px)',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.02em',
    lineHeight: 1.15
  },
  welcomeSubText: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '2px',
    fontWeight: '500'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: '1 1 auto',
    justifyContent: 'flex-end',
    flexWrap: 'wrap'
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#f4f5f7',
    border: '1px solid #eceef1',
    borderRadius: '12px',
    padding: '9px 14px',
    flex: '1 1 220px',
    maxWidth: '340px',
    minWidth: 0,
    transition: 'all .18s ease'
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '13px',
    color: '#334155',
    width: '100%',
    minWidth: 0,
    fontWeight: '500'
  },
  searchKbd: {
    flexShrink: 0,
    fontSize: '10.5px',
    fontWeight: '700',
    color: '#94a3b8',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '2px 6px',
    letterSpacing: '0.5px'
  },
  iconButton: {
    background: '#fff',
    border: '1.5px solid #e2e8f0',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative'
  },
  headerBadge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#ef4444'
  },
  headerUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    background: '#f8fafc',
    padding: '4px 10px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0'
  },
  avatar: (size, bgColor = '#fcf4f5', color = '#7A1F2B') => ({
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background: bgColor,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: `${size / 2.5}px`
  }),
  headerUserInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  headerName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a'
  },
  headerRole: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '600'
  },
  logoutBtn: {
    background: '#fff',
    border: '1.5px solid #fee2e2',
    color: '#ef4444',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },

  // Viewport Container
  tabViewport: {
    padding: '20px 24px',
    flexGrow: 1,
    overflowY: 'auto',
    minHeight: 0
  },

  // Dashboard Tab Specifics
  dashboardStatsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '14px'
  },
  statCard: {
    background: '#fff',
    border: '1px solid #e9edf2',
    borderRadius: '14px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    boxShadow: '0 1px 2px rgba(16,24,40,0.03)'
  },
  statIconCircle: (bgColor) => ({
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    background: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  }),
  statValue: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0f172a'
  },
  statLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
    marginTop: '2px'
  },
  statTrendGreen: {
    display: 'inline-block',
    fontSize: '10.5px',
    color: '#10b981',
    fontWeight: '700',
    marginTop: '6px',
    background: '#ecfdf5',
    padding: '2px 6px',
    borderRadius: '100px'
  },
  statLinkText: {
    display: 'inline-block',
    fontSize: '10.5px',
    color: '#7A1F2B',
    fontWeight: '700',
    marginTop: '6px'
  },

  gridSplit: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.1fr',
    gap: '16px',
    alignItems: 'flex-start',
    marginTop: '0'
  },
  splitLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  splitRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },

  // Widgets
  widgetCard: {
    background: '#fff',
    border: '1px solid #e9edf2',
    borderRadius: '14px',
    padding: '18px',
    boxShadow: '0 1px 2px rgba(16,24,40,0.03)'
  },
  widgetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  widgetTitle: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.01em'
  },
  widgetHeaderLink: {
    background: 'none',
    border: 'none',
    color: '#7A1F2B',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    borderRadius: '12px',
    background: '#f8fafc',
    border: '1px solid #f1f5f9'
  },
  listUserLeft: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  listItemName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a'
  },
  listItemSubtitle: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '600'
  },
  listItemSnippet: {
    fontSize: '11.5px',
    color: '#94a3b8',
    marginTop: '4px',
    fontStyle: 'italic',
    lineHeight: '1.4'
  },
  listItemSnippetUnread: {
    fontSize: '11.5px',
    color: '#0f172a',
    marginTop: '4px',
    fontWeight: '600',
    lineHeight: '1.4'
  },
  sessionMetaInfo: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  metaText: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '600'
  },
  widgetFooterBtn: {
    width: '100%',
    padding: '10px',
    background: 'none',
    border: 'none',
    borderTop: '1.5px solid #f1f5f9',
    color: '#7A1F2B',
    fontWeight: '700',
    fontSize: '12.5px',
    cursor: 'pointer',
    marginTop: '14px',
    textAlign: 'center'
  },
  actionBtnGroup: {
    display: 'flex',
    gap: '8px'
  },
  iconActionBtn: (bgColor, color) => ({
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: bgColor,
    color: color,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  }),

  // Message specific widget
  messageMetaRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px'
  },
  metaTextTime: {
    fontSize: '10.5px',
    color: '#94a3b8',
    fontWeight: '600'
  },
  unreadDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#C5975B'
  },

  // Earnings widget
  earningsMainRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9',
    marginBottom: '16px'
  },
  earningsLabel: {
    fontSize: '12.5px',
    color: '#64748b',
    fontWeight: '600'
  },
  earningsValue: {
    fontSize: '26px',
    fontWeight: '900',
    color: '#0f172a',
    margin: '4px 0'
  },
  earningsIconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#fcf4f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  earningsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },
  earningsSubBox: {
    background: '#f8fafc',
    border: '1px solid #f1f5f9',
    borderRadius: '12px',
    padding: '12px',
    textAlign: 'center'
  },
  earningsSubTitle: {
    fontSize: '10.5px',
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  earningsSubValue: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#334155',
    marginTop: '4px'
  },

  // Profile summary widget
  profileHeaderLink: {
    background: 'none',
    border: 'none',
    color: '#7A1F2B',
    fontSize: '12.5px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  profileSummaryTop: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
    marginBottom: '16px'
  },
  profileAvatarLarge: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    background: '#fcf4f5',
    color: '#7A1F2B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '20px'
  },
  profileHeaderDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  profileHeaderName: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center'
  },
  profileHeaderTitle: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600'
  },
  profileHeaderCompany: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  profileMetaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
    marginBottom: '16px'
  },
  profileMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '12.5px',
    color: '#334155',
    fontWeight: '600'
  },
  profileExpertiseSec: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  profileExpertiseTitle: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '700'
  },
  expertiseChipGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  expertiseBadge: {
    background: '#fcf4f5',
    color: '#7A1F2B',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '100px'
  },
  expertiseBadgeMore: {
    background: '#f1f5f9',
    color: '#64748b',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '100px'
  },

  // Availability Row widget
  availRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    borderBottom: '1px solid #f8fafc'
  },
  availDay: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155'
  },
  availTime: {
    fontSize: '12.5px',
    color: '#64748b',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  availActiveDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#10b981'
  },

  // Quick Actions Widget
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginTop: '12px'
  },
  quickActionBtn: {
    background: '#f8fafc',
    border: '1.5px solid #f1f5f9',
    borderRadius: '14px',
    padding: '14px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.15s ease'
  },
  quickActionIconBg: (bgColor) => ({
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),

  // Generic Card Page wrapper
  tabContentCard: {
    background: '#fff',
    border: '1.5px solid #e2e8f0',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
  },
  tabCardHeader: {
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '16px',
    marginBottom: '24px'
  },
  tabCardHeaderRow: {
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '16px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  // Edit Profile Form
  profileForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  formLabel: {
    fontSize: '12.5px',
    fontWeight: '700',
    color: '#475569'
  },
  formInput: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid #cbd5e1',
    fontSize: '13.5px',
    outline: 'none',
    color: '#334155'
  },
  formInputTag: {
    padding: '10px 14px',
    borderRadius: '10px 0 0 10px',
    border: '1.5px solid #cbd5e1',
    borderRight: 'none',
    fontSize: '13.5px',
    outline: 'none',
    color: '#334155',
    flexGrow: 1
  },
  formTextarea: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid #cbd5e1',
    fontSize: '13.5px',
    outline: 'none',
    color: '#334155',
    resize: 'vertical'
  },
  tagEditorContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    background: '#f8fafc',
    padding: '16px',
    borderRadius: '12px',
    border: '1.5px solid #e2e8f0'
  },
  tagCloud: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  tagCloudChip: {
    background: '#fcf4f5',
    color: '#7A1F2B',
    fontWeight: '700',
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: '100px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  tagCloudChipDel: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '800'
  },
  tagAdder: {
    display: 'flex',
    maxWidth: '400px'
  },
  tagAdderBtn: {
    background: '#7A1F2B',
    color: '#fff',
    border: 'none',
    borderRadius: '0 10px 10px 0',
    padding: '0 18px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  formActions: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  saveProfileBtn: {
    padding: '12px 30px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #7A1F2B 0%, #5d141e 100%)',
    color: '#fff',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13.5px',
    boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
  },

  // Requests page
  requestsLayoutList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  requestDetailCard: {
    border: '1.5px solid #e2e8f0',
    borderRadius: '16px',
    padding: '24px'
  },
  reqCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '14px'
  },
  reqCardHeaderLeft: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  reqName: {
    fontSize: '14.5px',
    fontWeight: '800',
    color: '#0f172a'
  },
  reqTitle: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600'
  },
  reqMetaRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px'
  },
  reqBadge: (status) => ({
    background: status === 'new' ? '#fee2e2' : '#fef3c7',
    color: status === 'new' ? '#ef4444' : '#d97706',
    fontWeight: '700',
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '100px'
  }),
  reqCardBody: {
    marginTop: '16px'
  },
  reqMessage: {
    fontSize: '13.5px',
    color: '#334155',
    lineHeight: '1.5',
    background: '#f8fafc',
    padding: '14px',
    borderRadius: '12px',
    border: '1.5px solid #f1f5f9',
    marginTop: '6px'
  },
  reqFooterDetails: {
    display: 'flex',
    gap: '20px',
    marginTop: '14px'
  },
  reqDetailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12.5px',
    color: '#64748b',
    fontWeight: '600'
  },
  reqCardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '16px'
  },
  declineBtn: {
    background: '#fff',
    border: '1.5px solid #fee2e2',
    color: '#ef4444',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  approveBtn: {
    background: '#7A1F2B',
    color: '#fff',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(37,99,235,0.15)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#64748b'
  },

  // Sessions / Calendar
  sessionsTableArea: {
    overflowX: 'auto'
  },
  tableToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  createBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#7A1F2B',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer'
  },
  dashboardTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  tableTh: {
    padding: '14px 16px',
    background: '#f8fafc',
    color: '#475569',
    fontSize: '12.5px',
    fontWeight: '700',
    borderBottom: '1.5px solid #e2e8f0'
  },
  tableTr: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'all 0.15s ease'
  },
  tableTd: {
    padding: '16px',
    fontSize: '13.5px',
    color: '#334155'
  },
  sessionStatusBadge: (status) => ({
    background: status === 'upcoming' ? '#fcf4f5' : status === 'completed' ? '#dcfce7' : '#fee2e2',
    color: status === 'upcoming' ? '#7A1F2B' : status === 'completed' ? '#15803d' : '#ef4444',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '100px',
    textTransform: 'capitalize'
  }),
  joinMeetBtn: {
    background: '#7A1F2B',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '12px',
    textDecoration: 'none',
    display: 'inline-block'
  },
  completeActionBtn: {
    background: '#ecfdf5',
    color: '#059669',
    border: '1px solid #a7f3d0',
    padding: '6px 12px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '12px',
    cursor: 'pointer'
  },

  // Calendar slot
  calendarGridSplit: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '30px'
  },
  calendarLeft: {
    borderRight: '1px solid #f1f5f9',
    paddingRight: '24px'
  },
  calSlotEditor: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f8fafc',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #f1f5f9'
  },
  calSlotLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  slotTimeInput: {
    background: '#fff',
    border: '1.5px solid #cbd5e1',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '13px',
    color: '#334155',
    width: '180px',
    outline: 'none',
    fontWeight: '600'
  },
  calendarRight: {
    paddingLeft: '12px'
  },
  calMockMonth: {
    background: '#fff',
    border: '1.5px solid #e2e8f0',
    borderRadius: '16px',
    padding: '20px'
  },
  calMockMonthHeader: {
    textAlign: 'center',
    fontWeight: '800',
    fontSize: '15px',
    color: '#0f172a',
    marginBottom: '16px'
  },
  calMockDaysHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '11px',
    color: '#94a3b8',
    marginBottom: '8px'
  },
  calMockDayLabel: {
    padding: '4px'
  },
  calMockGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '6px'
  },
  calMockDay: (isAvailable) => ({
    padding: '10px 4px',
    textAlign: 'center',
    borderRadius: '8px',
    fontSize: '12.5px',
    fontWeight: '700',
    cursor: 'pointer',
    background: isAvailable ? '#ecfdf5' : '#fff',
    color: isAvailable ? '#059669' : '#cbd5e1',
    border: isAvailable ? '1px solid #a7f3d0' : '1px solid #f1f5f9',
    transition: 'all 0.15s ease'
  }),

  // Mentees cards
  menteesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  menteeCard: {
    background: '#fff',
    border: '1.5px solid #e2e8f0',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 6px rgba(0,0,0,0.01)'
  },
  menteeCardHeader: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '12px'
  },
  menteeName: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#0f172a'
  },
  menteeCompany: {
    fontSize: '11.5px',
    color: '#64748b',
    fontWeight: '600'
  },
  menteeCardBody: {
    marginTop: '12px',
    flexGrow: 1
  },
  menteeBio: {
    fontSize: '12.5px',
    color: '#475569',
    lineHeight: '1.4',
    marginBottom: '14px'
  },
  progressContainer: {
    marginBottom: '14px'
  },
  progressLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '700',
    marginBottom: '4px'
  },
  progressBarBg: {
    height: '6px',
    borderRadius: '100px',
    background: '#f1f5f9',
    overflow: 'hidden'
  },
  progressBarFill: (progress) => ({
    height: '100%',
    background: 'linear-gradient(90deg, #7A1F2B 0%, #C5975B 100%)',
    width: `${progress}%`,
    borderRadius: '100px'
  }),
  menteeStatsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '12px',
    color: '#475569',
    background: '#f8fafc',
    padding: '10px 14px',
    borderRadius: '10px'
  },
  menteeStatItem: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  menteeCardActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginTop: '16px',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '12px'
  },
  menteeActionBtn: {
    padding: '8px',
    borderRadius: '8px',
    background: '#7A1F2B',
    color: '#fff',
    border: 'none',
    fontWeight: '700',
    fontSize: '11.5px',
    cursor: 'pointer'
  },
  menteeActionBtnSec: {
    padding: '8px',
    borderRadius: '8px',
    background: '#f1f5f9',
    color: '#475569',
    border: '1.5px solid #cbd5e1',
    fontWeight: '700',
    fontSize: '11.5px',
    cursor: 'pointer'
  },

  // Chat Workspace
  chatWorkspace: {
    background: '#fff',
    border: '1.5px solid #e2e8f0',
    borderRadius: '20px',
    height: '600px',
    display: 'flex',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
  },
  chatSidebar: {
    width: '260px',
    borderRight: '1.5px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column'
  },
  chatSidebarHeader: {
    padding: '16px 20px',
    borderBottom: '1.5px solid #e2e8f0'
  },
  chatList: {
    flexGrow: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  chatListItem: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px',
    cursor: 'pointer',
    borderBottom: '1px solid #f1f5f9',
    background: isActive ? '#fcf4f5' : '#fff',
    position: 'relative'
  }),
  chatListInfo: {
    flexGrow: 1,
    minWidth: 0
  },
  chatListNameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chatListName: {
    fontSize: '12.5px',
    fontWeight: '700',
    color: '#0f172a'
  },
  chatListTime: {
    fontSize: '10px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  chatListText: {
    fontSize: '11.5px',
    color: '#64748b',
    marginTop: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  chatListTextUnread: {
    fontSize: '11.5px',
    color: '#0f172a',
    fontWeight: '700',
    marginTop: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  chatUnreadIndicator: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#C5975B'
  },
  chatMainView: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#f8fafc'
  },
  emptyChat: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#94a3b8',
    fontSize: '14px'
  },
  chatHeader: {
    background: '#fff',
    padding: '16px 20px',
    borderBottom: '1.5px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chatHeaderName: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#0f172a'
  },
  chatHeaderStatus: {
    fontSize: '11px',
    color: '#10b981',
    fontWeight: '600'
  },
  chatHeaderCallBtn: {
    background: '#7A1F2B',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  chatBody: {
    flexGrow: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  chatBubbleMe: {
    background: '#7A1F2B',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '12px 12px 0 12px',
    fontSize: '13px',
    maxWidth: '70%',
    boxShadow: '0 2px 4px rgba(37,99,235,0.1)'
  },
  chatBubbleOther: {
    background: '#fff',
    color: '#334155',
    padding: '10px 14px',
    borderRadius: '12px 12px 12px 0',
    fontSize: '13px',
    maxWidth: '70%',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
  },
  chatBubbleTime: {
    fontSize: '9.5px',
    opacity: 0.8,
    marginTop: '4px',
    textAlign: 'right'
  },
  chatInputBar: {
    background: '#fff',
    padding: '14px 20px',
    borderTop: '1.5px solid #e2e8f0',
    display: 'flex',
    gap: '12px'
  },
  chatInputField: {
    flexGrow: 1,
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid #cbd5e1',
    fontSize: '13.5px',
    outline: 'none',
    color: '#334155'
  },
  chatSendBtn: {
    background: '#7A1F2B',
    color: '#fff',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },

  // Reviews Tab
  reviewsSummaryRow: {
    display: 'flex',
    gap: '40px',
    background: '#f8fafc',
    padding: '24px',
    borderRadius: '16px',
    border: '1.5px solid #e2e8f0',
    alignItems: 'center'
  },
  reviewsRatingCard: {
    textAlign: 'center',
    borderRight: '1.5px solid #e2e8f0',
    paddingRight: '40px'
  },
  ratingCardScore: {
    fontSize: '44px',
    fontWeight: '900',
    color: '#0f172a'
  },
  reviewsStatsBreakdown: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  reviewBreakdownRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  breakdownLabel: {
    fontSize: '12.5px',
    color: '#64748b',
    width: '50px',
    fontWeight: '600'
  },
  breakdownBarBg: {
    flexGrow: 1,
    height: '8px',
    borderRadius: '100px',
    background: '#e2e8f0'
  },
  breakdownBarFill: (pct) => ({
    height: '100%',
    borderRadius: '100px',
    background: '#eab308',
    width: `${pct}%`
  }),
  breakdownValue: {
    fontSize: '12.5px',
    color: '#64748b',
    width: '35px',
    textAlign: 'right',
    fontWeight: '700'
  },
  feedbackList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '16px'
  },
  feedbackItemCard: {
    border: '1.5px solid #e2e8f0',
    borderRadius: '14px',
    padding: '18px'
  },
  feedbackCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '10px',
    marginBottom: '10px'
  },
  feedbackFounderName: {
    fontSize: '13.5px',
    fontWeight: '700',
    color: '#0f172a'
  },
  feedbackStartup: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '600'
  },
  feedbackMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px'
  },
  feedbackBody: {
    fontSize: '13px',
    color: '#475569',
    lineHeight: '1.4',
    fontStyle: 'italic'
  },

  // Earnings
  earningsHeaderRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  earningsMetricBox: {
    background: '#f8fafc',
    border: '1.5px solid #e2e8f0',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '10px'
  },
  metricLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '700'
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: '900',
    color: '#0f172a'
  },
  metricSub: {
    fontSize: '12px',
    color: '#94a3b8'
  },
  payoutWithdrawBtn: {
    background: '#7A1F2B',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '12.5px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '6px'
  },

  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  },
  modalContent: {
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
  },
  modalBtnRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
  },
  modalCancelBtn: {
    background: '#fff',
    border: '1.5px solid #cbd5e1',
    color: '#64748b',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  modalApproveBtn: {
    background: '#7A1F2B',
    color: '#fff',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer'
  },

  // Resources
  resourcesSplit: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '30px'
  },
  resourcesLeft: {
    borderRight: '1px solid #f1f5f9',
    paddingRight: '24px'
  },
  resourcesRight: {
    paddingLeft: '12px'
  },
  resourceItemCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px',
    borderRadius: '12px',
    background: '#f8fafc',
    border: '1px solid #f1f5f9'
  },
  resItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  resItemTitle: {
    fontSize: '13.5px',
    fontWeight: '700',
    color: '#0f172a'
  },
  resItemMeta: {
    fontSize: '11px',
    color: '#94a3b8',
    marginTop: '2px',
    fontWeight: '600'
  },
  resItemActions: {
    display: 'flex',
    gap: '6px'
  },
  resActionBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: '#fcf4f5',
    color: '#7A1F2B',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none'
  },
  resActionBtnDel: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },

  // Analytics
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  analyticsGraphCard: {
    background: '#fff',
    border: '1.5px solid #e2e8f0',
    borderRadius: '16px',
    padding: '24px'
  },
  mockGraphContainer: {
    height: '180px',
    display: 'flex',
    alignItems: 'flex-end',
    borderBottom: '1.5px solid #cbd5e1',
    marginTop: '16px',
    paddingBottom: '8px'
  },
  graphBars: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: '0 10px'
  },
  graphBarCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    width: '32px'
  },
  graphBar: (height) => ({
    width: '20px',
    height: `${height}px`,
    background: 'linear-gradient(180deg, #C5975B 0%, #7A1F2B 100%)',
    borderRadius: '4px 4px 0 0'
  }),
  graphBarLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '700'
  },
  graphDesc: {
    fontSize: '12.5px',
    color: '#64748b',
    marginTop: '14px',
    lineHeight: '1.4'
  },
  analyticsFocusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12.5px',
    fontWeight: '700',
    color: '#334155',
    marginBottom: '6px'
  },
  focusBarBg: {
    height: '6px',
    background: '#f1f5f9',
    borderRadius: '100px',
    overflow: 'hidden',
    marginBottom: '14px'
  },
  focusBarFill: (pct, color) => ({
    height: '100%',
    background: color,
    width: `${pct}%`,
    borderRadius: '100px'
  }),

  // Notifications
  markAllReadBtn: {
    background: 'none',
    border: 'none',
    color: '#7A1F2B',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  notifItem: (isRead) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderRadius: '12px',
    background: isRead ? '#fff' : '#fcf4f5',
    border: isRead ? '1.5px solid #e2e8f0' : '1.5px solid #f5dcc1'
  }),
  notifLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  notifIndicator: (isRead) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: isRead ? '#cbd5e1' : '#C5975B',
    flexShrink: 0
  }),
  notifText: {
    fontSize: '13.5px',
    color: '#334155',
    fontWeight: '600'
  },
  notifTime: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '500'
  },

  // Settings
  settingsLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  settingsSection: {
    paddingBottom: '16px'
  },
  divider: {
    height: '1.5px',
    background: '#e2e8f0'
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f8fafc',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #f1f5f9'
  },

  // Help
  helpSplit: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '30px'
  },
  helpLeft: {
    borderRight: '1px solid #f1f5f9',
    paddingRight: '24px'
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '16px'
  },
  faqItem: {
    background: '#f8fafc',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #f1f5f9'
  },
  faqQuestion: {
    fontWeight: '800',
    color: '#0f172a',
    fontSize: '13.5px'
  },
  faqAnswer: {
    fontSize: '12.5px',
    color: '#64748b',
    marginTop: '6px',
    lineHeight: '1.5'
  },
  helpRight: {
    paddingLeft: '12px'
  },
  chatBubbleRowMe: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  chatBubbleRowOther: {
    display: 'flex',
    justifyContent: 'flex-start'
  }
};

export default function MentorDashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'Poppins, Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #f1f5f9', borderTopColor: '#7A1F2B', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontWeight: '500' }}>Loading Workspace...</p>
        </div>
        <style jsx global>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    }>
      <MentorDashboardContent />
    </Suspense>
  );
}
