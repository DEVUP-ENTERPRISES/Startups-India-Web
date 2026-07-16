import '../../styles/dashboard-bundle.css';

import DashboardLayoutClient from './DashboardLayoutClient';

// Kept as a thin server component: all the client state (auth, mobile menu,
// role-based redirects) lives in DashboardLayoutClient. The CSS bundle above
// replaces the individual per-file imports — Next was dropping those chunks
// during HMR. design-system.css is not imported here on purpose; the root
// layout already loads it globally.
export default function DashboardLayout({ children }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
