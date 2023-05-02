import { httpRequestSync } from './http-request-sync';

describe('http-request-sync', () => {
  describe('httpRequestSync', () => {
    it('should do GET', () => {
      const TEST_URL = 'http://127.0.0.1:8888/get';
      const res = httpRequestSync(TEST_URL);
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET with URL', () => {
      const TEST_URL = 'http://127.0.0.1:8888/get';
      const res = httpRequestSync(new URL(TEST_URL));
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do POST with DATA', () => {
      const postData = {
        msg: 'Hello World!',
      };
      const options = {
        hostname: '127.0.0.1',
        path: '/post',
        method: 'POST',
        port: 8888,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = httpRequestSync(options, postData);
      expect(res.statusCode).toBe(200);
    });
    it('should do GET 404', () => {
      const TEST_URL = 'http://127.0.0.1:8888/status/404';
      const res = httpRequestSync(TEST_URL);
      expect(res.statusCode).toBe(404);
    });
    it('should do GET via https', () => {
      const TEST_URL = 'https://127.0.0.1/get';
      const res = httpRequestSync(TEST_URL);
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET with URL via https', () => {
      const TEST_URL = 'https://127.0.0.1/get';
      const res = httpRequestSync(new URL(TEST_URL));
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET with options.port via https', () => {
      const TEST_URL = 'https://127.0.0.1/get';
      const res = httpRequestSync({ host: '127.0.0.1', path: '/get', port: 443 });
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET with options.protocol via https', () => {
      const TEST_URL = 'https://127.0.0.1/get';
      const res = httpRequestSync({ host: '127.0.0.1', path: '/get', protocol: 'https:' });
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET 404 via https', () => {
      const TEST_URL = 'https://127.0.0.1/status/404';
      const res = httpRequestSync(TEST_URL);
      expect(res.statusCode).toBe(404);
    });
    it('should fail with invalid protocol', () => {
      const TEST_URL = 'htt://127.0.0.1/get';
      const res = httpRequestSync(TEST_URL);
      expect(res.statusCode).toBeUndefined();
      expect(res).toHaveProperty('error');
    });
  });
});
