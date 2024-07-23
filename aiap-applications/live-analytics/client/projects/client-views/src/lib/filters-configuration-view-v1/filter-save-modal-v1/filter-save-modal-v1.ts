/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  FiltersConfigurationsService
} from 'client-services'

import {
  FILTERS_CONFIGURATION_MESSAGES,
} from 'client-utils';

// import { QueryHelpModal } from '../query-help-modal/query-help.modal';
import { FiltersConfigurationFilterTab } from './filters-configuration-filter-tab/filter-configuration-filter-tab';
import { FiltersConfigurationTab } from './filters-configuration-configurations-tab/filters-configuration-configurations-tab';

import { BaseModal } from 'client-shared-views';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'aiap-filter-save-modal-v1',
  templateUrl: './filter-save-modal-v1.html',
  styleUrls: ['./filter-save-modal-v1.scss']
})
export class FilterSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'FilterSaveModalV1';
  }

  @ViewChild('filtersTab', { static: true }) filtersTab: FiltersConfigurationFilterTab;
  @ViewChild('configurationsTab', { static: true }) configurationsTab: FiltersConfigurationTab;

  isBaseUrlsPresent = false;

  _filter: any = {
    id: '',
    ref: '',
    type: undefined,
    queryParamName: '',
  };

  filter = lodash.cloneDeep(this._filter);
  _state: any = {
    types: [],
    type: undefined,
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    private filtersConfigurationService: FiltersConfigurationsService,
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private translateService: TranslateService,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  show(filterId: string) {
    _debugX(FilterSaveModalV1.getClassName(), 'show',
      {
        filterId,
      });

    this.loadFormData(filterId);
  }


  help() {
    // this.queryHelpModal.show();
  }

  save(isFinalSave = true) {
    if (
      this.isLoading
    ) {
      return;
    }
    const FILTER = this.sanitizedFilter();
    _debugX(FilterSaveModalV1.getClassName(), 'save', { FILTER });
    this.eventsService.loadingEmit(true);
    this.filtersConfigurationService.saveOne(FILTER)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe(() => {
        this.notificationService.showNotification(FILTERS_CONFIGURATION_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.loadingEmit(false);
        if (
          isFinalSave
        ) {
          this.eventsService.filterEmit(null);
          this.close();
        }
      });
  }

  handleEventSave(event: any) {
    _debugX(FilterSaveModalV1.getClassName(), 'handleEventSave',
      {
        event,
      });

    this.save();
  }

  isInvalid() {
    const RET_VAL =

      !this.filter?.ref ||
      !this.filter?.type ||
      !this.filter?.queryParamName ||
      !this.filtersTab.isValid() ||
      !this.configurationsTab.isValid()

    return RET_VAL;
  }

  close() {
    this.filtersTab.clearMonacoContainer();
    super.close();
  }

  handleEventClose(event: any) {
    _debugX(FilterSaveModalV1.getClassName(), 'handleEventClose',
      {
        event,
      });

    this.close();
  }

  private sanitizedFilter() {
    const RET_VAL: any = lodash.cloneDeep(this.filter);
    const CODE = this.filtersTab.getValue();
    RET_VAL.type = this.filter.type.value;
    RET_VAL.code = CODE?.value,
      RET_VAL.configuration = this.configurationsTab.getValue();

    return RET_VAL;
  }

  loadFormData(id: any) {
    _debugX(FilterSaveModalV1.getClassName(), 'loadFormData', { id });
    this.state = lodash.cloneDeep(this._state);
    this.eventsService.loadingEmit(true);
    this.filtersConfigurationService.retrieveModuleFormData(id)
      .pipe(
        catchError((error) => this.handleRetrieveFormDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        this.filtersTab.createMonacoEditor();
        _debugX(FilterSaveModalV1.getClassName(), 'loadFormData', { response });
        if (lodash.isEmpty(response)) {
          this.filter = lodash.cloneDeep(this._filter);
        } else {
          this.filter = response;
        }
        this.refreshTypes();
        this.state = lodash.cloneDeep(this.state);
        this.eventsService.loadingEmit(false);
        this.superShow();
        this.notificationService.showNotification(FILTERS_CONFIGURATION_MESSAGES.SUCCESS.FIND_ONE_BY_ID);
        _debugX(FilterSaveModalV1.getClassName(), 'loadFormData', { this_state: this.state, this_module: this.filter });
      });
  }

  private handleRetrieveFormDataError(error: any) {
    _debugX(FilterSaveModalV1.getClassName(), 'handleRetrieveFormDataError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(FILTERS_CONFIGURATION_MESSAGES.ERROR.FIND_ONE_BY_ID);
    return of();
  }

  private handleSaveOneError(error: any) {
    _debugX(FilterSaveModalV1.getClassName(), 'handleSaveOneError', { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(FILTERS_CONFIGURATION_MESSAGES.ERROR.SAVE_ONE);
    const ERROR_MESSAGE = error?.error?.errors?.[0]?.message;
    if (!lodash.isEmpty(ERROR_MESSAGE)) {
      const NOTIFICATION_WITH_ERROR = lodash.cloneDeep(FILTERS_CONFIGURATION_MESSAGES.ERROR.SAVE_ONE);
      NOTIFICATION_WITH_ERROR.message = ERROR_MESSAGE;
      this.notificationService.showNotification(NOTIFICATION_WITH_ERROR);
    }
    return of();
  }

  handleTypeSelection(event: any) {
    this.filter = lodash.cloneDeep(this.filter);
  }

  private refreshTypes() {
    const FILTER_TYPES = [
      {
        content: 'TOGGLE',
        value: 'TOGGLE',
        selected: false,
      },
      {
        content: 'DROPDOWN',
        value: 'DROPDOWN',
        selected: false,
      },
      {
        content: 'SEARCH_BAR',
        value: 'SEARCH_BAR',
        selected: false,
      },
      {
        content: 'HIDDEN',
        value: 'HIDDEN',
        selected: false,
      },
    ];

    for (const TYPE of FILTER_TYPES) {
      TYPE.selected = this.filter?.type === TYPE?.value;
      this.state.types.push(TYPE);
      if (
        TYPE.selected
      ) {
        this.filter.type = TYPE;
      }
    }
  }
}
