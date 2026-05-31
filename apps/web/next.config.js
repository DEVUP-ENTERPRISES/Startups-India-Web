/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'www.innovationandentrepreneurshipcouncil.org',
      },
    ],
    unoptimized: true,
  },
  // Optimize for production
  swcMinify: true,
  reactStrictMode: true,
  // Better for Netlify deployment
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Production optimizations
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  // Disable Vercel Toolbar polling (/api/flags) — not needed, eliminates 404 spam
  devIndicators: {
    appIsrStatus: false,
  },

  webpack(config, { dev }) {
    if (dev) {
      // Silence "Failed to parse source map" warnings from node_modules (framer-motion etc.)
      config.ignoreWarnings = [
        { module: /node_modules/, message: /Failed to parse source map/ },
        { message: /source-map-loader/ },
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
