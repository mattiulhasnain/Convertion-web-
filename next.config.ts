const nextConfig = {
  output: 'export',
  // No basePath needed for custom domain
  images: {
    unoptimized: true,
  },
  // Use experimental features for font optimization
  experimental: {
    optimizeFonts: true,
  },
};

export default nextConfig;
