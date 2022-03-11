import { httpRequestAsync } from './http-request-async';

describe('http-request-async', () => {
  describe('httpRequestAsync', () => {
    it('should do GET', async () => {
      const TEST_URL = 'http://httpbin.org/get';
      const res = await httpRequestAsync(TEST_URL);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
    it('should do GET via https', async () => {
      const TEST_URL = 'https://httpbin.org/get';
      const res = await httpRequestAsync(TEST_URL);
      const data = JSON.parse(res.data);
      expect(data.url).toBe(TEST_URL);
    });
  });
});
