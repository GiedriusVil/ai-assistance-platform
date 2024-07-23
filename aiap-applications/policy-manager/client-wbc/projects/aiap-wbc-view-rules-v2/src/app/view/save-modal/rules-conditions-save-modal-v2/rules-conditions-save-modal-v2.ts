/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
  _debugX,
  _errorW,
} from 'client-shared-utils';

import {
  BaseModal,
} from 'client-shared-views';

import {
  EventsServiceV1,
} from 'client-shared-services'

import {
  FieldWrapperV1,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  RulesConditionsServiceV2,
  ValidationEngagementsServiceV1,
} from 'client-services';

import {
  RULES_MESSAGES_V2,
  RULES_CONDITIONS_MESSAGES_V2,
} from '../../../messages'

@Component({
  selector: 'aiap-rules-conditions-save-modal-v2',
  templateUrl: './rules-conditions-save-modal-v2.html',
  styleUrls: ['./rules-conditions-save-modal-v2.scss']
})
export class RulesConditionsSaveModalV2 extends BaseModal implements OnInit, OnDestroy {

  static getClassName() {
    return 'RulesConditionsSaveModalV2';
  }

  @ViewChild('conditionValueFieldWrapper') conditionValueFieldWrapper: FieldWrapperV1;

  isEditable: boolean = true;

  queryType = DEFAULT_TABLE.RULES_CONDITIONS_V2.TYPE;

  _selections = {
    paths: [],
    selectedPath: undefined,
    conditions: [],
    selectedCondition: undefined
  }
  selections: any = lodash.cloneDeep(this._selections);

  _condition = {
    id: undefined,
    ruleId: undefined,
    path: {
      value: undefined,
    },
    operator: {
      type: undefined,
    },
    value: undefined,
  }
  condition: any = lodash.cloneDeep(this._condition);

  _conditionContext = {
    path: {
      helperText: '',
    },
    operator: {
      helperText: '',
    },
    value: {
      type: 'string',
    }
  }
  conditionContext: any = lodash.cloneDeep(this._conditionContext);

  paths = [];
  conditions = [
    'equal',
    'notEqual',
    'lessThan',
    'lessThanInclusive',
    'greaterThan',
    'greaterThanInclusive',
    'in',
    'notIn',
    'contains',
    'doesNotContain',
  ]

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private rulesConditionsServiceV2: RulesConditionsServiceV2,
    private validationEngagementsService: ValidationEngagementsServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.superNgOnInit(this.eventsService);
    this.updateConditionsDropdown(this.conditions);
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  updateValidationEngagementPaths(id: string) {
    this.validationEngagementsService.getPathsById(id)
      .pipe(
        catchError((error) => this.handleUpdateValidationEngagementPathsError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugW(RulesConditionsSaveModalV2.getClassName(), 'updateValidationEngagementPaths', { response });
        this.paths = response;
        this.updatePathsDropdown(response);
      });
  }

  updatePathsDropdown(paths: any) {
    const DROPDOWN_ITEMS = this._transformPathsIntoDropdownItems(paths);
    let newSelections = lodash.cloneDeep(this.selections);
    newSelections.paths = DROPDOWN_ITEMS;
    this.selections = newSelections;
  }

  _transformPathsIntoDropdownItems(paths: any[]) {
    const RET_VAL = [];
    if (
      lodash.isArray(paths)
    ) {
      for (let path of paths) {
        let tmpOption = this._transformPathIntoDropdownItem(path);
        if (
          tmpOption
        ) {
          RET_VAL.push(tmpOption);
        }
      }
    }
    return RET_VAL;
  }

  _transformPathIntoDropdownItem(path: any) {
    let retVal;
    if (!lodash.isEmpty(path)) {
      const IS_SELECTED = this.condition?.path?.value === path?.content;
      retVal = {
        content: path?.content,
        selected: IS_SELECTED,
        value: path?.value,
      }
      if (
        IS_SELECTED
      ) {
        this.selections.selectedPath = retVal;
        this.refreshConditionValueContextBySelectedPath();
      }
    }
    return retVal;
  }

  private refreshConditionValueContextBySelectedPath() {
    _debugX(
      RulesConditionsSaveModalV2.getClassName(),
      'refreshConditionValueContextBySelectedPath',
      {
        this_selections_selectedPath: this.selections?.selectedPath,
      });
    try {
      const METADATA = lodash.clone(this.selections?.selectedPath?.value?.metadata);
      let conditionContextValueType;
      if (
        !lodash.isEmpty(METADATA?.value?.wbc)
      ) {
        conditionContextValueType = 'wbc';
      } else {
        conditionContextValueType = this.selections?.selectedPath?.value?.type || 'string';
      }
      const NEW_CONDITION_CONTEXT_VALUE: any = {
        type: conditionContextValueType,
      };
      if (
        NEW_CONDITION_CONTEXT_VALUE?.type === 'wbc'
      ) {
        NEW_CONDITION_CONTEXT_VALUE[
          NEW_CONDITION_CONTEXT_VALUE.type
        ] = METADATA?.value?.wbc;
      } else {
        NEW_CONDITION_CONTEXT_VALUE[
          NEW_CONDITION_CONTEXT_VALUE.type
        ] = METADATA?.value;
      }
      const NEW_CONDITION_CONTEXT: any = ramda.mergeDeepRight(
        this._conditionContext,
        {
          path: METADATA?.path,
          operator: METADATA?.operator,
          value: NEW_CONDITION_CONTEXT_VALUE,
        }
      );
      this.conditionContext = NEW_CONDITION_CONTEXT;
      _debugX(
        RulesConditionsSaveModalV2.getClassName(),
        'refreshConditionValueContextBySelectedPath',
        {
          this_condition_context: this.conditionContext,
        });
    } catch (error) {
      _errorW(
        RulesConditionsSaveModalV2.getClassName(),
        'refreshConditionValueContextBySelectedPath',
        { error }
      );
    }
  }

