/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import { catchError, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import { NotificationService } from 'client-shared-carbon';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services'

import {
  BaseComponentV1,
} from 'client-shared-components';

import {
  TENANTS_MESSAGES,
} from 'client-utils';

import {
  TenantsServiceV1,
} from 'client-services';


@Component({
  selector: 'aiap-tenants-dropdown-v1',
  templateUrl: './tenants-dropdown-v1.html',
  styleUrls: ['./tenants-dropdown-v1.scss'],
})
export class TenantsDropDownV1 extends BaseComponentV1 implements OnInit, OnChanges, OnDestroy {

  static getClassName() {
    return 'TenantsDropDownV1';
  }

  @Input() value;
  @Output() valueChange = new EventEmitter<any>();

  _selection = {
    tenants: [],
    tenant: undefined,
  }
  selection = lodash.cloneDeep(this._selection);

  constructor(
    protected notificationService: NotificationService,
    protected eventsService: EventsServiceV1,
    protected tenantsService: TenantsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    super.superNgOnInit(this.eventsService);
    this.loadTenants();
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(TenantsDropDownV1.getClassName(), 'ngOnChanges',
      {
        changes,
        this_value: this.value,
      });
  }

  ngOnDestroy(): void {
    super.superNgOnDestroy();
  }

  loadTenants() {
    const TENANTS_QUERY = {
      sort: {
        field: 'name',
        direction: 'asc'
      },
      pagination: {
        page: 1,
        size: 1000
      }
    };
    this.isLoading = true;
    this.tenantsService.findManyByQuery(TENANTS_QUERY).pipe(
      catchError((error) => this.handleFindManyByQueryError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(TenantsDropDownV1.getClassName(), 'loadTenants',
        {
          response,
        });

      const NEW_SELECTION = lodash.cloneDeep(this.selection);
      const TENANTS = this._transformTenants(response?.items);
      NEW_SELECTION.tenants = TENANTS;
      this.selection = NEW_SELECTION;
      this.isLoading = false;
    });
  }

  handleSelectionEvent(event: any) {
    _debugX(TenantsDropDownV1.getClassName(), 'handleSelectionEvent',
      {
        event: event,
        this_selection: this.selection
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
  }

  private _transformTenants(items: Array<any>) {
    const RET_VAL = [];
    if (
      items &&
      items.length > 0
    ) {
      for (const ITEM of items) {
        RET_VAL.push({
          content: `[${ITEM?.environment?.id}] ${ITEM.name}`,
          value: ITEM,
        });
      }
    }
    return RET_VAL;
  }

  private handleFindManyByQueryError(error: any) {
    _errorX(TenantsDropDownV1.getClassName(), 'handleFindManyByQueryError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    const NOTIFICATION = TENANTS_MESSAGES.ERROR.FIND_MANY_BY_QUERY;
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

}
