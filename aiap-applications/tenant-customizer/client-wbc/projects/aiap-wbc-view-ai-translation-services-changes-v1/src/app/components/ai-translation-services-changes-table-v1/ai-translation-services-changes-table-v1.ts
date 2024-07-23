/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
} from '@angular/core';

import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
  TranslateHelperServiceV1
} from 'client-shared-services';

import {
  BaseTableV1,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
  AI_TRANSLATION_SERVICES_CHANGES_MESSAGES,
} from 'client-utils';

import {
  AiTranslationServicesChangesServiceV1,
} from 'client-services';

@Component({
  selector: 'ai-translation-services-changes-table-v1',
  templateUrl: './ai-translation-services-changes-table-v1.html',
  styleUrls: ['./ai-translation-services-changes-table-v1.scss'],
})
export class AiTranslationServicesChangesTableV1 extends BaseTableV1 implements OnInit, AfterViewInit {

  static getClassName() {
    return 'AiTranslationServicesChangesTableV1';
  }

  @ViewChild('createdTemplate', { static: true }) createdTemplate: TemplateRef<any>;
  @ViewChild('updatedTemplate', { static: true }) updatedTemplate: TemplateRef<any>;

  @Output() onSearchChangeEvent = new EventEmitter<any>();
  @Output() onSearchClearEvent = new EventEmitter<any>();

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;
  skeletonState = false;
  state = {
    queryType: DEFAULT_TABLE.AI_TRANSLATION_SERVICES_CHANGES_V1.TYPE,
    defaultSort: DEFAULT_TABLE.AI_TRANSLATION_SERVICES_CHANGES_V1.SORT,
    search: ''
  };

  constructor(
    protected sessionService: SessionServiceV1,
    protected queryService: QueryServiceV1,
    protected eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private timezoneService: TimezoneServiceV1,
    private translateService: TranslateHelperServiceV1,
    private aiTranslationServicesChangesServiceV1: AiTranslationServicesChangesServiceV1,
  ) {
    super(sessionService, queryService, eventsService);
  }

  ngOnInit() {
    super.setQueryType(this.state.queryType);
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  addFilterEventHandler() {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap(query => {
        if (
          query
        ) {
          defaultQuery = query;
        }
        return this.aiTranslationServicesChangesServiceV1.findManyByQuery(defaultQuery).pipe(
          catchError((error) => this.handleFindManyByQueryError(error))
        );
      }
      ),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugX(AiTranslationServicesChangesTableV1.getClassName(), `addFilterEventHandler`,
        {
          response,
        });

      this.notificationService.showNotification(AI_TRANSLATION_SERVICES_CHANGES_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY)
      this.response = response;
      this.refreshTableModel();
      this.eventsService.loadingEmit(false);
    });
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    const AVAILABLE_ACTIONS = ['transactions.view.actions.view'];
    const ACTIONS_ALLOWED = this.sessionService.areActionsAllowed(AVAILABLE_ACTIONS);

    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_translation_services_changes_table_v1.col_transaction_id.header'),
      field: 'id',
      style: {
        width: '15%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_translation_services_changes_table_v1.col_document_external_id.header'),
      field: 'docId',
      style: {
        width: '15%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_translation_services_changes_table_v1.col_document_name.header'),
      field: 'docId',
      style: {
        width: '15%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_translation_services_changes_table_v1.col_document_type.header'),
      field: 'docType',
      style: {
        width: '10%',
      }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('ai_translation_services_changes_table_v1.col_action.header'),
      field: 'action',
      style: {
        width: '10%',
      }
    }));

    TABLE_HEADER.push(
      new TableHeaderItem({
        data: this.translateService.instant(
          'ai_translation_services_changes_table_v1.col_created.header'
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
          'ai_translation_services_changes_table_v1.col_updated.header'
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

    RET_VAL.push(new TableItem({
      data: item?.id,
      raw: item,
    }));
    RET_VAL.push(new TableItem({
      data: item?.docId,
    }));
    RET_VAL.push(new TableItem({
      data: item?.docName,
    }));
    RET_VAL.push(new TableItem({
      data: item?.docType,
    }));
    RET_VAL.push(new TableItem({
      data: item?.action,
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

  handleFindManyByQueryError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(AI_TRANSLATION_SERVICES_CHANGES_MESSAGES.ERROR.FIND_MANY_BY_QUERY);
    return of();
  }

  isShowRowSavePlaceAllowed() {
    const RET_VAL = this.sessionService.isActionAllowed({ action: 'ai-translation-services-changes.view.actions.view' });
    return RET_VAL;
  }

  emitSearchChangeEvent(event: any) {
    this.onSearchChangeEvent.emit(event);
  }

  emitSearchClearEvent() {
    this.onSearchClearEvent.emit();
  }

  private showSkeletonLoading(): void {
    this.skeletonState = true;
  }

  private hideSkeletonLoading(): void {
    this.skeletonState = false;
  }

}