  updateConditionsDropdown(conditions: any) {
    const DROPDOWN_ITEMS = this._transformConditionsIntoDropdownItems(conditions);
    let newSelections = lodash.cloneDeep(this.selections);
    newSelections.conditions = DROPDOWN_ITEMS;
    this.selections = newSelections;
  }

  _transformConditionsIntoDropdownItems(conditions: any[]) {
    const RET_VAL = [];
    if (lodash.isArray(conditions)) {
      for (let condition of conditions) {
        let tmpOption = this._transformConditionIntoDropdownItem(condition);
        if (tmpOption) {
          RET_VAL.push(tmpOption);
        }
      }
    }
    return RET_VAL;
  }

  _transformConditionIntoDropdownItem(condition: any) {
    let retVal;
    if (
      !lodash.isEmpty(condition)
    ) {
      const IS_SELECTED = this.condition?.operator?.type === condition;
      retVal = {
        content: condition,
        selected: IS_SELECTED,
        value: condition,
      }
      if (
        IS_SELECTED
      ) {
        this.selections.selectedCondition = retVal;
      }
    }
    return retVal;
  }


  handleUpdateValidationEngagementPathsError(error: any) {
    _errorW(RulesConditionsSaveModalV2.getClassName(), 'handleUpdateValidationEngagementPathsError', { error });
    this.notificationService.showNotification(RULES_MESSAGES_V2.ERROR.GET_PATHS_BY_KEY);
    let newSelections = lodash.cloneDeep(this.selections);
    newSelections.paths = [];
    newSelections.selectedPath = undefined;
    this.selections = newSelections;
    return of();
  }


  loadSaveModalData(conditionId: any) {
    _debugW(RulesConditionsSaveModalV2.getClassName(), 'loadSaveModalData', { conditionId });
    this.eventsService.loadingEmit(true);
    this.rulesConditionsServiceV2.findOneById(conditionId).pipe(
      catchError((error) => this.handleLoadSaveModalDataError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugW(RulesConditionsSaveModalV2.getClassName(), 'loadSaveModalData', { response });
      this.condition = response;

      this.updateConditionsDropdown(this.conditions);
      this.updatePathsDropdown(this.paths);

      this.notificationService.showNotification(RULES_CONDITIONS_MESSAGES_V2.SUCCESS.FIND_ONE_BY_ID);
      this.eventsService.loadingEmit(false);
      this.superShow();
    });
  }

  show(ruleId: any, conditionId: any) {
    this.selections = lodash.cloneDeep(this._selections);
    this.condition = lodash.cloneDeep(this._condition);
    if (!lodash.isEmpty(ruleId)) {
      this.condition.ruleId = ruleId;
    }
    if (
      !lodash.isEmpty(conditionId)
    ) {
      this.loadSaveModalData(conditionId);
    } else {
      setTimeout(() => {
        this.updateConditionsDropdown(this.conditions);
        this.updatePathsDropdown(this.paths);
        this.superShow();
      }, 0);
    }
  }

  handleSaveClickEvent() {
    const CONDITION = lodash.cloneDeep(this.condition);
    _debugW(RulesConditionsSaveModalV2.getClassName(), 'save', { CONDITION });
    this.rulesConditionsServiceV2.saveOne(CONDITION)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugW(RulesConditionsSaveModalV2.getClassName(), 'save', { response });
        this.notificationService.showNotification(RULES_CONDITIONS_MESSAGES_V2.SUCCESS.SAVE_ONE);
        this.eventsService.loadingEmit(false);
        this.eventsService.modalFilterEmit(null);
        this.close();
      });
  }

  handlePathSelect(path: any) {
    _debugW(RulesConditionsSaveModalV2.getClassName(), 'handlePathSelect', { path });
    this.refreshConditionValueContextBySelectedPath();
    this.condition.path.value = path?.item?.value?.path;
    this.condition.value = undefined;
  }

  handleOperatorSelect(condition: any) {
    _debugW(
      RulesConditionsSaveModalV2.getClassName(),
      'handleOperatorSelect',
      {
        condition
      });
    this.condition.operator.type = condition.item?.value;
  }

  handleConditionContextChange(event: any) {
    _debugW(
      RulesConditionsSaveModalV2.getClassName(),
      'handleValueChange',
      {
        event,
      });


  }

  handleConditionValueChange(value: any) {
    _debugW(
      RulesConditionsSaveModalV2.getClassName(),
      'handleValueChange',
      {
        value,
      });

    this.condition.value = value;
  }

  handleSaveOneError(error: any) {
    _debugW(RulesConditionsSaveModalV2.getClassName(), 'handleSaveOneError', { error });
    this.notificationService.showNotification(RULES_CONDITIONS_MESSAGES_V2.ERROR.SAVE_ONE);
    this.eventsService.loadingEmit(false);
    return of();
  }

  handleLoadSaveModalDataError(error: any) {
    _debugW(RulesConditionsSaveModalV2.getClassName(), 'handleLoadSaveModalDataError', { error });
    this.notificationService.showNotification(RULES_CONDITIONS_MESSAGES_V2.ERROR.FIND_ONE_BY_ID);
    this.selections = lodash.cloneDeep(this._selections);
    this.eventsService.loadingEmit(false);
    return of();
  }

}
