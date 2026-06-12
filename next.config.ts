import type { NextConfig } from "next";

// GitHub Pages 프로젝트 페이지(/TheLastLight) 정적 배포 설정.
// NEXT_PUBLIC_BASE_PATH 는 배포 빌드에서만 주입 (로컬은 빈 값 → 루트로 동작).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
