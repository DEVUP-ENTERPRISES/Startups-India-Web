'use client';

// Replaces the root layout when it fails, so it must render its own <html> and use inline styles.
export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
          background: '#f9fafb',
        }}
      >
        <main
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              maxWidth: 520,
              width: '100%',
              textAlign: 'center',
              background: '#fff',
              border: '4px solid #000',
              boxShadow: '8px 8px 0 #000',
              padding: 40,
            }}
          >
            <h1 style={{ fontSize: 26, margin: '0 0 12px', color: '#000' }}>
              We&apos;ll be right back
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: '#475569', margin: '0 0 28px' }}>
              Something went wrong on our side. Your account and data are safe. Please try again in
              a moment.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                background: '#000',
                color: '#fff',
                border: '2px solid #000',
                padding: '14px 32px',
                fontSize: 17,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '4px 4px 0 #7A1F2B',
              }}
            >
              Try again
            </button>
            {error?.digest && (
              <p style={{ marginTop: 20, fontSize: 12, color: '#94a3b8' }}>
                Reference: {error.digest}
              </p>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
