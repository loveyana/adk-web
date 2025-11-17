/**
 * Utility functions for cookie operations
 */

/**
 * Get a cookie value by name
 * @param name Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');
  console.log(cookies)
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

/**
 * Parse adk_session cookie and extract user_info.sub
 *
 * NOTE: If adk_session cookie is set with HttpOnly flag, JavaScript cannot read it.
 * In that case, this function will return null.
 *
 * Solutions:
 * 1. Backend removes HttpOnly flag from adk_session cookie (if user_info.sub is not sensitive)
 * 2. Backend provides a separate non-HttpOnly cookie like 'adk_user_id' with just the userId
 * 3. Backend provides an API endpoint to get current user info
 *
 * The adk_session cookie contains a base64-encoded JSON object with the following structure:
 * {
 *   "access_token": "...",
 *   "token_type": "Bearer",
 *   "expires_at": 1763424777.9927738,
 *   "refresh_token": null,
 *   "user_info": {
 *     "sub": "d53cae0659393dbab0d4f671811dd2af",  // <- This is the userId
 *     "name": "...",
 *     "locale": null,
 *     "preferred_username": "..."
 *   }
 * }
 *
 * @returns User ID (user_info.sub) from session cookie or null if not found
 */
export function getUserIdFromSession(): string | null {
  try {
    // First, try to get from a dedicated non-HttpOnly cookie (if backend provides it)
    const userIdCookie = getCookie('adk_user_id');
    if (userIdCookie) {
      console.log('[Cookie] User ID from adk_user_id cookie:', userIdCookie);
      return userIdCookie;
    }

    // Fallback: try to parse adk_session cookie (will fail if HttpOnly)
    const sessionCookie = getCookie('adk_session');
    if (!sessionCookie) {
      console.warn('[Cookie] No adk_session or adk_user_id cookie found. If adk_session exists but is HttpOnly, JavaScript cannot read it.');
      return null;
    }

    // Decode base64
    const decodedJson = atob(sessionCookie);
    const sessionData = JSON.parse(decodedJson);

    // Extract user_info.sub
    const userId = sessionData?.user_info?.sub;
    if (userId) {
      console.log('[Cookie] User ID from adk_session cookie:', userId);
      return userId;
    }

    console.warn('[Cookie] No user_info.sub found in session cookie');
    return null;
  } catch (error) {
    console.error('[Cookie] Error parsing session cookie:', error);
    console.error('[Cookie] This might be because adk_session is HttpOnly and cannot be read by JavaScript');
    return null;
  }
}

