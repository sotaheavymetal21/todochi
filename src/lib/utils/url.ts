/**
 * URL validation utilities for preventing Open Redirect vulnerabilities
 */

/**
 * Validates that a redirect path is safe (internal path only)
 * Prevents Open Redirect attacks by rejecting:
 * - Protocol-relative URLs (//evil.com)
 * - Absolute URLs with protocols (https://evil.com)
 * - Paths not starting with /
 */
export function isValidRedirectPath(path: string | null): boolean {
  if (!path) return false;
  // Reject protocol-relative URLs
  if (path.startsWith("//")) return false;
  // Reject absolute URLs with protocol
  if (path.includes("://")) return false;
  // Must start with /
  if (!path.startsWith("/")) return false;
  // Reject paths with encoded characters that could bypass validation
  if (path.includes("%2f") || path.includes("%2F")) return false;
  return true;
}

/**
 * Returns a safe redirect path, falling back to the default if invalid
 */
export function getSafeRedirectPath(
  path: string | null,
  fallback = "/projects",
): string {
  return isValidRedirectPath(path) ? path! : fallback;
}
