import { httpRequestAsync } from './http-request-async';

describe('http-request-async', () => {
  const targetHost = 'www.google.com';
  const targetPath = '/doodles/json/2023/7';
  const target = targetHost + targetPath;

  describe('httpRequestAsync', () => {
    it('should do GET', async () => {
      const TEST_URL = `http://${target}`;
      const res = await httpRequestAsync(TEST_URL);
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.data);
      expect(data).toBeTruthy();
    });
    it('should do GET with URL', async () => {
      const TEST_URL = `http://${target}`;
      const res = await httpRequestAsync(new URL(TEST_URL));
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.data);
      expect(data).toBeTruthy();
    });
    it('should do GET 404', async () => {
      const TEST_URL = `http://${target}/404`;
      const res = await httpRequestAsync(TEST_URL);
      expect(res.statusCode).toBe(404);
    });
    it('should do GET via https', async () => {
      const TEST_URL = `https://${target}`;
      const res = await httpRequestAsync(TEST_URL);
      const data = JSON.parse(res.data);
      expect(data).toBeTruthy();
    });
    it('should do GET with URL via https', async () => {
      const TEST_URL = `https://${target}`;
      const res = await httpRequestAsync(new URL(TEST_URL));
      const data = JSON.parse(res.data);
      expect(data).toBeTruthy();
    });
    it('should do GET with options.port via https', async () => {
      const res = await httpRequestAsync({ host: targetHost, path: targetPath, port: 443 });
      const data = JSON.parse(res.data);
      expect(data).toBeTruthy();
    });
    it('should do GET with options.protocol via https', async () => {
      const res = await httpRequestAsync({ host: targetHost, path: targetPath, protocol: 'https:' });
      const data = JSON.parse(res.data);
      expect(data).toBeTruthy();
    });
    it('should do GET 404 via https', async () => {
      const TEST_URL = `https://${targetHost}/404`;
      const res = await httpRequestAsync(TEST_URL);
      expect(res.statusCode).toBe(404);
    });
  });
});
