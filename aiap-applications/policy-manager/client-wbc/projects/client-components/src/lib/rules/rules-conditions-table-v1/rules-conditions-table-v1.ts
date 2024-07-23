/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, OnChanges, AfterViewInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/internal/Subject';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  TableModel,
  TableHeaderItem,
  TableItem,
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  TranslateHelperServiceV1
} from 'client-shared-services';

import {
  RulesServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rules-conditions-table-v1',
  templateUrl: './rules-conditions-table-v1.html',
  styleUrls: ['./rules-conditions-table-v1.scss']
})
export class RulesConditionsTableV1 implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  static getClassName() {
    return 'RulesConditionsTableV1';
  }

  private _destroyed$: Subject<void> = new Subject();
  isOpen = false;

  @Input() rule: any;
  @Input() ruleType: any;

  @Output() onConditionRefresh = new EventEmitter<void>();

  @ViewChild('actionsOverFlowTemplate', { static: true }) actionsOverFlowTemplate: TemplateRef<any>;
  @ViewChild('conditionPathTemplate', { static: true }) conditionPathTemplate: TemplateRef<any>;
  @ViewChild('conditionRootElementTemplate', { static: true }) conditionRootElementTemplate: TemplateRef<any>;
  @ViewChild('conditionOperatorTemplate', { static: true }) conditionOperatorTemplate: TemplateRef<any>;
  @ViewChild('conditionValueTemplate', { static: true }) conditionValueTemplate: TemplateRef<any>;

  conditionModel: TableModel = new TableModel();
  _condition = {
    index: 0,
    rootElement: null,
    path: null,
    type: null,
    valAsString: null,
    valueType: null,
  }

  operators = [];
  availableFacts: {
    // HEADER: [],
    // GROUP: [],
    // ITEM: []
  }
  selections: any = {
    facts: [],
    conditions: {
      // 0: {
      //   facts: [],
      //   fact: undefined,
      //   paths: [],
      //   path: undefined,
      //   operators: [],
      //   operator: undefined,
      // }
    }
  }

  invalidValueNotification = {
    type: 'error',
    title: this.translateService.instant('rules.conditions_table_v1.invalid_notification.title'),
    message: this.translateService.instant('rules.conditions_table_v1.invalid_notification.message'),
    showClose: false
  }

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private rulesService: RulesServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) { }

  ngOnInit() {
    _debugX(RulesConditionsTableV1.getClassName(), 'ngOnInit', { this_rule: this.rule });
    this.constructTableHeader();
    this.rulesService.retrieveRuleConditionsTableData()
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleRetrieveRuleConditionsTableDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(RulesConditionsTableV1.getClassName(), 'ngOnInit', { response });

        this.availableFacts = this._transformFactTypesIntoDropDownItems(response?.ruleConditionFacts);
        this.operators = response?.ruleConditionOperators;
        this.eventsService.loadingEmit(false);
      });
  }

  ngOnChanges() {
    _debugX(RulesConditionsTableV1.getClassName(), 'ngOnChanges', { this_rule: this.rule });
    this.refreshTable();
  }

  ngOnDestroy() { }

  ngAfterViewInit() { }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rules.conditions_table_v1.index_header'),
      visible: false
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rules.conditions_table_v1.fact_header'),
      field: 'rootElement'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rules.conditions_table_v1.path_header'),
      field: 'path'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rules.conditions_table_v1.operator_header'),
      field: 'type'
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rules.conditions_table_v1.value_header'),
      field: 'valAsString',
      style: { width: '15%' }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rules.conditions_table_v1.action_header'),
    }));

    this.conditionModel.header = TABLE_HEADER;
  }

  handleRetrieveRuleConditionsTableDataError(error: any) {
    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: "error",
      title: this.translateService.instant('rules.conditions_table_v1.notification.error.title'),
      message: message,
      target: ".notification-container",
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  refreshTable() {
    this._refreshConditionIndexes();
    const TABLE_ROWS = [];
    if (this.rule.type) {
      this._setSelectionsFacts(this.rule.type);
    }

    if (
      !lodash.isEmpty(this.rule.conditions) &&
      lodash.isArray(this.rule.conditions)
    ) {
      const RULE_CONDITIONS = lodash.cloneDeep(this.rule.conditions);
      _debugX(RulesConditionsTableV1.getClassName(), 'refreshTable', { RULE_CONDITIONS });

      for (let condition of RULE_CONDITIONS) {
        const INDEX = condition.index;
        TABLE_ROWS.push(this.transformConditionToRow(condition));
        this.selections.conditions[INDEX] = condition;

        this._setFacts(condition, INDEX);
        this._setPaths(condition.rootElement, INDEX, condition.path);
        this._setOperators(condition, INDEX);
      }
    }
    this.conditionModel.data = TABLE_ROWS;
    this.onConditionRefresh.emit();
    _debugX(RulesConditionsTableV1.getClassName(), 'refreshTable', { condition_model_data: this.conditionModel.data });
  }

  transformConditionToRow(condition) {
    const ARRAY_INDEX = this._getConditionsArrayIndex(condition.index);
    const RET_VAL = [];
    RET_VAL.push(new TableItem({ data: condition?.index }));
    RET_VAL.push(new TableItem({ data: condition, template: this.conditionRootElementTemplate }));
    RET_VAL.push(new TableItem({ data: condition, template: this.conditionPathTemplate }));
    RET_VAL.push(new TableItem({ data: condition, template: this.conditionOperatorTemplate }));
    RET_VAL.push(new TableItem({ data: { condition, arrayIndex: ARRAY_INDEX }, template: this.conditionValueTemplate }));
    RET_VAL.push(new TableItem({ data: condition, template: this.actionsOverFlowTemplate }));
    return RET_VAL;
  }

  _transformFactTypesIntoDropDownItems(factTypes: any) {
    const RET_VAL = {};
    if (!lodash.isEmpty(factTypes)) {
      for (let factType of Object.keys(factTypes)) {
        const facts = factTypes[factType];
        RET_VAL[factType] = this._transformFactsIntoDropDownItems(facts);
      }
    }
    return RET_VAL;
  }

  _transformFactsIntoDropDownItems(facts: any) {
    const RET_VAL = [];
    if (
      !lodash.isEmpty(facts) &&
      lodash.isArray(facts)
    ) {
      for (let fact of facts) {
        RET_VAL.push(this._transformFactIntoDropdownItem(fact));
      }
    }
    return RET_VAL;
  }

  _transformFactIntoDropdownItem(fact: any) {
    let retVal;
    if (
      !lodash.isEmpty(fact?.content)
    ) {
      retVal = {
        content: `${fact?.content}`,
        selected: false,
        code: fact?.code,
        paths: fact?.paths
      }
    }
    return retVal;
  }

  _transformPathsIntoDropDownItems(fact: any, conditionPath: any = null) {
    const FACT_PATHS = ramda.path(['paths'], fact);
    _debugX(RulesConditionsTableV1.getClassName(), '_transformPathsIntoDropDownItems', { fact, conditionPath, factPaths: FACT_PATHS });
    const RET_VAL = [];
    if (!lodash.isEmpty(FACT_PATHS) && lodash.isArray(FACT_PATHS)) {
      for (let path of FACT_PATHS) {
        const PATH_NAME = path.content;
        const isSelected = conditionPath == PATH_NAME;
        let tmpPath = {
          content: PATH_NAME,
          selected: isSelected,
          id: PATH_NAME,
          name: PATH_NAME,
        };
        RET_VAL.push(tmpPath);
      }
    }
    return RET_VAL;
  }

  _setSelectionsFacts(ruleType: any) {
    this.selections.facts = this.availableFacts[ruleType];
    _debugX(RulesConditionsTableV1.getClassName(), '_setSelectionsFacts', { this_facts: this.selections.facts });
  }

  _setFacts(condition: any, index: string) {
    _debugX(RulesConditionsTableV1.getClassName(), '_setFacts', { this_facts: this.selections.facts });

    const SELECTED_CONDITION = this.selections.conditions[index];
    const SELECTABLE_FACTS = lodash.cloneDeep(this.selections.facts);
    SELECTED_CONDITION.fact = condition.rootElement;
    SELECTED_CONDITION.facts = SELECTABLE_FACTS.map(el => {
      if (el.content == condition.rootElement) {
        el.selected = true
      } else {
        el.selected = false
      }
      return el;
    });
    _debugX(RulesConditionsTableV1.getClassName(), '_setFacts', { this_condition: SELECTED_CONDITION });
  }

  _setPaths(fact: string, index: any, path: any = null) {
    _debugX(RulesConditionsTableV1.getClassName(), '_setPaths', { fact, index });

    const SELECTED_CONDITION = this.selections.conditions[index];
    const SELECTABLE_FACTS = this.selections.facts;
    const FACT = SELECTABLE_FACTS.find(el => el.content == fact);
    _debugX(RulesConditionsTableV1.getClassName(), '_setPaths', { FACT });

    SELECTED_CONDITION.paths = this._transformPathsIntoDropDownItems(FACT, path);
    _debugX(RulesConditionsTableV1.getClassName(), '_setPaths', { this_condition: SELECTED_CONDITION });
  }

  _setOperators(condition: any, index: any) {
    _debugX(RulesConditionsTableV1.getClassName(), '_setOperators', { condition, index });

    let APPLICABLE_OPERATORS = lodash.cloneDeep(this.operators);
    const SELECTED_CONDITION = this.selections.conditions[index];
    APPLICABLE_OPERATORS = APPLICABLE_OPERATORS.filter(operator => {
      if (
        (operator.ruleTypes && operator.ruleTypes.includes(this.rule.type)) &&
        (operator.facts && operator.facts.includes(condition.rootElement) || operator.facts.includes('any')) &&
        (operator.paths && operator.paths.includes(condition.path) || operator.paths.includes('any'))
      ) {
        if (operator.content == condition.type) {
          SELECTED_CONDITION.operator = operator.content;
          operator.selected = true
        } else {
          operator.selected = false
        }
        return operator;
      }
    })
    SELECTED_CONDITION.operators = APPLICABLE_OPERATORS;
    _debugX(RulesConditionsTableV1.getClassName(), '_setOperators', { this_condition: SELECTED_CONDITION });
  }

  addCondition() {
    const CONDITION = lodash.cloneDeep(this._condition);
    const INDEX = this.rule.conditions.length;
    CONDITION.index = INDEX;
    _debugX(RulesConditionsTableV1.getClassName(), 'addCondition', { CONDITION });

    this.rule.conditions.push(CONDITION);
    this.conditionModel.addRow(this.transformConditionToRow(CONDITION));
    this.selections.conditions[INDEX] = lodash.cloneDeep(this._condition);

    // Pre-select fact field if only one option is available.
    if (this._isSingleOption(this.selections.facts)) {
      const RULE_CONDITION_FACT = {
        item: this.selections.facts[0]
      }
      _debugX(RulesConditionsTableV1.getClassName(), 'addCondition', { RULE_CONDITION_FACT });
      this.handleFactSelect(RULE_CONDITION_FACT, CONDITION);
    }
    this._setFacts(CONDITION, INDEX);
    this.refreshTable();
  }

  _isSingleOption(selectionArray: any) {
    _debugX(RulesConditionsTableV1.getClassName(), '_isSingleOption', { selectionArray });

    const isSingleOption = (
      !lodash.isEmpty(selectionArray) &&
      lodash.isArray(selectionArray) &&
      selectionArray.length == 1
    )
    _debugX(RulesConditionsTableV1.getClassName(), '_isSingleOption', { isSingleOption });
    return isSingleOption;
  }

  removeCondition(condition: any, event: any) {
    _debugX(RulesConditionsTableV1.getClassName(), 'removeCondition', { condition, event });

    const index = ramda.path(['index'], condition);
    this._removeConditionFromTableModel(index);
    this._removeConditionFromRuleConditions(index);
    this.refreshTable();
    _debugX(RulesConditionsTableV1.getClassName(), 'handlePathSelect', { this_rule: this.rule });
  }

  _removeConditionFromTableModel(index: any) {
    const ARRAY_INDEX = this._getConditionsArrayIndex(index);
    _debugX(RulesConditionsTableV1.getClassName(), '_removeConditionFromTableModel', {
      index,
      ARRAY_INDEX
    });

    this.conditionModel.deleteRow(ARRAY_INDEX);
  }

  _removeConditionFromRuleConditions(index: any) {
    _debugX(RulesConditionsTableV1.getClassName(), '_removeConditionFromRuleConditions', {
      index,
      rule_conditions: this.rule.conditions
    });

    if (!lodash.isEmpty(this.rule.conditions) && lodash.isArray(this.rule.conditions)) {
      this.rule.conditions = this.rule.conditions.filter(el => el.index !== index);
    };
  }

  handleFactSelect(event: any, condition: any) {
    _debugX(RulesConditionsTableV1.getClassName(), 'handleFactSelect', {
      event, condition
    });

    const index = condition.index;
    const ARRAY_INDEX = this._getConditionsArrayIndex(index);
    const CONDITION_FACT: any = ramda.path(['item', 'content'], event);
    const RULE_CONDITION = this.rule.conditions[ARRAY_INDEX];
    RULE_CONDITION.rootElement = CONDITION_FACT;
    _debugX(RulesConditionsTableV1.getClassName(), 'handleFactSelect', {
      this_rule_condition: RULE_CONDITION
    });

    const SELECTED_CONDITION = this.selections.conditions[index];
    SELECTED_CONDITION.fact = CONDITION_FACT;
    this._setPaths(CONDITION_FACT, index);
    this._setOperators(condition, index);
    this.onConditionRefresh.emit();
  }

  handlePathSelect(event: any, condition: any) {
    _debugX(RulesConditionsTableV1.getClassName(), 'handlePathSelect', {
      event, condition
    });

    const index = condition.index;
    const ARRAY_INDEX = this._getConditionsArrayIndex(index);
    const CONDITION_PATH = ramda.path(['item', 'content'], event);
    this.rule.conditions[ARRAY_INDEX].path = CONDITION_PATH;
    _debugX(RulesConditionsTableV1.getClassName(), 'handlePathSelect', {
      this_rule: this.rule
    });

    this.selections.conditions[index].path = CONDITION_PATH;
    this._setOperators(condition, index);
    _debugX(RulesConditionsTableV1.getClassName(), 'handlePathSelect', {
      this_selections: this.selections
    });

    this.onConditionRefresh.emit();
  }

  handleOperatorSelect(event: any, condition: any) {
    _debugX(RulesConditionsTableV1.getClassName(), 'handleOperatorSelect', {
      event, condition
    });

    const index = condition.index;
    const ARRAY_INDEX = this._getConditionsArrayIndex(index);
    const OPERATOR = ramda.path(['item', 'content'], event);
    const VALUE_TYPE = ramda.path(['item', 'operatorValueType'], event);
    this.rule.conditions[ARRAY_INDEX].type = OPERATOR;
    this.rule.conditions[ARRAY_INDEX].valueType = VALUE_TYPE;
    _debugX(RulesConditionsTableV1.getClassName(), 'handleOperatorSelect', {
      this_rule: this.rule
    });

    this.selections.conditions[index].operator = OPERATOR;
    _debugX(RulesConditionsTableV1.getClassName(), 'handleOperatorSelect', {
      this_selections_condition: this.selections.conditions[index]
    });

    this.onConditionRefresh.emit();
  }

  _getConditionsArrayIndex(index: any) {
    return this.rule.conditions.findIndex((el) => el.index == index);
  };

  _refreshConditionIndexes() {
    const TMP_SELECTIONS_CONDITIONS = {};
    this.rule.conditions.forEach((condition, index) => {
      condition.index = index;
      TMP_SELECTIONS_CONDITIONS[index] = condition;
    });
    this.selections.conditions = TMP_SELECTIONS_CONDITIONS;

    _debugX(RulesConditionsTableV1.getClassName(), '_refreshConditionIndexes', {
      this_selections_conditions: this.selections.conditions,
      this_rule_conditions: this.rule.conditions
    });

  };

  containsInvalidRows() {
    return this.rule.conditions.some(condition => condition.invalid)
  }

  validateArray(condition) {
    if (condition.valueType !== this.operatorValueType.ARRAY) {
      condition.invalid = false;
      return;
    }

    const VALUE = condition.valAsString;
    let valid = true;
    try {
      valid = lodash.isArray(JSON.parse(VALUE))
    } catch {
      valid = false;
    }
    condition["invalid"] = !valid;
  }

  get operatorValueType() {
    return this.rulesService.operatorValueType;
  }
}
