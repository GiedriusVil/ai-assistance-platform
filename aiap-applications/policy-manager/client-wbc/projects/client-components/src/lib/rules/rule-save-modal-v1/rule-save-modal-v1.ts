/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { NotificationService } from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  BaseModal,
} from 'client-shared-views';

import {
  EventsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  RulesImportServiceV1,
  RulesServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rule-save-modal-v1',
  templateUrl: './rule-save-modal-v1.html',
  styleUrls: ['./rule-save-modal-v1.scss']
})
export class RuleSaveModalV1 extends BaseModal implements OnInit {

  static getClassName() {
    return 'RuleSaveModalV1';
  }

  @Input() isRuleImport: boolean = false;

  @ViewChild('actionsOverFlowTemplate', { static: true }) actionsOverFlowTemplate: TemplateRef<any>;

  isEdit = false;
  isRuleEnabled = true;

  selections: any = {
    buyers: [],
    buyer: undefined,
    types: [],
    type: undefined,
    messages: [],
  }

  _rule: any = {
    id: null,
    buyer: {
      id: null,
    },
    type: null,
    name: null,
    filters: [],
    actions: [],
    conditions: [],
    message: null,
    status: {
      enabled: null,
    }
  };
  rule: any = lodash.cloneDeep(this._rule);

  messageDropdownInvalid: boolean = false;
  conditionsInvalid: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private rulesService: RulesServiceV1,
    private rulesImportService: RulesImportServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  refreshFormData() {
    _debugX(RuleSaveModalV1.getClassName(), 'refreshFormData', { this_rule: this.rule });
    this.markInvalidValues();
    let service;
    if (
      this.isRuleImport
    ) {
      service = this.rulesImportService.retrieveRuleSaveFormData(this.rule)
    } else {
      service = this.rulesService.retrieveRuleSaveFormData(this.rule)
    }
    service.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error) => this.handleRetrieveRuleSaveFormDataError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(RuleSaveModalV1.getClassName(), 'refreshFormData', { response });

