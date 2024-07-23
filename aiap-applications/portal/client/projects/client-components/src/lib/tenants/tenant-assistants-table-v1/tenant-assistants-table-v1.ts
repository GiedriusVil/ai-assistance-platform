/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  Input,
  OnChanges,
} from '@angular/core';

import { of } from 'rxjs';

import {
  TableItem,
  TableHeaderItem,
  NotificationService
} from 'client-shared-carbon';

import {
  _errorX
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseTable,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
  ASSISTANTS_MESSAGES,
} from 'client-utils';


@Component({
  selector: 'aiap-tenant-assistants-table-v1',
  templateUrl: './tenant-assistants-table-v1.html',
  styleUrls: ['./tenant-assistants-table-v1.scss'],
})
export class TenantAssistantsTableV1 extends BaseTable implements OnInit, OnChanges {

  static getClassName() {
    return 'TenantAssistantsTableV1';
  }

  @Input('assistants') assistants: Array<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  skeletonState = false;

  state: any = {
    queryType: DEFAULT_TABLE.TENANT_ASSISTANTS.TYPE,
    defaultSort: DEFAULT_TABLE.TENANT_ASSISTANTS.SORT,
    search: '',
  };

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    private notificationService: NotificationService,
    protected eventsService: EventsServiceV1,
    private timezoneService: TimezoneServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    this.state.search = this.queryService.getSearchValue(this.state.queryType);
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  ngOnChanges() {
    super.ensureModelExistance();
    this.response = {
      items: this.assistants,
      total: this.assistants.length
    }
    super.refreshTableModel();
  }
  constructTableHeader() {
    const TABLE_HEADER = [];

    TABLE_HEADER.push(new TableHeaderItem({
      data: 'ID',
      field: 'id',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Name",
      field: 'name',
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: "Description",
      field: 'description',
    }));

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];

    RET_VAL.push(new TableItem({ data: item?.id }));
    RET_VAL.push(new TableItem({ data: item?.name }));
    RET_VAL.push(new TableItem({ data: item?.description }));

    return RET_VAL;
  }

  addFilterEventHandler() {
    //
  }

  handleFindManyByQueryError(error) {
    _errorX(TenantAssistantsTableV1.getClassName(), `handleFindManyByQueryError`,
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ASSISTANTS_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'assistants.view.edit' });
    return RET_VAL;
  }
}
