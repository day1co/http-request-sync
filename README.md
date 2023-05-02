# http-request-sync

quick and dirty "synchoronous" wrapper of [http.request](https://nodejs.org/api/http.html#httprequestoptions-callback)

![version](https://img.shields.io/github/package-json/v/day1co/http-request-sync)

## Getting Started

```
test..
export NODE_TLS_REJECT_UNAUTHORIZED=0  // for mac
$env:NODE_TLS_REJECT_UNAUTHORIZED="0" // for window
```

```console
const { httpRequestSync, httpRequestAsync } = require('@day1co/http-request-sync');
const res1 = httpRequestSync('http://httpbin.org/get');
console.log(res1.statusCode);
console.log(res1.statusMessage);
console.log(res1.headers);
console.log(res1.data);

httpRequestAsync('http://httpbin.org/get');

const data = {
  msg: 'Hello World!',
};
// object or string
// const data = JSON.stringfy({
//   msg: 'Hello World!',
// });


const options = {
  hostname: 'httpbin.org',
  path: '/post',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};
const res2 = httpRequestSync(options, data);
console.log(res2.statusCode);
console.log(res2.statusMessage);
console.log(res2.headers);
console.log(res2.data);

httpRequestAsync(options, data);
```

---

may the **SOURCE** be with you...
