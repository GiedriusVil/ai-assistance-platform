/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { NotificationService } from 'client-shared-carbon';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  BaseComponentV1,
} from 'client-shared-components';

import {
  APPLICATIONS_MESSAGES,
} from 'client-utils';

import {
  ApplicationsServiceV1,
} from 'client-services';


@Component({
  selector: 'aiap-tenant-applications-dropdown-v1',
  templateUrl: './tenant-applications-dropdown-v1.html',
  styleUrls: ['./tenant-applications-dropdown-v1.scss'],
})
export class TenantApplicationsDropdownV1 extends BaseComponentV1 implements OnInit, OnChanges, OnDestroy {

  static getClassName() {
    return 'TenantApplicationsDropdownV1';
  }

  @Input() disabled;

  @Input() value;
  @Output() valueChange = new EventEmitter<any>();

  @Output() onChange = new EventEmitter<any>();

  _selection = {
    applications: [],
    application: undefined,
  }
  selection = lodash.cloneDeep(this._selection);

  constructor(
    protected notificationService: NotificationService,
    protected eventsService: EventsServiceV1,
    protected applicationService: ApplicationsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    super.superNgOnInit(this.eventsService);
    this.loadApplications();
  }

  ngOnDestroy(): void {
    super.superNgOnDestroy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //
  }

  loadApplications() {
    const QUERY = {
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
    this.applicationService.findManyByQuery(QUERY).pipe(
      catchError((error) => this.handleFindManyByQueryError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(TenantApplicationsDropdownV1.getClassName(), 'loadApplications',
        {
          response,
        });

      const NEW_SELECTION = lodash.cloneDeep(this._selection);
      const APPLICATIONS = this._transformApplications(response?.items);
      NEW_SELECTION.applications = APPLICATIONS;
      this.selection = NEW_SELECTION;
      this.isLoading = false;
    });
  }

  handleSelectionEvent(event: any) {
    _debugX(TenantApplicationsDropdownV1.getClassName(), 'handleSelectionEvent',
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
    this.onChange.emit(newValue);
  }

  private _transformApplications(items: Array<any>) {
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

  private handleFindManyByQueryError(error: any) {
    _errorX(TenantApplicationsDropdownV1.getClassName(), 'handleFindManyByQueryError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    const NOTIFICATION = APPLICATIONS_MESSAGES.ERROR.FIND_MANY_BY_QUERY;
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

}
