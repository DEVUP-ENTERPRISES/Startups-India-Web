export const metadata = {
  title: 'Reset Password - Startups India Incubation',
  description: 'Set a new password for your Startups India account',
  // The URL carries a live reset token — keep it out of search indexes and
  // out of the Referer header sent to any third-party asset.
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default function ResetPasswordLayout({ children }) {
  return <>{children}</>;
}
