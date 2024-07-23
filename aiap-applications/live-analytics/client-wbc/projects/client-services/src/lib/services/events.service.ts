/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import {
  _debugX,
} from 'client-utils';

@Injectable()
export class EventsServiceV1 {

  static getClassName() {
    return 'EventsService';
  }

  public filterEmitter: Subject<any> = new Subject<any>();
  public refreshModalEmitter: Subject<any> = new Subject<any>();


  // Review next!
  public loadingEmitter: Subject<any> = new Subject<any>();
  public smallLoadingEmitter: Subject<any> = new Subject<any>();

  public modalFilterEmitter: Subject<any> = new Subject<any>();

  public toastEmitter: Subject<any> = new Subject<any>();
  public chatEmitter: Subject<any> = new Subject<any>();
  public widgetEmitter: Subject<any> = new Subject<any>();

  public emitterWindowEvents: Subject<any> = new Subject<any>();

  constructor() {
    //
  }

  filterEmit(values: any) {
    this.filterEmitter.next(values);
  }

  refreshModalEmit(event: any) {
    this.refreshModalEmitter.next(event);
  }

  // Refresh next ones

  toastEmit(values: any) {
    this.toastEmitter.next(values);
  }

  loadingEmit(visible: boolean) {
    this.loadingEmitter.next(visible);
  }

  loadingSmallEmit(v) {
    this.smallLoadingEmitter.next(v);
  }

  modalFilterEmit(query: any) {
    this.modalFilterEmitter.next(query);
  }

  widgetEmit(values: any) {
    this.widgetEmitter.next(values);
  }

  chatEmit(values: any) {
    this.chatEmitter.next(values);
  }

  emitWindowEvent(event: any) {
    this.emitterWindowEvents.next(event);
  }


  static EVENT_TYPE = {
    EVENT_WINDOW_RESIZE: 'EVENT_WINDOW_RESIZE'
  }

}
