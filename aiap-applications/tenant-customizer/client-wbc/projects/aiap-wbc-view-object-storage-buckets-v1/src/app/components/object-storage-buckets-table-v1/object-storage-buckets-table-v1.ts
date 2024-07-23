/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  TemplateRef,
} from '@angular/core';

import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugW,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  QueryServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseTableV1,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  ObjectStorageBucketsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-object-storage-buckets-table-v1',
  templateUrl: './object-storage-buckets-table-v1.html',
  styleUrls: ['./object-storage-buckets-table-v1.scss'],
})
export class ObjectStorageBucketsTableV1 extends BaseTableV1 implements OnInit, AfterViewInit {

  static getClassName() {
    return 'ObjectStorageBucketsTableV1';
  }

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState = false;

  _state: any = {
    search: '',
    query: {
      type: DEFAULT_TABLE.OBJECT_STORAGE_BUCKETS_V1.TYPE,
      sort: DEFAULT_TABLE.OBJECT_STORAGE_BUCKETS_V1.SORT,
    }
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    // params-super
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    // params-native
    private notificationService: NotificationService,
    private timezoneService: TimezoneServiceV1,
    private translateService: TranslateHelperServiceV1,
    private objectStorageBucketsService: ObjectStorageBucketsServiceV1,
  ) {
    super(
      sessionService,
      queryService,
      eventsService,
    );
  }

  ngOnInit() {
    super.setQueryType(this.state?.query?.type);
    this.queryService.setSort(this.state?.query?.type, this.state?.query?.sort);

    const QUERY = this.queryService.query(this.state?.query?.type);
    this.state.search = QUERY?.filter?.search || '';

    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state?.query?.type);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(query => {
        if (query) {
          defaultQuery = query;
        }
        return this.objectStorageBucketsService.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindAnswersByQueryError(error))
        );
      }
      ),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugW(ObjectStorageBucketsTableV1.getClassName(), `addFilterEventHandler`,
        {
          response
        });

      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];

    // TABLE_HEADER.push(new TableHeaderItem({
    //   data: this.translateService.instant(
    //     'object_storage_buckets_table_v1.col_id.header'
    //   ),
    //   field: 'id',
    //   // style: {
    //   //   width: '25%'
    //   // }
    // }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant(
        'object_storage_buckets_table_v1.col_reference.header'
      ),
      field: 'reference',
      // style: {
      //   width: "25%"
      // }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant(
        'object_storage_buckets_table_v1.col_external_name.header'
      ),
      field: 'external.name',
      // style: {
      //   width: "25%"
      // }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant(
        'object_storage_buckets_table_v1.col_size_qty.header'
      ),
      field: 'sizeQty',
      // style: {
      //   width: "25%"
      // }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant(
        'object_storage_buckets_table_v1.col_size_weight.header'
      ),
      field: 'sizeWeight',
      // style: {
      //   width: "25%"
      // }
    }));
    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant(
          'object_storage_buckets_table_v1.col_created.header'
        ),
        field: 'created.date',
        style: {
          width: '14%',
        },
      })
    );
    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant(
          'object_storage_buckets_table_v1.col_updated.header'
        ),
        field: 'updated.date',
        style: {
          width: '14%',
        },
      })
    );

    this.model.header = TABLE_HEADER
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];

    // RET_VAL.push(new TableItem({
    //   data: item?.id,
    //   raw: item,
    // }));
    RET_VAL.push(new TableItem({
      data: item?.reference,
    }));
    RET_VAL.push(new TableItem({
      data: item?.external?.name,
    }));
    RET_VAL.push(new TableItem({
      data: item?.sizeQty,
    }));
    RET_VAL.push(new TableItem({
      data: Math.round((item?.sizeWeight * 100) / (1024 * 1024)) / 100, // Converstion to Mb
    }));
    RET_VAL.push(new TableItem({
      data: item,
      template: this.createdTemplate,
    }));
    RET_VAL.push(new TableItem({
      data: item,
      template: this.updatedTemplate,
    }));

    return RET_VAL;
  }

  handleFindAnswersByQueryError(
    error: any,
  ) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: 'Unable to retrieve object storage buckets!',
      target: '.notification-container',
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  handleEventSearchChange(event: any) {
    this.queryService.setFilterItem(
      this.state.queryType,
      QueryServiceV1.FILTER_KEY.SEARCH,
      event
    );
    this.eventsService.filterEmit(
      this.queryService.query(this.state.queryType)
    );
    _debugW(ObjectStorageBucketsTableV1.getClassName(), `handleEventSearchChange`,
      {
        event,
      });
  }

  handleEventSearchClear(event: any) {
    this.queryService.deleteFilterItems(
      this.state.queryType,
      QueryServiceV1.FILTER_KEY.SEARCH
    );
    this.eventsService.filterEmit(
      this.queryService.query(this.state.queryType)
    );
    _debugW(ObjectStorageBucketsTableV1.getClassName(), `handleEventSearchClear`,
      {
        event,
      });
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  emitSearchPlace(event) {
    this.onSearchPlace.emit(event);
  }

  emitClearPlace(event) {
    this.onClearPlace.emit(event)
  }

}
