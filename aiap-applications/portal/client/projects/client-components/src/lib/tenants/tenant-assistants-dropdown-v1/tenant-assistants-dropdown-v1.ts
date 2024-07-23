/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';

import { NotificationService } from 'client-shared-carbon';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  SessionServiceV1,
} from 'client-shared-services';

import {
  BaseComponentV1,
} from 'client-shared-components';

@Component({
  selector: 'aiap-tenant-assistants-dropdown-v1',
  templateUrl: './tenant-assistants-dropdown-v1.html',
  styleUrls: ['./tenant-assistants-dropdown-v1.scss'],
})
export class TenantAssistantsDropdownV1 extends BaseComponentV1 implements OnInit, OnChanges, OnDestroy {

  static getClassName() {
    return 'TenantAssistantsDropdownV1';
  }

  @Input() value;
  @Input() tenant;
  @Output() valueChange = new EventEmitter<any>();

  @Output() onChange = new EventEmitter<any>();

  _selection = {
    assistants: [],
    assistant: undefined,
  }
  selection = lodash.cloneDeep(this._selection);

  constructor(
    protected notificationService: NotificationService,
    protected eventsService: EventsServiceV1,
    protected sessionService: SessionServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    super.superNgOnInit(this.eventsService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(TenantAssistantsDropdownV1.getClassName(), 'ngOnChanges',
      {
        changes: changes,
        this_value: this.value,
        this_tenant: this.tenant,
      });

    this.loadAssistants();
  }

  ngOnDestroy(): void {
    super.superNgOnDestroy();
  }

  loadAssistants() {
    this.isLoading = true;
    const NEW_SELECTION = lodash.cloneDeep(this.selection);
    const ASSISTANTS = this._transformAssistants(this.tenant?.assistants);
    _debugX(TenantAssistantsDropdownV1.getClassName(), 'loadAssistants',
      {
        ASSISTANTS,
      });

    NEW_SELECTION.assistants = ASSISTANTS;
    this.selection = NEW_SELECTION;
    this.isLoading = false;
  }

  handleSelectionEvent(event: any) {
    _debugX(TenantAssistantsDropdownV1.getClassName(), 'handleSelectionEvent',
      {
        event: event,
        this_selection: this.selection,
      });

    let newValue;
    if (
      !lodash.isEmpty(event?.item?.value)
    ) {
      newValue = lodash.cloneDeep(event?.item?.value);
    }
    delete newValue.selected;
    delete newValue.content;
    this.valueChange.emit(newValue);
    this.onChange.emit();
  }

  private _transformAssistants(items: Array<any>) {
    const RET_VAL = [];
    if (
      items &&
      items.length > 0
    ) {
      for (const ITEM of items) {
        RET_VAL.push({
          content: `${ITEM.name}`,
          value: ITEM,
        });
      }
    }
    return RET_VAL;
  }

}
