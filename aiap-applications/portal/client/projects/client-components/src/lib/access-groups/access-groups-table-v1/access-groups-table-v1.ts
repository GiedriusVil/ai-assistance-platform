/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChild,
  TemplateRef,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  NotificationService,
  TableHeaderItem,
  TableItem,
  OverflowMenu,
} from 'client-shared-carbon';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseTable,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  AccessGroupsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-access-groups-table-v1',
  templateUrl: './access-groups-table-v1.html',
  styleUrls: ['./access-groups-table-v1.scss'],
})
export class AccessGroupsTableV1 extends BaseTable implements OnInit, AfterViewInit {

  static getClassName() {
    return 'AccessGroupsTableV1';
  }

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  @ViewChild('actionsOverFlowTemplate', { static: true })
  actionsOverFlowTemplate: TemplateRef<OverflowMenu>;

  @Input() description: any = 'Provide description';

  private _acaRedirectRequest: any;
  private _eventOverflowMenu: OverflowMenu;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState = false;

  state: any = {
    queryType: DEFAULT_TABLE.ACCESS_GROUPS.TYPE,
    defaultSort: DEFAULT_TABLE.ACCESS_GROUPS.SORT,
    search: '',
  };

  constructor(
    protected eventsService: EventsServiceV1,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private accessGroupsService: AccessGroupsServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    this.state.search = this.queryService.getSearchValue(this.state.queryType);
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(
      this.queryService.query(this.state.queryType)
    );
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    const AVAILABLE_ACTIONS = [
      'access-groups.view.edit',
      'access-groups.view.delete',
    ];
    const ACTIONS_ALLOWED =
      this.sessionService.areActionsAllowed(AVAILABLE_ACTIONS);

    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('access_groups_table_v1.col_name.header'),
        field: 'name',
        style: {
          width: '30%',
        },
      })
    );
    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('access_groups_table_v1.col_description.header'),
        field: 'description',
        style: {
          width: '40%',
        },
      })
    );
    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('access_groups_table_v1.col_actions.header'),
        field: 'actions',
        sortable: false,
        visible: ACTIONS_ALLOWED,
        style: {
          width: '2%',
        },
      })
    );
    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('access_groups_table_v1.col_created.header'),
        field: 'created.date',
        style: {
          width: '14%',
        },
      })
    );
    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant('access_groups_table_v1.col_updated.header'),
        field: 'updated.date',
        style: {
          width: '14%',
        },
      })
    );
    this.model.header = TABLE_HEADER;
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        switchMap((query) => {
          if (query) {
            defaultQuery = query;
          }
          return this.accessGroupsService
            .findManyByQuery(defaultQuery)
            .pipe(
              catchError((error) => this.handleFindAnswersByQueryError(error))
            );
        }),
        takeUntil(this._destroyed$)
      )
      .subscribe((response: any) => {
        _debugX(AccessGroupsTableV1.getClassName(), 'addFilterEventHandler',
          {
            response,
          }
        );

        this.response = response;
        this.refreshTableModel();
        this.selectedRows = [];
        this.eventsService.loadingEmit(false);
      });
  }

  transformResponseItemToRow(item) {
    const RET_VAL = [];
    RET_VAL.push(new TableItem({
      data: item?.name,
    }));
    RET_VAL.push(new TableItem({
      data: item?.description,
    }));
    RET_VAL.push(
      new TableItem({
        data: item,
        template: this.actionsOverFlowTemplate,
      })
    );
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

  handleFindAnswersByQueryError(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: 'Unable to retrieve access groups!',
      target: '.notification-container',
      duration: 10000,
    };
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
    _debugX(AccessGroupsTableV1.getClassName(), `handleEventSearchChange`,
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
    _debugX(AccessGroupsTableV1.getClassName(), `handleEventSearchClear`,
      {
        event,
      });
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({
      action: 'access-groups.view.edit',
    });
    return RET_VAL;
  }

  showCopyPlace(data) {
    _debugX(AccessGroupsTableV1.getClassName(), 'showCopyPlace',
      {
        data,
      });

    const COPY_VALUE = {
      created: data?.created,
      name: data?.name,
      description: data?.description,
      tenants: data?.tenants,
      views: data?.views,
      updated: data?.updated,
    };
    this.emitShowSavePlace(COPY_VALUE);
  }

  exportMany() {
    const QUERY_PARAMS = this.queryService.query(this.state.queryType);
    const SELECTED_IDS = this.retrieveSelectedRowsIds();
    this.accessGroupsService.exportMany(QUERY_PARAMS, SELECTED_IDS);
  }
}
