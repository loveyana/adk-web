import {getCookie, getUserIdFromSession} from './cookie-util';

describe('CookieUtil', () => {
  beforeEach(() => {
    // Clear all cookies before each test
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  });

  describe('getCookie', () => {
    it('should return null when cookie does not exist', () => {
      expect(getCookie('nonexistent')).toBeNull();
    });

    it('should return cookie value when cookie exists', () => {
      document.cookie = 'test_cookie=test_value';
      expect(getCookie('test_cookie')).toBe('test_value');
    });

    it('should handle cookies with spaces', () => {
      document.cookie = 'test_cookie=test value with spaces';
      expect(getCookie('test_cookie')).toBe('test value with spaces');
    });
  });

  describe('getUserIdFromSession', () => {
    it('should return null when adk_session cookie does not exist', () => {
      expect(getUserIdFromSession()).toBeNull();
    });

    it('should extract user_info.sub from valid adk_session cookie', () => {
      const sessionData = {
        access_token: 'test_token',
        token_type: 'Bearer',
        expires_at: 1763424777.9927738,
        refresh_token: null,
        user_info: {
          sub: 'd53cae0659393dbab0d4f671811dd2af',
          name: ' ',
          locale: null,
          preferred_username: 'workshop',
        },
      };

      const base64Session = btoa(JSON.stringify(sessionData));
      document.cookie = `adk_session=${base64Session}`;

      expect(getUserIdFromSession()).toBe('d53cae0659393dbab0d4f671811dd2af');
    });

    it('should return null when user_info.sub is missing', () => {
      const sessionData = {
        access_token: 'test_token',
        user_info: {},
      };

      const base64Session = btoa(JSON.stringify(sessionData));
      document.cookie = `adk_session=${base64Session}`;

      expect(getUserIdFromSession()).toBeNull();
    });

    it('should return null when cookie is not valid JSON', () => {
      document.cookie = 'adk_session=invalid_base64';
      expect(getUserIdFromSession()).toBeNull();
    });

    it('should return null when cookie is not valid base64', () => {
      document.cookie = 'adk_session=!!!invalid!!!';
      expect(getUserIdFromSession()).toBeNull();
    });
  });
});

