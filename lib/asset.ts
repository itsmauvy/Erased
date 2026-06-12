/**
 * GitHub Pages 같은 하위 경로(/TheLastLight) 배포 시 public 에셋 경로를 보정한다.
 * 빌드 시 NEXT_PUBLIC_BASE_PATH 가 주입되고, 로컬 개발에선 빈 문자열이라 그대로 동작.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path?: string): string | undefined {
  if (!path) return path;
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
