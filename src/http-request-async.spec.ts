import { httpRequestAsync } from './http-request-async';

describe('http-request-async', () => {
  describe('httpRequestAsync', () => {
    it('should do GET', async () => {
      const TEST_URL = 'http://httpbin.org/get';
      const res = await httpRequestAsync(TEST_URL);
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET with URL', async () => {
      const TEST_URL = 'http://httpbin.org/get';
      const res = await httpRequestAsync(new URL(TEST_URL));
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET 404', async () => {
      const TEST_URL = 'http://httpbin.org/status/404';
      const res = await httpRequestAsync(TEST_URL);
      expect(res.statusCode).toBe(404);
    });
    it('should do GET via https', async () => {
      const TEST_URL = 'https://httpbin.org/get';
      const res = await httpRequestAsync(TEST_URL);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET with URL via https', async () => {
      const TEST_URL = 'https://httpbin.org/get';
      const res = await httpRequestAsync(new URL(TEST_URL));
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET with options.port via https', async () => {
      const TEST_URL = 'https://httpbin.org/get';
      const res = await httpRequestAsync({ host: 'httpbin.org', path: '/get', port: 443 });
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET with options.protocol via https', async () => {
      const TEST_URL = 'https://httpbin.org/get';
      const res = await httpRequestAsync({ host: 'httpbin.org', path: '/get', protocol: 'https:' });
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET 404 via https', async () => {
      const TEST_URL = 'https://httpbin.org/status/404';
      const res = await httpRequestAsync(TEST_URL);
      expect(res.statusCode).toBe(404);
    });
  });
});
