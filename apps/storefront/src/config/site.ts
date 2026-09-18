/**
 * Prefix local public assets when the storefront is built under a GitHub Pages
 * project path. During local development this remains an empty string.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function localAssetPath(path: string) {
  if (!path.startsWith("/") || !basePath || path.startsWith(`${basePath}/`)) {
    return path;
  }
  return `${basePath}${path}`;
}
