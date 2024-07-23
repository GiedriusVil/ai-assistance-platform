/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IncomingHttpHeaders,
  OutgoingHttpHeaders
} from 'http';

declare module '@ibm-aca/aca-wrapper-http' {
  interface AcaHttpRequest {
    url: string,
    body?: object | string,
    headers?: OutgoingHttpHeaders,
    queryParams?: object,
    options?: {
      retry?: number,
      timeout?: number
    }
  }

  interface AcaHttpResponse {
    body: any,
    statusCode: number,
    statusMessage: string,
    status: {
      code: number,
      message: string
    }
    headers: IncomingHttpHeaders
  }

  export function execHttpDeleteRequest(context: any, params: AcaHttpRequest, additionalOptions: any = {}): AcaHttpResponse;
  export function execHttpGetRequest(context: any, params: AcaHttpRequest, additionalOptions: any = {}): AcaHttpResponse;
  export function execHttpPostRequest(context: any, params: AcaHttpRequest, additionalOptions: any = {}): AcaHttpResponse;
  export function execHttpPutRequest(context: any, params: AcaHttpRequest, additionalOptions: any = {}): AcaHttpResponse;
}
