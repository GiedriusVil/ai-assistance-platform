/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class EventsServiceV1 {

  public eventsEmitter: Subject<any> = new Subject<any>();

  constructor() { }

  eventEmit(value: any) {
    this.eventsEmitter.next(value);
  }
}
