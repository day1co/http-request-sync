import type { IncomingMessage, RequestOptions } from 'http';
import { request } from 'http';
import type { URL } from 'url';
import type { HttpResponse } from './http-response';

function log(...args: Array<any>) {
  process.stdout.write('[HttpRequestAsync] ' + args.map((it) => JSON.stringify(it)).join() + '\n');
}

/** minimal version to compare with `httpRequestSync()` */
export async function httpRequestAsync(options: string | URL | RequestOptions): Promise<HttpResponse> {
  log(options);
  return new Promise<any>((resolve, reject) => {
    const req = request(options, (res: IncomingMessage) => {
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
        return resolve({ data, statusCode, statusMessage, headers });
      });
    });
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
