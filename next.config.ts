import type { NextConfig } from "next";
// import withBundleAnalyzer from '@next/bundle-analyzer';

// const withAnalyzer = withBundleAnalyzer({
//   enabled: process.env.ANALYZE === 'true',
// });

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  experimental: {
    proxyPrefetch: "strict",
    optimizeCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.URL_BACKEND ?? 'apartment-api.webmotech.com',
      },
      {
        protocol: "https",
        hostname: 'apartment-api.webmotech.com',
      },
      {
        protocol: "https",
        hostname: 'api.servicedapartments.lk',
      },
      {
        protocol: "https",
        hostname: 'apartment-web.webmotech.com',
      },
      {
        protocol: "https",
        hostname: process.env.BEST_WEB_URL ?? 'ebadge.bestweb.lk',
      },
    ],
  },
  async redirects() {
    return [
      // Internal redirects
      {
        source: '/aboutus',
        destination: '/about-us',
        permanent: true,
      },

      // External redirects
      {
        source: '/become-a-host',
        destination: process.env.NEXT_PUBLIC_HOST_URL || '/',
        permanent: false,
      },

      // Catch segments redirect to home
      { source: '/city', destination: '/', permanent: false },
      { source: '/city/:path*', destination: '/', permanent: false },

      { source: '/category', destination: '/', permanent: false },
      { source: '/category/:path*', destination: '/', permanent: false },

      { source: '/amenity', destination: '/', permanent: false },
      { source: '/amenity/:path*', destination: '/', permanent: false },

      { source: '/state', destination: '/', permanent: false },
      { source: '/state/:path*', destination: '/', permanent: false },

      { source: '/type', destination: '/', permanent: false },
      { source: '/type/:path*', destination: '/', permanent: false },

      { source: '/country', destination: '/', permanent: false },
      { source: '/country/:path*', destination: '/', permanent: false },

      { source: '/tag', destination: '/', permanent: false },
      { source: '/tag/:path*', destination: '/', permanent: false },

      { source: '/room_type', destination: '/', permanent: false },
      { source: '/room_type/:path*', destination: '/', permanent: false },

      { source: '/facility', destination: '/', permanent: false },
      { source: '/facility/:path*', destination: '/', permanent: false },

      { source: '/listing', destination: '/', permanent: false },
      { source: '/listing/:path*', destination: '/', permanent: false },
    ]
  }
  // env: {
  //   TZ: "Asia/Colombo",
  // },
};

// export default withAnalyzer(nextConfig);
export default nextConfig;
