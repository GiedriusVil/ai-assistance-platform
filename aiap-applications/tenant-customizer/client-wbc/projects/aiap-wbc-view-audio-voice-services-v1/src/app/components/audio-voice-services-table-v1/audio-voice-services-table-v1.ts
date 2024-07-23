/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit, ViewChild, TemplateRef, OnChanges, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  TableHeaderItem,
  TableItem,
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  AUDIO_VOICE_SERVICES_MESSAGES
} from 'client-utils';

import {
  AudioVoiceServiceV1,
} from 'client-services';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services'

import {
  BaseTableV1,
} from 'client-shared-components';


@Component({
  selector: 'aiap-audio-voice-services-table-v1',
  templateUrl: './audio-voice-services-table-v1.html',
  styleUrls: ['./audio-voice-services-table-v1.scss'],
})
export class AudioVoiceServicesTableV1 extends BaseTableV1 implements OnInit, OnChanges, AfterViewInit {

  static getClassName() {
    return 'AudioVoiceServicesTableV1';
  }

  @Input() config;

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;
  @ViewChild('jobDateTemplate', { static: true }) jobDateTemplate: TemplateRef<any>;

  @Output() onShowExecutePlace = new EventEmitter<any>();
  @Output() onShowResultPlace = new EventEmitter<any>();


  isActionsClickAllowed = false;
  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  state: any = {
    queryType: DEFAULT_TABLE.AUDIO_VOICE_SERVICES_V1.TYPE,
    defaultSort: DEFAULT_TABLE.AUDIO_VOICE_SERVICES_V1.SORT,
    search: '',
  };

  selectedRows: Array<any> = [];

  constructor(
    private notificationService: NotificationService,
    private audioVoiceService: AudioVoiceServiceV1,
    protected eventsService: EventsServiceV1,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.setSearch();
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  ngOnChanges() {
  }

  _isEmpty(data) {
    return lodash.isEmpty(data);
  }

  setSearch() {
    const QUERY = this.queryService.query(this.state.queryType);
    this.state.search = QUERY?.filter?.search || '';
  }
  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        _debugX(AudioVoiceServicesTableV1.getClassName(), `addFilterEventHandler`, { query });
        if (query) {
          defaultQuery = query;
        }
        return this.audioVoiceService.findManyByQuery(defaultQuery).pipe(
          catchError((error: any) => this.handleFindManyByQueryError(error))
        )
      }),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(AudioVoiceServicesTableV1.getClassName(), `addFilterEventHandler`, { response });
      this.eventsService.loadingEmit(false);
      this.response = response;
      this.deselectAllRows();
      this.refreshTableModel();
      this.notificationService.showNotification(AUDIO_VOICE_SERVICES_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY);
    });
  }

  handleFindManyByQueryError(error: any) {
    _errorX(AudioVoiceServicesTableV1.getClassName(), 'handleFindManyByQueryError', { error })
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AUDIO_VOICE_SERVICES_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('audio_voice_services_table_v1.col_id.header'),
      field: 'id'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('audio_voice_services_table_v1.col_type.header'),
      field: 'type'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('audio_voice_services_table_v1.col_created.header'),
      field: 'created'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('audio_voice_services_table_v1.col_updated.header'),
      field: 'updated'
    }));

    this.model.header = TABLE_HEADER;
  }

  transformResponseItemToRow(params) {
    const ITEM = params?.item;
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: ITEM?.id }));
    RET_VAL.push(new TableItem({ data: ITEM?.type }));
    RET_VAL.push(new TableItem({ data: ITEM, template: this.createdTemplate }));
    RET_VAL.push(new TableItem({ data: ITEM, template: this.updatedTemplate }));
    return RET_VAL;
  }

  public refreshTableDataRows() {
    const TABLE_ROWS = [];
    if (
      !lodash.isEmpty(this.response.items) &&
      lodash.isArray(this.response.items)
    ) {
      for (let index = 0; index < this.response.items.length; index++) {
        const ITEM = this.response?.items?.[index];
        TABLE_ROWS.push(this.transformResponseItemToRow({
          item: ITEM
        }));
      }
    }
    this.model.data = TABLE_ROWS;
  }

  rowSelect(selectedApplication) {
    const SELECTED_ROW_INDEX = selectedApplication.selectedRowIndex;
    const SELECTED_ROW_DATA = ramda.path(['model', '_data', SELECTED_ROW_INDEX], selectedApplication);
    this.selectedRows.push({
      rowData: SELECTED_ROW_DATA,
      rowIndex: SELECTED_ROW_INDEX
    });
  }

  rowDeselect(deselectedApplication) {
    let filteredArray = this.selectedRows.filter(deselectedRow => { return deselectedRow.rowIndex !== deselectedApplication.deselectedRowIndex });
    this.selectedRows = filteredArray;
  }

  emitRemovePlace() {
    let selectedApplicationsIds = [];
    const TABLE_ITEMS = ramda.path(['items'], this.response);
    for (const selectedItem of this.selectedRows) {
      const SELECTED_APP_INDEX = ramda.path(['rowIndex'], selectedItem);
      selectedApplicationsIds.push(TABLE_ITEMS[SELECTED_APP_INDEX].id);
    };
    this.onShowRemovePlace.emit(selectedApplicationsIds);
  }

  selectAllRows(allRows) {
    const ROWS_DATA = ramda.path(['_data'], allRows);
    ROWS_DATA.forEach((rowData, index) => {
      if (lodash.isEmpty(rowData)) {
        return
      }
      this.selectedRows.push({
        rowData: rowData,
        rowIndex: index
      });
    });
  }

  deselectAllRows() {
    this.selectedRows = [];
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    this.audioVoiceService.exportMany(QUERY_PARAMS);
  }

  isShowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }

  emitSearchEvent(event: any) {
    this.onSearchPlace.emit(event);
  }

  emitSearchClearEvent() {
    this.onClearPlace.emit();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = true;
    return RET_VAL;
  }
}
