import http from 'http';
import https from 'https';
import type { IncomingMessage, RequestOptions } from 'http';
import type { HttpResponse } from './http-response';

const logEnabled = process.env.HTTP_REQUEST_SYNC_LOG_ENABLED;

interface RequestData {
  [key: string]: any;
}

function log(...args: Array<unknown>) {
  if (logEnabled) {
    process.stdout.write('[HttpRequestAsync] ' + args.map((it) => JSON.stringify(it)).join() + '\n');
  }
}

/** minimal version to compare with `httpRequestSync()` */
export async function httpRequestAsync(
  options: string | URL | RequestOptions,
  requestData?: string | RequestData
): Promise<HttpResponse> {
  return new Promise<HttpResponse>((resolve, reject) => {
    log(options, typeof options, options instanceof URL);

    const isHttps =
      (typeof options === 'string' && options.startsWith('https:')) ||
      (options instanceof URL && options.protocol === 'https') ||
      (typeof options === 'object' && (options.port === 443 || options.protocol === 'https:'));
    const request = isHttps ? https.request : http.request;

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
        return resolve({ data, statusCode: statusCode ?? 0, statusMessage: statusMessage ?? '', headers });
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
  });
}
