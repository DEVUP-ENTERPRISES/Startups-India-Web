export const metadata = {
  title: 'Forgot Password - Startups India Incubation',
  description: 'Request a secure link to reset your Startups India account password',
  // A reset flow should never be indexed.
  robots: { index: false, follow: false },
};

export default function ForgotPasswordLayout({ children }) {
  return <>{children}</>;
}
