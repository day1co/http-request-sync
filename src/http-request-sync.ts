import fs from 'fs';
import type { RequestOptions } from 'http';
import type { HttpResponse } from './http-response';
import { MessageChannel, receiveMessageOnPort, Worker } from 'worker_threads';

const logEnabled = process.env.HTTP_REQUEST_SYNC_LOG_ENABLED;

interface RequestData {
  [key: string]: any;
}

function log(...args: Array<unknown>) {
  if (logEnabled) {
    process.stdout.write('[HttpRequestSync] ' + args.map((it) => JSON.stringify(it)).join() + '\n');
  }
}

const workerProcess = fs.readFileSync(__dirname + '/../support/http-request-sync-worker-process.js', 'utf-8');

/**
 * @see https://whistlr.info/2021/block-nodejs-main-thread/
 * @see https://nodejs.org/api/worker_threads.html
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Atomics
 */
export function httpRequestSync(
  options: string | URL | RequestOptions,
  requestData?: string | RequestData
): HttpResponse {
  log(options);
  log(requestData);
  const { port1: localPort, port2: workerPort } = new MessageChannel();
  const shared = new SharedArrayBuffer(4);
  const int32 = new Int32Array(shared);

  // serialize URL instance into url string to pass to worker
  // see https://nodejs.org/api/worker_threads.html#workerworkerdata
  if (options instanceof URL) {
    options = options.href;
  }

  new Worker(workerProcess, {
    eval: true,
    workerData: { logEnabled, shared, port: workerPort, options, requestData },
    transferList: [workerPort],
  });
  Atomics.wait(int32, 0, 0);
  return JSON.parse(receiveMessageOnPort(localPort)?.message);
}
