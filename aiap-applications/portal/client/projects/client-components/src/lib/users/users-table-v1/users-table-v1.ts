/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  TemplateRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';

import { Router, ActivatedRoute, } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { catchError, tap, switchMap, takeUntil } from 'rxjs/operators';

import moment from 'moment';

import {
  TableHeaderItem,
  TableItem,
  NotificationService,
} from 'client-shared-carbon';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
  LocalStorageServiceV1,
  ConfigServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  User,
  DEFAULT_TABLE,
  USERS_NOTIFICATION,
} from 'client-utils';

import {
  ClientSideDownloadServiceV1,
  UsersServiceV1,
} from 'client-services';

import {
  BaseTable,
} from 'client-shared-components';

@Component({
  selector: 'aiap-users-table-v1',
  templateUrl: './users-table-v1.html',
  styleUrls: ['./users-table-v1.scss'],
})
export class UsersTableV1 extends BaseTable implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'UsersTableV1';
  }

  @Output() onRowClick = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();

  @ViewChild('userStatus', { static: true }) userStatus: TemplateRef<any>;
  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  TABLE_ATTR = {
    SIZE: 'md',
    SHOW_SELECTION_COLUMN: true,
    SORTABLE: true,
    STICKY_HEADER: false,
    SHOW_PAGE_INPUT: true,
    STRIPED: true
  };

  private isActionsClickAllowed = false;

  skeletonState = false;
  itemsPerPage: number = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE;
  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;


  private timezones: any = [];
  private isEventProcessed = false;
  private filters: any = {};
  private navigationSub: Subscription;

  state: any = {
    queryType: DEFAULT_TABLE.USERS.TYPE,
    defaultSort: DEFAULT_TABLE.USERS.SORT,
    search: '',
  };

  constructor(
    protected eventsService: EventsServiceV1,
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    private userService: UsersServiceV1,
    private timezoneService: TimezoneServiceV1,
    private localStorageService: LocalStorageServiceV1,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private configService: ConfigServiceV1,
    private translateService: TranslateHelperServiceV1,
    private clientSideDownloadService: ClientSideDownloadServiceV1
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    this.state.search = this.queryService.getSearchValue(this.state.queryType);
    this.initPage();
    this.initData();
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleUsersRowClick(event: any) {
    _debugX(UsersTableV1.getClassName(), `handleRowClick`,
      {
        event,
      });

    const IS_EDIT_ALLOWED = this.sessionService.isActionAllowed({ action: 'users.view.edit' });
    if (
      !this.isActionsClickAllowed && IS_EDIT_ALLOWED
    ) {
      const USER = this.mapUserFromTable(this.model.data[event]);
      this.onRowClick.emit(USER)
    }
    this.isActionsClickAllowed = false;
  }

  private initPage(): void {
    /**
     * TODO rework routing used on updating query(pagination) of URL (?page=1)
     * DISABLED as logic interfered by authorizeTenant, the loop created by reload and navigation
     *
    navigateToPage(this.router, this.activatedRouter, this.query.pagination.page);
    */
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(query => {
        if (query) {
          defaultQuery = query;
        }
        return this.userService.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindManyByQueryError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(UsersTableV1.getClassName(), `addFilterEventHandler`,
        {
          response,
        });

      this.response = response;
      this.refreshTableModel();
      this.selectedRows = [];
      this.eventsService.loadingEmit(false);
    });
  }

  transformResponseItemToRow(user: User): TableItem[] {
    const RET_VAL = [
      new TableItem({ data: user.userStatus, template: this.userStatus }),
      new TableItem({ data: user.username }),
      new TableItem({ data: this.timezoneService.getUserTimezone(user)?.text }),
      new TableItem({ data: this.getLastLogin(user.lastLogin) }),
      new TableItem({ data: user, template: this.createdTemplate }),
      new TableItem({ data: user, template: this.updatedTemplate }),
    ];

    return RET_VAL;
  }

  handleEventSearchChange(event: any) {
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
    _debugX(UsersTableV1.getClassName(), `handleEventSearchChange`,
      {
        event,
      });
  }

  handleEventSearchClear(event: any) {
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
    _debugX(UsersTableV1.getClassName(), `handleEventSearchClear`,
      {
        event,
      });
  }

  private handleFindManyByQueryError(error: any) {
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: 'Unable to save tenant!',
      target: '.notification-container',
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  constructTableHeader(): void {
    const AVAILABLE_ACTIONS = ['users.view.edit', 'users.view.delete'];
    const ACTIONS_ALLOWED = this.sessionService.areActionsAllowed(AVAILABLE_ACTIONS);

    const TABLE_HEADER = [
      new TableHeaderItem({
        data: this.translateService.instant('users_table_v1.col_status.header'),
        field: 'status',
        sortable: false,
      }),
      new TableHeaderItem({
        data: this.translateService.instant('users_table_v1.col_username.header'),
        field: 'username',
      }),
      new TableHeaderItem({
        data: this.translateService.instant('users_table_v1.col_timezone.header'),
        field: 'timezone',
      }),
      new TableHeaderItem({
        data: this.translateService.instant('users_table_v1.col_last_login.header'),
        field: 'lastLogin',
      }),
      new TableHeaderItem({
        data: this.translateService.instant('users_table_v1.col_created.header'),
        field: 'created',
      }),
      new TableHeaderItem({
        data: this.translateService.instant('users_table_v1.col_updated.header'),
        field: 'updated',
      }),
    ];

    this.model.header = TABLE_HEADER;
  }

  private initData(): void {
    this.timezones = this.timezoneService.getTimezones();
  }

  private showSkeletonLoading(): void {
    this.skeletonState = true;
  }

  private hideSkeletonLoading(): void {
    this.skeletonState = false;
  }

  private setSortFieldsArray(): void {
    this.filters = this.localStorageService.get('filters');
  }

  private saveSortUsersFields(currSortUsersFields): void {
    const SORT_FIELDS_ARRAY = {
      users: {
        ...currSortUsersFields
      }
    };

    this.localStorageService.set('filters', { ...this.filters, sortFieldsArray: SORT_FIELDS_ARRAY });
  }

  private resetSorting(url: string): void {
    const IS_NOT_USERS_URL = !/main-view\/users/.test(url);

    if (IS_NOT_USERS_URL) {
      this.saveSortUsersFields({
        fieldName: DEFAULT_TABLE.USERS.SORT.field,
        sortDirection: DEFAULT_TABLE.USERS.SORT.direction
      });
    }
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'users.view.edit' });
    return RET_VAL;
  }


  usersExport() {
    this.userService.exportUsersPermissions().pipe(
      catchError(error => {
        this.notificationService.showNotification(USERS_NOTIFICATION.ERROR.EXPORT_USERS_PERMISSIONS);
        return of();
      })
    ).subscribe(data => {
      this.clientSideDownloadService.openSaveFileDialog(data, `users-permissions.${moment().format('YYYY-MM-DD')}.xlsx`, undefined)
    });
  }

  /** Get whole user object */
  private mapUserFromTable(userItemArray: TableItem[]): User {
    const USER: any = userItemArray[userItemArray.length - 1];
    return USER?.data;
  }

  private getLastLogin(lastLogin: string): string {
    const LAST_LOGIN = this.timezoneService.getTimeByUserTimezone(lastLogin);
    if (LAST_LOGIN) {
      return LAST_LOGIN;
    }
    return 'Never Logged In';
  }

}
