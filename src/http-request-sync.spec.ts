import { httpRequestSync } from './http-request-sync';

describe('http-request-sync', () => {
  describe('httpRequestSync', () => {
    it('should do GET', () => {
      const TEST_URL = 'http://httpbin.org/get';
      const res = httpRequestSync(TEST_URL);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET via https', () => {
      const TEST_URL = 'https://httpbin.org/get';
      const res = httpRequestSync(TEST_URL);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
  });
});
