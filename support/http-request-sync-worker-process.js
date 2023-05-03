const http = require('http');
const https = require('https');
const {
  workerData: { logEnabled, shared, port, options, requestData },
} = require('worker_threads');

function log(...args) {
  if (logEnabled) {
    process.stdout.write(
      '[HttpRequestSync:worker] ' + args.map((it) => JSON.stringify(it)).join() + String.fromCharCode(10)
    );
  }
}

function notify() {
  const int32 = new Int32Array(shared);
  Atomics.notify(int32, 0);
}

function resolve(res, data) {
  const { statusCode, statusMessage, headers } = res;
  port.postMessage(JSON.stringify({ data, statusCode, statusMessage, headers }));
  notify();
}

function reject(error) {
  const { stack } = error;
  port.postMessage(JSON.stringify({ error: stack }));
  notify();
}

log(options, typeof options, options instanceof URL);

const isHttps =
  (typeof options === 'string' && options.startsWith('https:')) ||
  // (options instanceof URL && options.protocol === 'https') || // never!!
  (typeof options === 'object' && (options.port === 443 || options.protocol === 'https:'));
const request = isHttps ? https.request : http.request;

try {
  const req = request(options, (res) => {
    log('statusCode:', res.statusCode);
    log('headers:', res.headers);
    res.setEncoding('utf8');
    let data = '';
    res.on('data', (chunk) => {
      log('>' + chunk);
      data += chunk;
    });
    res.on('error', (error) => {
      return reject(error);
    });
    res.on('end', () => {
      return resolve(res, data);
    });
  });

  req.on('error', (error) => {
    log('error!', error, options, typeof options, options instanceof URL);
    return reject(error);
  });
  req.on('timeout', () => {
    log('timeout!');
    return reject();
  });
  req.on('uncaughtException', (error) => {
    log('uncaughtException!', error);
    return reject(error);
  });
  if (requestData && typeof requestData === 'string') {
    req.write(requestData, () => {
      log('write string requestData', requestData);
    });
  } else if (requestData && typeof requestData === 'object') {
    req.write(JSON.stringify(requestData), () => {
      log('write object requestData', requestData);
    });
  }
  req.end(() => {
    log('end!');
  });
} catch (err) {
  reject(err);
}
