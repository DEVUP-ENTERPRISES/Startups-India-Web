export const navigationData = [
  {
    id: 'core',
    label: 'CORE',
    items: [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { id: 'my-learning', label: 'My Learning', path: '/my-learning', icon: 'book' },
    ],
  },
  {
    id: 'courses',
    label: 'COURSES',
    items: [
      { id: 'all-courses', label: 'Explore Courses', path: '/courses', icon: 'compass' },
      { id: 'enrolled', label: 'Enrolled Courses', path: '/enrolled-courses', icon: 'books' },
      { id: 'wishlist', label: 'Wishlist', path: '/wishlist', icon: 'rocket' },
      { id: 'completed', label: 'Completed Courses', path: '/completed-courses', icon: 'checkCircle' },
    ],
  },
  {
    id: 'experience',
    label: 'LEARNING EXPERIENCE',
    items: [
      { id: 'live', label: 'Live Classes', path: '/live', icon: 'live' },
      { id: 'recorded', label: 'Recorded Sessions', path: '/recorded', icon: 'recorded' },
      { id: 'notes', label: 'Notes / Bookmarks', path: '/notes', icon: 'bookmark' },
    ],
  },
  {
    id: 'assessments',
    label: 'QUIZ HUB',
    items: [
      { id: 'quizzes', label: 'Quizzes', path: '/quizzes', icon: 'helpCircle' },
      { id: 'assignments', label: 'Assignments', path: '/assignments', icon: 'pencil' },
      { id: 'exams', label: 'Exams', path: '/exams', icon: 'fileText' },
      { id: 'results', label: 'Results', path: '/results', icon: 'barChart' },
    ],
  },
  {
    id: 'analytics',
    label: 'ANALYTICS',
    items: [
      { id: 'progress', label: 'Progress Overview', path: '/analytics/progress', icon: 'trendUp' },
      { id: 'performance', label: 'Performance Analytics', path: '/analytics/performance', icon: 'pieChart' },
      { id: 'time', label: 'Learning Time', path: '/analytics/time', icon: 'clock' },
      { id: 'skill', label: 'Skill Graph', path: '/analytics/skills', icon: 'pieChart' },
    ],
  },
  {
    id: 'achievements',
    label: 'ACHIEVEMENTS',
    items: [
      { id: 'certificates', label: 'Certificates', path: '/certificates', icon: 'certificate' },
      { id: 'badges', label: 'Badges', path: '/badges', icon: 'badge' },
      { id: 'leaderboard', label: 'Leaderboard', path: '/leaderboard', icon: 'leaderboard' },
    ],
  },
  {
    id: 'community',
    label: 'COMMUNITY',
    items: [
      { id: 'discussions', label: 'Discussions', path: '/community/discussions', icon: 'message' },
      { id: 'groups', label: 'Groups', path: '/community/groups', icon: 'userPlus' },
      { id: 'doubts', label: 'Doubts / Q&A', path: '/community/doubts', icon: 'alertCircle' },
    ],
  },
  {
    id: 'payments',
    label: 'PAYMENTS',
    items: [
      { id: 'purchases', label: 'My Purchases', path: '/payments/purchases', icon: 'creditCard' },
      { id: 'billing', label: 'Billing History', path: '/payments/billing', icon: 'receipt' },
      { id: 'subscriptions', label: 'Subscriptions', path: '/payments/subscriptions', icon: 'refresh' },
    ],
  },
  {
    id: 'settings',
    label: 'SETTINGS',
    items: [
      { id: 'profile', label: 'Profile', path: '/profile', icon: 'user' },
      { id: 'account', label: 'Account Settings', path: '/settings', icon: 'settings' },
      { id: 'notifications', label: 'Notifications', path: '/settings/notifications', icon: 'bell' },
      { id: 'privacy', label: 'Privacy', path: '/settings/privacy', icon: 'lock' },
    ],
  },
];
