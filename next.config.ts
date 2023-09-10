import type {
	NextConfig
} from "next";
const nextConfig: NextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	devIndicators: {
		buildActivityPosition: 'bottom-right',
	}
}

module.exports = nextConfig;
