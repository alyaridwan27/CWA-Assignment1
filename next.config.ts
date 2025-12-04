import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config: Configuration, { isServer }) => {
    if (isServer) {
      if (config.externals && Array.isArray(config.externals)) {
        config.externals.push(
          '@azure/monitor-opentelemetry',
          '@opentelemetry/sdk-node',
          '@grpc/grpc-js',
          '@opentelemetry/exporter-logs-otlp-grpc',
          '@opentelemetry/otlp-grpc-exporter-base'
        );
      }
    }
    return config;
  },
};

export default nextConfig;
