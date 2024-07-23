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
  TilesModelChangeViewModalV1,
} from '../components';

@Component({
  selector: 'aiap-tiles-models-changes-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
  providers: [StripTextPipe],
})
export class TilesModelsChangesViewV1 extends BaseChangesViewV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'TilesModelsChangesViewV1';
  }

  @ViewChild('tilesModelChangeViewModalV1') tilesModelChangesViewV1: TilesModelChangeViewModalV1;

  outlet = OUTLETS.liveAnalytics;

  _state: any = {
    query: {
      type: DEFAULT_TABLE.FILTERS_MODELS_CHANGES_V1.TYPE,
      filter: {
        dateRange: {},
        search: '',
      },
      sort: DEFAULT_TABLE.FILTERS_MODELS_CHANGES_V1.SORT,
    }
  };
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
    return this.tilesModelChangesViewV1;
  }


}
