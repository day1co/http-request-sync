import { httpRequestAsync } from './http-request-async';

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('http-request-async', () => {
  describe('httpRequestAsync', () => {
    it('should do GET', async () => {
      const TEST_URL = 'http://127.0.0.1:8888/get';
      const res = await httpRequestAsync(TEST_URL);
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET with URL', async () => {
      const TEST_URL = 'http://127.0.0.1:8888/get';
      const res = await httpRequestAsync(new URL(TEST_URL));
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do POST with DATA', async () => {
      const postData = {
        msg: 'Hello World!',
      };
      const options = {
        hostname: '127.0.0.1',
        path: '/post',
        port: 8888,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = await httpRequestAsync(options, postData);
      expect(res.statusCode).toBe(200);
    });
    it('should do GET 404', async () => {
      const TEST_URL = 'http://127.0.0.1:8888/status/404';
      const res = await httpRequestAsync(TEST_URL);
      expect(res.statusCode).toBe(404);
    });
    it('should do GET via https', async () => {
      const TEST_URL = 'https://127.0.0.1:8889/get';
      const res = await httpRequestAsync(TEST_URL);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do POST with DATA via https', async () => {
      const postData = {
        msg: 'Hello World!',
      };
      const options = {
        hostname: '127.0.0.1',
        path: '/post',
        port: 8889,
        method: 'POST',
        protocol: 'https:',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = await httpRequestAsync(options, postData);
      expect(res.statusCode).toBe(200);
    });
    it('should do GET with URL via https', async () => {
      const TEST_URL = 'https://127.0.0.1:8889/get';
      const res = await httpRequestAsync(new URL(TEST_URL));
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET with options.port via https', async () => {
      // mock-server not support 443
      const TEST_URL = 'https://httpbin.org/get';
      const res = await httpRequestAsync({ host: 'httpbin.org', path: '/get', method: 'GET', port: 443 });
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET with options.protocol via https', async () => {
      const TEST_URL = 'https://127.0.0.1:8889/get';
      const res = await httpRequestAsync({
        hostname: '127.0.0.1',
        path: '/get',
        method: 'GET',
        port: 8889,
        protocol: 'https:',
      });
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET 404 via https', async () => {
      const TEST_URL = 'https://127.0.0.1:8889/status/404';
      const res = await httpRequestAsync(TEST_URL);
      expect(res.statusCode).toBe(404);
    });
  });
});
