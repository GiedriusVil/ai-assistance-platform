/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import lodash from 'lodash';

import {
  _debugX,
  StripTextPipe,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseChangesViewV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import {
  EngagementChangesViewModalV1,
} from '../components';

@Component({
  selector: 'aiap-engagements-changes-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
  providers: [StripTextPipe]
})
export class EngagementsChangesViewV1 extends BaseChangesViewV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'EngagementsChangesViewV1';
  }

  @ViewChild('engagementChangesViewModal') engagementChangesViewModal: EngagementChangesViewModalV1;

  outlet = OUTLETS.tenantCustomizer;

  _state: any = {
    query: {
      type: DEFAULT_TABLE.ENGAGEMENTS_CHANGES_V1.TYPE,
      filter: {
        dateRange: {},
        search: '',
      },
      sort: DEFAULT_TABLE.ENGAGEMENTS_CHANGES_V1.SORT,
    },
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    protected eventsService: EventsServiceV1,
    protected queryService: QueryServiceV1,
    protected timezoneService: TimezoneServiceV1,
  ) {
    super(
      eventsService,
      queryService,
      timezoneService,
    );
  }

  ngOnInit() {
    this.superNgOnInit();
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    this.superNgAfterViewInit();
  }

  protected getState() {
    return this.state;
  }

  protected getChangesViewModal(): { show(value: any): void; } {
    return this.engagementChangesViewModal;
  }
}
