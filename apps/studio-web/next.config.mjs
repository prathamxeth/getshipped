/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@getshipped/shared-types', '@getshipped/remotion-studio'],
  reactStrictMode: true,
};

export default nextConfig;
