/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';


import {
  _debugX,
} from 'client-shared-utils';

@Injectable()
export class HTTPGenericInterceptor implements HttpInterceptor {

  static getClassName() {
    return 'HTTPGenericInterceptor';
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    _debugX(HTTPGenericInterceptor.getClassName(), 'intercept', { request });

    const RET_VAL = next.handle(request);
    return RET_VAL;
  }



}
