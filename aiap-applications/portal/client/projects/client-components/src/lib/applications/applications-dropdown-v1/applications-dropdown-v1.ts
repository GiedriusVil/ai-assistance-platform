/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import { of } from 'rxjs';

import { NotificationService } from 'client-shared-carbon';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  BaseComponentV1,
} from 'client-shared-components';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  APPLICATIONS_MESSAGES,
} from 'client-utils';

import {
  ApplicationsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-applications-dropdown-v1',
  templateUrl: './applications-dropdown-v1.html',

  styleUrls: ['./applications-dropdown-v1.scss'],
})
export class ApplicationsDropdownV1 extends BaseComponentV1 implements OnInit, OnChanges, OnDestroy {

  static getClassName() {
    return 'ApplicationsDropdownV1';
  }

  @Input() application;

  @Input() value;
  @Output() valueChange = new EventEmitter<any>();

  _selection = {
    views: [],
    view: undefined,
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(ApplicationsDropdownV1.getClassName(), 'ngOnChanges',
      {
        changes,
        this_value: this.value,
        this_application: this.application,
      });
    if (
      changes?.application
    ) {
      const NEW_SELECTION = lodash.cloneDeep(this._selection);
      const VIEWS = this._transformViews(this.application?.configuration?.views);
      NEW_SELECTION.views = VIEWS;
      this.selection = NEW_SELECTION;
    }
  }

  private _transformViews(views: Array<any>) {
    _debugX(ApplicationsDropdownV1.getClassName(), '_transformViews',
      {
        views,
      });

    const RET_VAL = [];
    if (
      views &&
      views.length > 0
    ) {
      for (const VIEW of views) {
        const VIEW_CHILDS = VIEW?.views;
        if (
          !lodash.isEmpty(VIEW_CHILDS) &&
          lodash.isArray(VIEW_CHILDS)
        ) {
          for (const VIEW_CHILD of VIEW_CHILDS) {
            if (
              !lodash.isEmpty(VIEW_CHILD?.name)
            ) {
              RET_VAL.push({
                content: `${VIEW?.name} / ${VIEW_CHILD?.name}`,
                value: VIEW_CHILD
              });
            }
          }
        } else {
          if (
            !lodash.isEmpty(VIEW?.name)
          ) {
            RET_VAL.push({
              content: `${VIEW?.name}`,
              value: VIEW,
            });
          }
        }
      }
    }
    return RET_VAL;
  }

  ngOnDestroy(): void {
    super.superNgOnDestroy();
  }

  handleSelectionEvent(event: any) {
    _debugX(ApplicationsDropdownV1.getClassName(), 'handleSelectionEvent',
      {
        event: event,
        this_selection: this.selection,
      });

    let newValue;
    if (
      !lodash.isEmpty(event?.item)
    ) {
      newValue = lodash.cloneDeep(event?.item?.value);
      newValue.name = event?.item?.content;
    }
    delete newValue.selected;
    delete newValue.content;
    this.valueChange.emit(newValue);
  }

  private handleFindManyByQueryError(error: any) {
    _errorX(ApplicationsDropdownV1.getClassName(), 'handleFindManyByQueryError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    const NOTIFICATION = APPLICATIONS_MESSAGES.ERROR.FIND_MANY_BY_QUERY;
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

}
