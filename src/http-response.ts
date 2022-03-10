import type { IncomingHttpHeaders } from 'http';

/** minimal version of `http.IncomingMessage` */
export interface HttpResponse {
  statusCode: number;
  statusMessage: string;
  headers: IncomingHttpHeaders;
  data: any;
}
