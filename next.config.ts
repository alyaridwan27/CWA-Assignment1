import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  webpack(config: Configuration, context: { isServer: boolean }) {
    const { isServer } = context;

    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        stream: false,
        net: false,
        tls: false,
        events: false,
        fs: false,
        http2: false,
      };
    }

    return config;
  },
};

export default nextConfig;
