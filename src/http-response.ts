import type { IncomingHttpHeaders } from 'http';

/** minimal version of `http.IncomingMessage` */
export interface HttpResponse {
  statusCode: number;
  statusMessage: string;
  headers: IncomingHttpHeaders;
  data: string;
  error?: HttpErrorResponse;
}

export interface HttpErrorResponse {
  errno: number;
  code: string;
  syscall: string;
  address?: string;
  port?: number;
}
