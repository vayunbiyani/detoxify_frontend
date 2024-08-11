/** @type {import('next').NextConfig} */
const nextConfig = {
    serverRuntimeConfig: {
        bodySizeLimit: '100mb' // Set desired value here
    }
};

export default nextConfig;