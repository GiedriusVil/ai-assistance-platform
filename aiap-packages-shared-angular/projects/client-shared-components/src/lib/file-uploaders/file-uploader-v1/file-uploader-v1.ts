/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

@Component({
  selector: 'aiap-file-uploader-v1',
  templateUrl: './file-uploader-v1.html',
  styleUrls: ['./file-uploader-v1.scss']
})
export class FileUploaderV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'FileUploaderV1';
  }

  @Output() onFileUploaded: EventEmitter<any> = new EventEmitter();

  accept: [".json"];

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService
  ) { }

  ngOnInit() { }

  ngAfterViewInit(): void { }

  ngOnDestroy() { }

  hanldeFileUploadError(error: any) {
    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: 'File upload error!',
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  onFilesAdded(event: any) {
    _debugX(FileUploaderV1.getClassName(), 'onFilesAdded', { event });
    this.onFileUploaded.emit(event);
  }

}
