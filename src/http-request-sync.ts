import type { RequestOptions } from 'http';
import type { HttpResponse } from './http-response';
import { MessageChannel, receiveMessageOnPort, Worker } from 'worker_threads';

const logEnabled =
  !process.env.HTTP_REQUEST_SYNC_LOG_ENABLED || process.env.HTTP_REQUEST_SYNC_LOG_ENABLED === 'false' ? false : true;

function log(...args: Array<unknown>) {
  if (logEnabled) {
    process.stdout.write('[HttpRequestSync] ' + args.map((it) => JSON.stringify(it)).join() + '\n');
  }
}

/**
 * @see https://whistlr.info/2021/block-nodejs-main-thread/
 * @see https://nodejs.org/api/worker_threads.html
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Atomics
 */
export function httpRequestSync(options: string | URL | RequestOptions): HttpResponse {
  log(options);
  const { port1: localPort, port2: workerPort } = new MessageChannel();
  const shared = new SharedArrayBuffer(4);
  const int32 = new Int32Array(shared);

  // serialize URL instance into url string to pass to worker
  // see https://nodejs.org/api/worker_threads.html#workerworkerdata
  if (options instanceof URL) {
    options = options.href;
  }

  new Worker(
    `
const http = require('http');
const https = require('https');
const { workerData: { logEnabled, shared, port, options } } = require('worker_threads');

function log(...args) {
  if (logEnabled) {
    process.stdout.write('[HttpRequestSync:worker] ' + args.map((it) => JSON.stringify(it)).join() + String.fromCharCode(10));
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
  req.end(() => {
    log('end!');
  });
} catch (err) {
  reject(err);
}
  `,
    {
      eval: true,
      workerData: { logEnabled, shared, port: workerPort, options },
      transferList: [workerPort],
    }
  );
  Atomics.wait(int32, 0, 0);
  return JSON.parse(receiveMessageOnPort(localPort)?.message);
}
