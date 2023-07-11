import { httpRequestSync } from './http-request-sync';

describe('http-request-sync', () => {
  const targetHost = 'www.google.com';
  const targetPath = '/doodles/json/2023/7';
  const target = targetHost + targetPath;

  describe('httpRequestSync', () => {
    it('should do GET', () => {
      const TEST_URL = `http://${target}`;
      const res = httpRequestSync(TEST_URL);
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.data);
      expect(data).toBeTruthy();
    });
    it('should do GET with URL', () => {
      const TEST_URL = `http://${target}`;
      const res = httpRequestSync(new URL(TEST_URL));
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.data);
      expect(data).toBeTruthy();
    });
    it('should do GET 404', () => {
      const TEST_URL = `http://${target}/404`;
      const res = httpRequestSync(TEST_URL);
      expect(res.statusCode).toBe(404);
    });
    it('should do GET via https', () => {
      const TEST_URL = `https://${target}`;
      const res = httpRequestSync(TEST_URL);
      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.data);
      expect(data).toBeTruthy();
    });
    it('should do GET with URL via https', () => {
      const TEST_URL = `https://${target}`;
      const res = httpRequestSync(new URL(TEST_URL));
      const data = JSON.parse(res.data);
      expect(data).toBeTruthy();
    });
    it('should do GET with options.port via https', () => {
      const res = httpRequestSync({ host: targetHost, path: targetPath, port: 443 });
      const data = JSON.parse(res.data);
      expect(data).toBeTruthy();
    });
    it('should do GET with options.protocol via https', () => {
      const res = httpRequestSync({ host: targetHost, path: targetPath, protocol: 'https:' });
      const data = JSON.parse(res.data);
      expect(data).toBeTruthy();
    });
    it('should do GET 404 via https', () => {
      const TEST_URL = `https://${targetHost}/404`;
      const res = httpRequestSync(TEST_URL);
      expect(res.statusCode).toBe(404);
    });
    it('should fail with invalid protocol', () => {
      const TEST_URL = `htt://${target}`;
      const res = httpRequestSync(TEST_URL);
      expect(res.statusCode).toBeUndefined();
      expect(res).toHaveProperty('error');
    });
  });
});
