import { Worker } from 'worker_threads';

const logEnabled = process.env.MOCK_SERVER_LOG_ENABLED;

function log(...args: Array<unknown>) {
  if (logEnabled) {
    process.stdout.write('[MockServer] ' + args.map((it) => JSON.stringify(it)).join() + '\n');
  }
}

interface HttpsOptions {
  key: Buffer | string;
  cert: Buffer | string;
}
export function startMockServer(options?: HttpsOptions): void {
  const worker = new Worker(
    `
   
    const PORT_HTTP = 8888;
    const PORT_HTTPS = 443;
    const http = require('http');
    const https = require('https');
    const { workerData: { options } } = require('worker_threads');

    function log(...args) {
      process.stdout.write(
        '[mock-server:worker] ' +
          args.map((it) => JSON.stringify(it)).join() +
          String.fromCharCode(10)
      );
    }
    const serverFunction = function(req, res) {
      const protocol = Number(req.headers.host.split(':')[1]) == PORT_HTTP ? 'http://' : 'https://'; 
      const data = {
        url: protocol + req.headers.host + req.url,
        method: req.method,
      }
      if (req.method == 'GET' && req.url === '/') {
        data.message = 'hello world';
        res.statusCode = 200;
      }
      if (req.method == 'GET' && req.url === '/get') {
        res.statusCode = 200;
      }
      if (req.method == 'GET' && req.url === '/status/404') {
        res.statusCode = 404;
      }
      if (req.method == 'POST' && req.url === '/post') {
        res.statusCode = 200;
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    }
    const server = http.createServer(serverFunction);
    server.listen(PORT_HTTP, () => {
      log('Ready on http://localhost:' + PORT_HTTP);
    });
    const httpsServer = https.createServer(options, serverFunction);
    httpsServer.listen(PORT_HTTPS, () => {
        log('Ready on https://localhost:' + PORT_HTTPS);
    })

    // http.createServer(serverFunction).listen(PORT_HTTP, () => {
    //   log('Ready on http://localhost:' + PORT_HTTP);
    // });
    // https.createServer(options, serverFunction).listen(PORT_HTTPS, () => {
    //   log('Ready on https://localhost:' + PORT_HTTPS);
    // });
    `,
    { eval: true, workerData: { options } }
  );

  worker.on('error', (err) => {
    log(`Error occured on Worker config server : ${err.message}, stack = ${err.stack} `);
  });
}
