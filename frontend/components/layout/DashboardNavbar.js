'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';

export default function DashboardNavbar({ user }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New course available',
      message: 'Check out the new AI course',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      title: 'Assignment due',
      message: 'Your assignment is due tomorrow',
      time: '5 hours ago',
      read: false,
    },
    {
      id: 3,
      title: 'Certificate earned',
      message: 'You earned a new certificate',
      time: '1 day ago',
      read: true,
    },
  ]);
  const router = useRouter();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push('/login');
    }
  };

  const markAsRead = id => {
    setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="dashboard-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <Image
            src="/assets/images/logo.png"
            alt="Startup India"
            width={150}
            height={45}
            priority
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </Link>

        {/* Search Bar */}
        <div className="navbar-search">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" placeholder="What do you want to learn?" className="search-input" />
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Navigation Links */}
          <nav className="navbar-nav">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/about" className="nav-link">
              About Us
            </Link>
            <Link href="/programs" className="nav-link">
              Our Programs
            </Link>
            <Link href="/events" className="nav-link">
              Events
            </Link>
            <Link href="/mentors" className="nav-link">
              Mentors
            </Link>
            <Link href="/investors" className="nav-link">
              Investors
            </Link>
            <Link href="/market-access" className="nav-link">
              Market Access
            </Link>
            <Link href="/resources" className="nav-link">
              Source
            </Link>
          </nav>

          {/* Notifications */}
          <div className="navbar-icon-wrapper">
            <button
              className="navbar-icon-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  <button
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="notification-content">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                      {!notification.read && <div className="notification-dot"></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="navbar-icon-wrapper">
            <button className="navbar-user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="user-avatar">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <div className="user-avatar large">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="user-info">
                    <h4>{user?.user_metadata?.full_name || 'User'}</h4>
                    <p>{user?.email}</p>
                  </div>
                </div>
                <div className="user-dropdown-menu">
                  <Link href="/dashboard" className="dropdown-item">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link href="/profile" className="dropdown-item">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Profile
                  </Link>
                  <Link href="/settings" className="dropdown-item">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
                    </svg>
                    Settings
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
