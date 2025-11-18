import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      // 静的アセット用のCacheFirst戦略
      // Static assets (CSS, JS) - CacheFirst strategy
      {
        urlPattern: /^https?.*\.(css|js)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets-v1",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30日
          },
        },
      },
      // 画像用のCacheFirst戦略（maxEntries: 60）
      // Images - CacheFirst strategy with maxEntries: 60
      {
        urlPattern: /^https?.*\.(png|jpg|jpeg|svg|gif|webp|ico)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "image-cache-v1",
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30日
          },
        },
      },
      // API用のNetworkFirst戦略
      // API requests - NetworkFirst strategy
      {
        urlPattern: /^https?.*\/api\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-cache-v1",
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 5 * 60, // 5分
          },
        },
      },
      // フォント用のCacheFirst戦略
      // Fonts - CacheFirst strategy
      {
        urlPattern: /^https?.*\.(woff|woff2|ttf|otf|eot)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "font-cache-v1",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1年
          },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add empty turbopack config to silence the warning
  turbopack: {},
};

export default withPWA(nextConfig);
