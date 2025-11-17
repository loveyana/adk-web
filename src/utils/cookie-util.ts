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
    const sessionCookie = getCookie('adk_session');
    if (!sessionCookie) {
      console.debug('[Cookie] No adk_session cookie found');
      return null;
    }

    // Decode base64
    const decodedJson = atob(sessionCookie);
    const sessionData = JSON.parse(decodedJson);

    // Extract user_info.sub
    const userId = sessionData?.user_info?.sub;
    if (userId) {
      console.log('[Cookie] User ID from session cookie:', userId);
      return userId;
    }

    console.warn('[Cookie] No user_info.sub found in session cookie');
    return null;
  } catch (error) {
    console.error('[Cookie] Error parsing adk_session cookie:', error);
    return null;
  }
}

