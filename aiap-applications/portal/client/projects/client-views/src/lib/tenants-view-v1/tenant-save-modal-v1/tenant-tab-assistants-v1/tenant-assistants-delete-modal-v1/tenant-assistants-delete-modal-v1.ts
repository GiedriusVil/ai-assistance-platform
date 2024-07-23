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

import * as lodash from 'lodash';

import {
  NotificationService
} from 'client-shared-carbon';

import {
  BaseModal
} from 'client-shared-views';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

@Component({
  selector: 'aiap-tenant-assistants-delete-modal-v1',
  templateUrl: './tenant-assistants-delete-modal-v1.html',
  styleUrls: ['./tenant-assistants-delete-modal-v1.scss']
})
export class TenantAssistantsDeleteModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'TenantAssistantsDeleteModalV1';
  }

  @Output() onRemoveAssistants = new EventEmitter<any>();

  selectedAssistant;

  _assistants: any = [];
  assistants: any = lodash.cloneDeep(this._assistants);

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService
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
    //
  }

  handleDeleteManyByIds() {
    _debugX(TenantAssistantsDeleteModalV1.getClassName(), 'handleDeleteManyByIds',
      {
        assistants: this.assistants,
      });

    this.onRemoveAssistants.emit(this.assistants);
    const NOTIFICATION = {
      type: 'success',
      title: 'Assistants were deleted',
      target: '.notification-container',
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    this.eventsService.filterEmit(undefined);
    this.close();
  }

  show(tenants: Array<any>) {
    _debugX(TenantAssistantsDeleteModalV1.getClassName(), 'show',
      {
        tenants
      });

    if (
      !lodash.isEmpty(tenants)
    ) {
      this.assistants = lodash.cloneDeep(tenants);
      this.superShow();
    }
  }

}
