/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';

import { NotificationService } from 'client-shared-carbon';

import * as lodash from 'lodash';

import {
  BaseModal
} from 'client-shared-views';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-tenant-assistants-save-modal-v1',
  templateUrl: './tenant-assistants-save-modal-v1.html',
  styleUrls: ['./tenant-assistants-save-modal-v1.scss'],
})
export class TenantAssistantsSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'TenantAssistantsSaveModalV1';
  }

  @Output() onAddAssistant = new EventEmitter<any>();

  _assistant = {
    id: undefined,
    name: undefined,
    description: undefined,
  }
  assistant = lodash.cloneDeep(this._assistant);

  constructor(
    private notificationService: NotificationService,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  save() {
    const ASSISTANT = {
      id: this.assistant.id,
      name: this.assistant.name,
      description: this.assistant.description
    };
    const NOTIFICATION = {
      type: 'success',
      title: 'Assistant saved',
      target: '.notification-container',
      duration: 10000
    }
    this.onAddAssistant.emit(ASSISTANT);
    this.notificationService.showNotification(NOTIFICATION);
    this.close();
  }

  show(assistant: any) {
    if (
      assistant
    ) {
      this.assistant = assistant;
    } else {
      this.assistant = lodash.cloneDeep(this._assistant);
    }
    super.superShow();
  }
}


