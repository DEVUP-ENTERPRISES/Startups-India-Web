'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiGet } from '@/lib/api';

const DashboardContext = createContext({});

export function DashboardProvider({ children, authUser }) {
  const [user, setUser] = useState(authUser || null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const [enrReq, crsReq, certsReq, actsReq, wishReq, userReq] = await Promise.all([
      apiGet('/api/v1/enrollments'),
      apiGet('/api/v1/courses'),
      apiGet('/api/v1/certificates'),
      apiGet('/api/v1/activity?limit=10'),
      apiGet('/api/v1/users/wishlist'),
      apiGet('/api/v1/auth/me'),
    ]);

    setEnrolledCourses(Array.isArray(enrReq.data) ? enrReq.data : []);
    setCourses(Array.isArray(crsReq.data) ? crsReq.data : []);
    setCertificates(Array.isArray(certsReq.data) ? certsReq.data : []);
    setActivities(Array.isArray(actsReq.data) ? actsReq.data : []);
    setWishlist(Array.isArray(wishReq.data) ? wishReq.data : []);
    if (userReq.data?.user) {
      setUser(userReq.data.user);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = {
    user,
    courses,
    wishlist,
    enrolledCourses,
    certificates,
    activities,
    isLoading,
    refresh,
    setWishlist,
    toggleLocalWishlist: (course) => {
      setWishlist(prev => {
        const exists = prev.find(w => w._id === course._id);
        if (exists) {
          return prev.filter(w => w._id !== course._id);
        } else {
          return [...prev, course];
        }
      });
    }
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  return useContext(DashboardContext);
}