      this.selections.types = this._transformTypesIntoDropDownItems(response?.types);
      this.selections.buyers = this._transformBuyersIntoDropDownItems(response?.buyers?.items);
      this.selections.messages = this._transformMessagesIntoDropDownItems(response?.messages?.items);
      this.eventsService.loadingEmit(false);
      this.isOpen = true;
      _debugX(RuleSaveModalV1.getClassName(), 'refreshFormData', { this_selections: this.selections });

    });
    this.setEditAction();
  }

  setEditAction() {
    if (!lodash.isEmpty(this.rule.id)) {
      this.isEdit = true;
    }
  }

  handleBuyerSelection() {
    this.rule.buyer = this.selections?.buyer;
  }

  toggleDisabledRule() {
    this.isRuleEnabled = !this.isRuleEnabled;
  }

  _transformTypesIntoDropDownItems(types) {
    const RET_VAL = [];
    if (
      !lodash.isEmpty(types) &&
      lodash.isArray(types)
    ) {
      for (let type of types) {
        let tmpType = this._transformTypeIntoDropDownItem(type);
        if (tmpType) {
          RET_VAL.push(tmpType);
        }
      }
    }
    return RET_VAL;
  }

  _transformTypeIntoDropDownItem(type: any) {
    let retVal;
    if (
      !lodash.isEmpty(type?.content) &&
      !lodash.isEmpty(type?.code)
    ) {
      const isSelected = this.rule?.type === type?.code;
      retVal = {
        content: `${type?.content}`,
        selected: isSelected,
        code: type?.code,
      }
    }
    return retVal;
  }

  _transformBuyersIntoDropDownItems(buyers: any) {
    const RET_VAL = [];
    if (
      !lodash.isEmpty(buyers) &&
      lodash.isArray(buyers)
    ) {
      for (let buyer of buyers) {
        let tmpBuyer = this._transformBuyerIntoDropDownItem(buyer);
        if (tmpBuyer) {
          RET_VAL.push(tmpBuyer);
        }
      }
    }
    return RET_VAL;
  }

  _transformBuyerIntoDropDownItem(buyer: any) {
    let retVal;
    if (
      !lodash.isEmpty(buyer?.id) &&
      !lodash.isEmpty(buyer?.name)
    ) {
      const BUYER_NAME = buyer.name;
      const isSelected = this.rule?.buyer?.id === buyer.id;
      retVal = {
        content: `${BUYER_NAME}`,
        selected: isSelected,
        id: buyer.id,
        name: buyer.name,
      }
    }
    return retVal;
  }

  _transformMessagesIntoDropDownItems(messages: any) {
    const RET_VAL = [];
    if (
      !lodash.isEmpty(messages) &&
      lodash.isArray(messages)
    ) {
      for (let message of messages) {
        const MESSAGE_NAME = message.name;
        const DEFAULT_MESSAGE = message?.templates[0]?.message;
        const isSelected = this.rule?.message?.id === message.id;
        let tmpMessage = {
          content: `${MESSAGE_NAME} [${DEFAULT_MESSAGE}]`,
          selected: isSelected,
          id: message.id,
          entity: message,
        };
        RET_VAL.push(tmpMessage);
      }
    }
    return RET_VAL;
  }

  handleRetrieveRuleSaveFormDataError(error: any) {
    _errorX(RuleSaveModalV1.getClassName(), 'handleRetrieveRuleSaveFormDataError', { error });
    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: "error",
      title: this.translateService.instant('rule_save_modal_v1.notification.error.title'),
      message: message,
      target: ".notification-container",
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  private _sanitizedRule() {
    const RET_VAL = lodash.cloneDeep(this.rule);
    RET_VAL.status.enabled = this.isRuleEnabled;
    return RET_VAL;
  }

  save() {
    const SANITIZED_RULE = this._sanitizedRule();
    SANITIZED_RULE.conditions = this._removeUndefinedElements(SANITIZED_RULE.conditions);
    if (!this.isValidRule(SANITIZED_RULE)) {
      const NOTIFICATION = {
        type: 'error',
        title: this.translateService.instant('rule_save_modal_v1.notification.error.invalid_data.title'),
        target: '.notification-container',
        duration: 5000
      };
      this.notificationService.showNotification(NOTIFICATION);
      return;
    }
    _debugX(RuleSaveModalV1.getClassName(), 'save', { SANITIZED_RULE });
    let service;
    if (
      this.isRuleImport
    ) {
      service = this.rulesImportService.saveOne(SANITIZED_RULE);
    } else {
      service = this.rulesService.saveOne(SANITIZED_RULE);
    }
    service.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError(error => this.hanldeRuleSaveError(error)),
      takeUntil(this._destroyed$)
    ).subscribe((response) => {
      _debugX(RuleSaveModalV1.getClassName(), 'save', { response });

      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('rule_save_modal_v1.notification.success.title'),
        target: '.notification-container',
        duration: 5000
      };
      this.notificationService.showNotification(NOTIFICATION);
      this.isOpen = false;
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(undefined);
    });
  }

  _removeUndefinedElements(data) {
    return data = data.filter(element => element !== undefined);
  }

  hanldeRuleSaveError(error: any) {
    _errorX(RuleSaveModalV1.getClassName(), 'hanldeRuleSaveError', { error });

    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('rule_save_modal_v1.notification.error.save_title'),
      message: message,
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  handleRuleTypeSelect(event: any) {
    const RULE_TYPE = event?.item?.content;
    this.rule.conditions = [];
    this.rule.type = RULE_TYPE;
  }

  handleMessageSelect(event: any) {
    const SELECTED_MESSAGE_ENTITY = event?.item?.entity;
    this.rule.message = SELECTED_MESSAGE_ENTITY;
    this.messageDropdownInvalid = false;
  }

  handleMessageSearch(event: any) {
    const SELECTED = this.selections.messages.find(message => {
      message.content.toLowerCase().includes(event.toLowerCase());
    });
    if (!SELECTED) {
      this.messageDropdownInvalid = true;
    } else {
      this.messageDropdownInvalid = false;
    };
  }

  stopPropagation(event: any) {
    event.stopPropagation();
  }

  close() {
    this.isOpen = false;
    this.isEdit = false;
  }

  show(rule: any) {
    _debugX(RuleSaveModalV1.getClassName(), 'show', { rule });

    if (
      lodash.isEmpty(rule?.id)
    ) {
      this.rule = lodash.cloneDeep(this._rule);
    } else {
      this.rule = lodash.cloneDeep(rule);
      this.isRuleEnabled = rule.status.enabled;
    }

    this.selections.buyer = {
      id: rule?.buyer?.id
    }
    this.refreshFormData();
  }

  isValidRule(rule: any) {
    const RET_VAL = rule.conditions.every(condition => {
      let valid = true;
      if (this.operatorValueType.ARRAY == condition.valueType) {
        try {
          valid &&= lodash.isArray(JSON.parse(condition.valAsString));
        } catch {
          valid &&= false
        }
      }
      return valid;
    })
    return RET_VAL;
  }
  async markInvalidValues() {
    await Promise.all(this.rule.conditions.map(async condition => {
      let valid = true;
      if (!condition.valueType) {
        await this.mapValueType(condition);
      }
      if (this.operatorValueType.ARRAY == condition.valueType) {
        try {
          valid &&= lodash.isArray(JSON.parse(condition.valAsString));
        } catch {
          valid &&= false
        }
      }
      condition['invalid'] = !valid;
    }));
  }
  async mapValueType(condition) {
    const CONDITION_TABLE_DATA = await this.rulesService.retrieveRuleConditionsTableData().toPromise();
    const CONDITION_OPERATORS = CONDITION_TABLE_DATA.ruleConditionOperators;
    const OPERATOR = CONDITION_OPERATORS.find(operator => operator.content === condition.type);
    condition['valueType'] = OPERATOR?.operatorValueType
  }
  get operatorValueType() {
    return this.rulesService.operatorValueType;
  }

  areConditionsInvalid() {
    const CONDITIONS: any[] = lodash.cloneDeep(this.rule?.conditions);
    const INVALID_CONDITION = CONDITIONS?.find(condition => {
      if (
        lodash.isEmpty(condition?.rootElement) ||
        lodash.isEmpty(condition?.path) ||
        lodash.isEmpty(condition?.type)
      ) {
        return condition;
      }
    });
    this.conditionsInvalid = !lodash.isEmpty(INVALID_CONDITION);
  };

  isFormInvalid() {
    const RET_VAL = this.messageDropdownInvalid || !this.rule.message || this.rule.conditions.length < 1 || !this.rule.buyer.id || this.conditionsInvalid;
    return RET_VAL
  }
}
