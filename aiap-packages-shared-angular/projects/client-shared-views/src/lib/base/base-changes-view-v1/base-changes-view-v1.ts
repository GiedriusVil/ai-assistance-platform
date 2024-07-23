/*
  © Copyright IBM Corporation 2022. All Rights Reserved 

  SPDX-License-Identifier: EPL-2.0
*/
import {
  BaseViewV1,
} from '../base-view-v1/base-view-v1';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

export abstract class BaseChangesViewV1 extends BaseViewV1 {

  static getClassName() {
    return 'BaseChangesViewV1';
  }

  constructor(
    protected eventsService: EventsServiceV1,
    protected queryService: QueryServiceV1,
    protected timezoneService: TimezoneServiceV1,
  ) {
    super();
  }

  superNgOnInit() {
    const STATE = this.getState();

    this.queryService.setSort(
      STATE.query.type,
      STATE.query.sort,
    );

    const QUERY = this.queryService.query(STATE.query.type);

    this.queryService.setPagination(
      STATE.query.type,
      QUERY.pagination
    );

    STATE.query.filter.search = QUERY?.filter?.search;
    STATE.query.filter.dateRange = QUERY?.filter?.dateRange;

    _debugX(BaseChangesViewV1.getClassName(), `superNgOnInit`,
      {
        QUERY,
        STATE,
      });
  }

  superNgAfterViewInit() {
    const STATE = this.getState();
    const QUERY = this.queryService.query(STATE.query.type);

    _debugX(BaseChangesViewV1.getClassName(), `superNgAfterViewInit`,
      {
        QUERY,
        STATE,
      });

    this.eventsService.filterEmit(QUERY);
  }

  protected handleEventDateRangeChange(range: any) {
    const STATE = this.getState();
    _debugX(BaseChangesViewV1.getClassName(), `handleEventDateRangeChange`,
      {
        range,
        STATE,
      });

    this.queryService.setFilterItem(
      STATE.query.type,
      QueryServiceV1.FILTER_KEY.DATE_RANGE,
      range,
    );

    const QUERY = this.queryService.query(STATE.query.type);
    _debugX(BaseChangesViewV1.getClassName(), `handleEventDateRangeChange`,
      {
        QUERY,
      });

    this.eventsService.filterEmit(QUERY);
  }

  protected handleEventShowTransaction(event: any) {
    _debugX(BaseChangesViewV1.getClassName(), `handleEventShowTransaction`,
      {
        event,
      });

    const CHANGES_VIEW_MODAL = this.getChangesViewModal();
    CHANGES_VIEW_MODAL.show(event?.value);
  }

  protected handleEventSearchChange(event: any) {
    const STATE = this.getState();
    _debugX(BaseChangesViewV1.getClassName(), `handleEventSearchChange`,
      {
        STATE,
        event,
      });

    this.queryService.setFilterItem(
      STATE.query.type,
      QueryServiceV1.FILTER_KEY.SEARCH,
      event,
    );
    const QUERY = this.queryService.query(STATE.query.type);
    _debugX(BaseChangesViewV1.getClassName(), `handleEventSearchChange`,
      {
        QUERY,
      });

    this.eventsService.filterEmit(QUERY);
  }

  protected handleEventSearchClear(event: any) {
    const STATE = this.getState();
    _debugX(BaseChangesViewV1.getClassName(), `handleEventSearchClear`,
      {
        STATE,
        event,
      });

    this.queryService.deleteFilterItems(
      STATE.query.type,
      QueryServiceV1.FILTER_KEY.SEARCH,
    );

    const QUERY = this.queryService.query(STATE.query.type);
    _debugX(BaseChangesViewV1.getClassName(), `handleEventSearchClear`,
      {
        QUERY,
      });

    this.eventsService.filterEmit(QUERY);
  }

  protected abstract getState(): any;

  protected abstract getChangesViewModal(): {
    show(value: any): void,
  };

}
