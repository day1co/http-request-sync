import { httpRequestSync } from './http-request-sync';

describe('http-request-sync', () => {
  describe('httpRequestSync', () => {
    it('should do GET', () => {
      const TEST_URL = 'http://httpbin.org/get';
      const res = httpRequestSync(TEST_URL);
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET with URL', async () => {
      const TEST_URL = 'http://httpbin.org/get';
      const res = await httpRequestSync(new URL(TEST_URL));
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET 404', () => {
      const TEST_URL = 'http://httpbin.org/status/404';
      const res = httpRequestSync(TEST_URL);
      expect(res.statusCode).toBe(404);
    });
    it('should do GET via https', () => {
      const TEST_URL = 'https://httpbin.org/get';
      const res = httpRequestSync(TEST_URL);
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET with URL via https', async () => {
      const TEST_URL = 'https://httpbin.org/get';
      const res = await httpRequestSync(new URL(TEST_URL));
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET with options.port via https', async () => {
      const TEST_URL = 'https://httpbin.org/get';
      const res = await httpRequestSync({ host: 'httpbin.org', path: '/get', port: 443 });
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET with options.protocol via https', async () => {
      const TEST_URL = 'https://httpbin.org/get';
      const res = await httpRequestSync({ host: 'httpbin.org', path: '/get', protocol: 'https:' });
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET 404 via https', () => {
      const TEST_URL = 'https://httpbin.org/status/404';
      const res = httpRequestSync(TEST_URL);
      expect(res.statusCode).toBe(404);
    });
    it('should fail with invalid protocol', () => {
      const TEST_URL = 'htt://httpbin.org/get';
      const res = httpRequestSync(TEST_URL);
      expect(res.statusCode).toBeUndefined();
      expect(res).toHaveProperty('error');
    });
  });
});
