http-request-sync
=================

quick and dirty "synchronous" wrapper of [http.request](https://nodejs.org/api/http.html#httprequestoptions-callback)

![version](https://img.shields.io/github/package-json/v/day1co/http-request-sync)

Getting Started
---------------

```console
const { httpRequestSync } require('@day1co/http-request-sync');
const res = httpRequestSync('https://some-host.com/get');
console.log(res.statusCode);
console.log(res.statusMessage);
console.log(res.headers);
console.log(res.data);
```

---

may the **SOURCE** be with you...
