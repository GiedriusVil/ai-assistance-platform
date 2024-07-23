/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';
import { Subject } from 'rxjs';

@Injectable()
export class ZoomServiceV1 {

  static getClassName() {
    return 'ZoomServiceV1';
  }

  public zoomEmitter:Subject<any> = new Subject();

  constructor(
    private router: Router,
    private sessionService: SessionServiceV1,
  ) { }

  adjustZoom(zoomLevel:string){

    this.zoomEmitter.next(zoomLevel)

  }

}

