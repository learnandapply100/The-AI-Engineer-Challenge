/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep defaults. The backend URL is supplied at build time via
  // NEXT_PUBLIC_API_URL (local dev only); on Vercel the frontend calls
  // /api/* on the same domain, so nothing extra is needed here.
  reactStrictMode: true,
};

export default nextConfig;
