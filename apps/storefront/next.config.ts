import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (isGitHubPagesBuild && repositoryName ? `/${repositoryName}` : "");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: isGitHubPagesBuild ? "export" : undefined,
  basePath: basePath || undefined,
  trailingSlash: isGitHubPagesBuild,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: isGitHubPagesBuild,
    qualities: [75, 80, 85, 88, 90, 95],
  },
};
export default nextConfig;
