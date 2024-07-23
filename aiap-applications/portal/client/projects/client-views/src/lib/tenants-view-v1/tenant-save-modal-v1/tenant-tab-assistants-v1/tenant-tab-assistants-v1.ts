/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, ViewChild, Output, EventEmitter, Input, OnInit } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
} from 'client-shared-services';

import {
  BaseView
} from 'client-shared-views';

import {
  TenantAssistantsDeleteModalV1,
} from './tenant-assistants-delete-modal-v1/tenant-assistants-delete-modal-v1';

import {
  TenantAssistantsSaveModalV1,
} from './tenant-assistants-save-modal-v1/tenant-assistants-save-modal-v1';

@Component({
  selector: 'aiap-tenant-tab-assistants-v1',
  templateUrl: './tenant-tab-assistants-v1.html',
  styleUrls: ['./tenant-tab-assistants-v1.scss'],
})
export class TenantTabAssistantsV1 extends BaseView implements OnInit {

  static getClassName() {
    return 'TenantTabAssistantsV1';
  }

  @ViewChild('tenantAssistantsDeleteModal') tenantAssistantsDeleteModal: TenantAssistantsDeleteModalV1;
  @ViewChild('tenantAssistantsSaveModal') tenantAssistantsSaveModal: TenantAssistantsSaveModalV1;

  page: number;

  @Input() assistants: Array<any>;
  @Output() assistantsChange = new EventEmitter<any[]>();

  constructor(
    private ActivatedRouteServiceV1: ActivatedRouteServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToQueryParams();
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  private subscribeToQueryParams() {
    this.ActivatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(TenantTabAssistantsV1.getClassName(), 'subscribeToQueryParams',
          {
            params,
          });

        if (
          params.page
        ) {
          this.page = Number(params.page);
        }
      });
  }

  handleAssistantAddEvent(assistant: any) {
    _debugX(TenantTabAssistantsV1.getClassName(), 'handleAssistantAddEvent',
      {
        assistant,
      });

    const NEW_ASSISTANTS = lodash.cloneDeep(this.assistants);
    this.checkForExistingAssistant(NEW_ASSISTANTS, assistant);
    this.assistantsChange.emit(NEW_ASSISTANTS);
  }

  handleAssistantRemoveEvent(assistants: any) {
    _debugX(TenantTabAssistantsV1.getClassName(), 'handleAssistantsDeleteEvent',
      {
        assistants,
      });

    const CURRENT_ASSISTANTS = lodash.cloneDeep(this.assistants);
    const NEW_ASSISTANTS = CURRENT_ASSISTANTS.filter(item => !assistants.includes(item.id))
    this.assistantsChange.emit(NEW_ASSISTANTS);
  }

  checkForExistingAssistant(existingAssistants, assistant) {
    if (
      lodash.isArray(existingAssistants) &&
      !lodash.isEmpty(assistant)
    ) {
      const IS_ASSISTANT_EXISTS = existingAssistants.some((existingAssistant) => existingAssistant?.id === assistant?.id);
      if (IS_ASSISTANT_EXISTS) {
        const EXISTING_ASSISTANT_INDEX = existingAssistants.findIndex((existingAssistant) => existingAssistant?.id === assistant?.id);
        existingAssistants[EXISTING_ASSISTANT_INDEX] = assistant;
      } else {
        existingAssistants.push(assistant);
      }
    }
  }

  handleAssistantDeleteEvent(event: any) {
    _debugX(TenantTabAssistantsV1.getClassName(), 'handleAssistantDeleteEvent',
      {
        this_assistants: this.assistants,
        event,
      });

    const ASSISTANT_ID = event?.item?.id;
    if (
      lodash.isString(ASSISTANT_ID) &&
      !lodash.isEmpty(ASSISTANT_ID) &&
      lodash.isArray(this.assistants) &&
      !lodash.isEmpty(this.assistants)
    ) {
      const ASSISTANTS = [];
      for (const ASSISTANT of this.assistants) {
        if (
          ASSISTANT_ID !== ASSISTANT?.id
        ) {
          ASSISTANTS.push(ASSISTANT);
        }
      }
      this.assistantsChange.emit(ASSISTANTS);
    }
  }

  handleAssistantDeleteModal(tenant) {
    this.tenantAssistantsDeleteModal.show(tenant);
  }

  showSaveAssistantModal(input: any = undefined) {
    const TMP_ASSISTANT = input;
    _debugX(TenantTabAssistantsV1.getClassName(), 'showSaveAssistantModal',
      {
        TMP_ASSISTANT,
      });

    const ASSISTANT = TMP_ASSISTANT?.value;
    this.tenantAssistantsSaveModal.show(ASSISTANT);
  }

}
