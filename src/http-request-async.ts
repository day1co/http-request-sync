import type { IncomingMessage, RequestOptions } from 'http';
import http from 'http';
import https from 'https';
import type { URL } from 'url';
import type { HttpResponse } from './http-response';

function log(...args: Array<unknown>) {
  process.stdout.write('[HttpRequestAsync] ' + args.map((it) => JSON.stringify(it)).join() + '\n');
}

/** minimal version to compare with `httpRequestSync()` */
export async function httpRequestAsync(options: string | URL | RequestOptions): Promise<HttpResponse> {
  return new Promise<HttpResponse>((resolve, reject) => {
    log(options);

    const isHttps =
      (typeof options === 'string' && options.startsWith('https')) ||
      (typeof options === 'object' && options.protocol === 'https');

    function callback(res: IncomingMessage) {
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
        const { statusCode, statusMessage, headers } = res;
        return resolve({ data, statusCode: statusCode ?? 0, statusMessage: statusMessage ?? '', headers });
      });
    }

    const req = isHttps ? https.request(options, callback) : http.request(options, callback);

    req.on('error', (error) => {
      log('error!', error);
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
  });
}
