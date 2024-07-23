/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  BaseModalV1
} from 'client-shared-views';

import {
  EventsServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  _errorX,
  _debugX,
} from 'client-shared-utils';

import {
  DataMaskingConfigurationsServiceV1,
} from 'client-services';

import {
  DATA_MASKING_CONFIGURATIONS_MESSAGES
} from 'client-utils';

@Component({
  selector: 'aiap-data-masking-configuration-save-modal-v1',
  templateUrl: './data-masking-configuration-save-modal-v1.html',
  styleUrls: ['./data-masking-configuration-save-modal-v1.scss'],
})
export class MaskingConfigurationSaveModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'MaskingConfigurationSaveModalV1';
  }

  maskingRegexDescription = 'Please enter the regex pattern in the following format:\n/pattern/flags';

  _selections = {
    patternTypes: [],
    replaceTypes: [],
  }

  _maskingConfiguration: any = {
    id: undefined,
    enabled: true,
    name: undefined,
    pattern: undefined,
    patternType: undefined,
  }

  selections = lodash.cloneDeep(this._selections);
  maskingConfiguration = lodash.cloneDeep(this._maskingConfiguration);

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationServiceV2,
    private dataMaskingConfigurationsService: DataMaskingConfigurationsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit() {
    //
  }

  onPatternTypeSelected(event) {
    const PATTERN_TYPE = event?.item?.value;
    _debugX(MaskingConfigurationSaveModalV1.getClassName(), 'onPatternTypeSelected',
      {
        PATTERN_TYPE,
      });

    this.maskingConfiguration.patternType = PATTERN_TYPE;
  }

  onReplaceTypeSelected(event) {
    const REPLACE_TYPE = event?.item?.value;
    _debugX(MaskingConfigurationSaveModalV1.getClassName(), 'onReplaceTypeSelected',
      {
        REPLACE_TYPE
      });

    this.maskingConfiguration.replaceType = REPLACE_TYPE;
  }

  loadFormData(key: any) {
    this.eventsService.loadingEmit(true);
    this.dataMaskingConfigurationsService.findOneByKey(key)
      .pipe(
        catchError((error) => this.handleRetrieveFormDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(MaskingConfigurationSaveModalV1.getClassName(), 'loadFormData',
          {
            response,
          });

        const DATA_MASKING_CONFIGURATION = response;
        if (
          lodash.isEmpty(DATA_MASKING_CONFIGURATION)
        ) {
          this.maskingConfiguration = lodash.cloneDeep(this._maskingConfiguration);
        } else {
          this.maskingConfiguration = DATA_MASKING_CONFIGURATION;
          this.updateDropdownSelections();
        }
        this.eventsService.loadingEmit(false);
        this.superShow();

        this.notificationService.showNotification(DATA_MASKING_CONFIGURATIONS_MESSAGES.SUCCESS.FIND_ONE_BY_ID);
        _debugX(MaskingConfigurationSaveModalV1.getClassName(), 'loadFormData',
          {
            this_maskingConfiguration: this.maskingConfiguration,
          });

      });
  }

  updateDropdownSelections() {
    const TEMP_SELECTIONS = lodash.cloneDeep(this.selections);
    if (!lodash.isEmpty(this.maskingConfiguration?.patternType)) {
      const SELECTED_PATTERN_TYPE = TEMP_SELECTIONS.patternTypes.find(patternType => {
        return patternType.value === this.maskingConfiguration.patternType;
      });
      if (!lodash.isEmpty(SELECTED_PATTERN_TYPE)) {
        SELECTED_PATTERN_TYPE.selected = true;
      }
    }
    if (!lodash.isEmpty(this.maskingConfiguration?.replaceType)) {
      const SELECTED_REPLACE_TYPE = TEMP_SELECTIONS.replaceTypes.find(replaceType => {
        return replaceType.value === this.maskingConfiguration.replaceType;
      });
      if (!lodash.isEmpty(SELECTED_REPLACE_TYPE)) {
        SELECTED_REPLACE_TYPE.selected = true;
      }
    }
    this.selections = lodash.cloneDeep(TEMP_SELECTIONS);
  }

  refreshDropdownItems() {
    const PATTERN_TYPES = [
      'DEFAULT_PATTERN',
      'CREDIT_CARD_PATTERN'
    ];
    const REPLACE_TYPES = [
      'MATCH_ONLY',
      'ALL_MESSAGE'
    ];
    for (const PATTERN_TYPE of PATTERN_TYPES) {
      const SELECTION_PATTERN_TYPE = {
        content: PATTERN_TYPE,
        value: PATTERN_TYPE,
        selected: false,
      }
      this.selections.patternTypes.push(SELECTION_PATTERN_TYPE);
    }
    for (const REPLACE_TYPE of REPLACE_TYPES) {
      const SELECTION_REPLACE_TYPE = {
        content: REPLACE_TYPE,
        value: REPLACE_TYPE,
        selected: false,
      }
      this.selections.replaceTypes.push(SELECTION_REPLACE_TYPE);
    }
  }

  private handleRetrieveFormDataError(error: any) {
    _debugX(MaskingConfigurationSaveModalV1.getClassName(), 'handleRetrieveFormDataError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(DATA_MASKING_CONFIGURATIONS_MESSAGES.ERROR.FIND_ONE_BY_ID);
    this.close();
    return of();
  }

  show(key: any) {
    this.maskingConfiguration = lodash.cloneDeep(this._maskingConfiguration);
    this.selections = lodash.cloneDeep(this._selections);
    if (!lodash.isEmpty(key)) {
      this.refreshDropdownItems();
      this.loadFormData(key);
    }
    else {
      setTimeout(() => {
        this.selections = lodash.cloneDeep(this._selections);
        this.refreshDropdownItems();
      }, 0)
      this.superShow();
    }
  }

  save() {
    const DATA_MASKING_CONFIGURATION = this._sanitizeMaskingConfiguration();
    _debugX(MaskingConfigurationSaveModalV1.getClassName(), 'save',
      {
        DATA_MASKING_CONFIGURATION,
      });

    this.dataMaskingConfigurationsService.saveOne(DATA_MASKING_CONFIGURATION)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(MaskingConfigurationSaveModalV1.getClassName(), 'data-masking-configuration-save-modal | save | response',
          {
            response,
          });

        this.notificationService.showNotification(DATA_MASKING_CONFIGURATIONS_MESSAGES.SUCCESS.SAVE_ONE);
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(null);
        this.close();
      });
  }

  _sanitizeMaskingConfiguration() {
    const RET_VAL = lodash.cloneDeep(this.maskingConfiguration);
    return RET_VAL;
  }

  private handleSaveOneError(error) {
    _errorX(MaskingConfigurationSaveModalV1.getClassName(), 'handleSaveOneError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(DATA_MASKING_CONFIGURATIONS_MESSAGES.ERROR.SAVE_ONE);
    this.close();
    return of();
  }

  handleMaskingEnabledToggle() {
    this.maskingConfiguration.enabled = !this.maskingConfiguration.enabled;
  }

  isValid() {
    if (!this.isOpen) {
      return false;
    }
    if (this.isLoading) {
      return false;
    }
    if (
      lodash.isEmpty(this.maskingConfiguration.key) ||
      lodash.isEmpty(this.maskingConfiguration.pattern) ||
      lodash.isEmpty(this.maskingConfiguration.replaceType) ||
      lodash.isEmpty(this.maskingConfiguration.patternType)
    ) {
      return false;
    }
    return this.isValidRegexPattern();
  }

  isValidRegexPattern() {
    try {
      if (
        lodash.isEmpty(this.maskingConfiguration.pattern)
      ) {
        return false;
      } else {
        let pattern = this.maskingConfiguration.pattern;
        pattern = pattern.toString();
        if (pattern[0] !== '/') {
          return false;
        }
        const LAST_SLASH = pattern.lastIndexOf('/');
        new RegExp(pattern.slice(1, LAST_SLASH), pattern.slice(LAST_SLASH + 1));
        return true;
      }
    } catch (error) {
      return false;
    }
  }
}
