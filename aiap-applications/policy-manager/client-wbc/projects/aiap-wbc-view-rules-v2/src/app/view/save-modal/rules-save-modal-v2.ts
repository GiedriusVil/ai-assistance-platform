/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
  Tab,
} from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
  deserializeDatesInValue,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseModal,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  RulesServiceV2,
} from 'client-services';

import {
  RULES_MESSAGES_V2,
} from '../../messages';

import { RulesTabOutcomeV2 } from './rules-tab-outcome-v2/rules-tab-outcome-v2';
import { RulesTabConditionsV2 } from './rules-tab-conditions-v2/rules-tab-conditions-v2';

@Component({
  selector: 'aiap-rules-save-modal-v2',
  templateUrl: './rules-save-modal-v2.html',
  styleUrls: ['./rules-save-modal-v2.scss']
})
export class RulesSaveModalV2 extends BaseModal implements OnInit, OnDestroy {

  static getClassName() {
    return 'RulesSaveModalV2';
  }

  @ViewChild('tabGeneral') tabGeneral: Tab;
  @ViewChild('tabConditions') tabConditions: Tab;
  @ViewChild('tabOutcome') tabOutcome: Tab;

  @ViewChild('rulesTabConditions') rulesTabConditions: RulesTabConditionsV2;
  @ViewChild('rulesTabOutcome') rulesTabOutcome: RulesTabOutcomeV2;


  isEditable: boolean = true;

  queryType = DEFAULT_TABLE.RULES_V2.TYPE;


  _context: any = {
    wbc: undefined,
  }
  context = lodash.cloneDeep(this._context);

  _rule = {
    id: undefined,
    key: undefined,
    name: undefined,
    effective: undefined,
    expires: undefined,
    description: undefined,
    engagement: undefined,
  };
  rule = lodash.cloneDeep(this._rule);

  _selections = {
    engagements: [],
    selectedEngagement: undefined,
  }

  validationEngagements: any[] = [];

  selections = lodash.cloneDeep(this._selections);

  savedKey = undefined;
  ruleIsSaved = false;

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private rulesServiceV2: RulesServiceV2,
    private queryService: QueryServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  loadSaveModalData(id: string) {
    _debugW(RulesSaveModalV2.getClassName(), 'loadSaveModalData', { id });
    this.eventsService.loadingEmit(true);
    this.rulesServiceV2.loadSaveModalData(id)
      .pipe(
        catchError((error) => this.handleLoadSaveModalDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugW(RulesSaveModalV2.getClassName(), 'loadSaveModalData', { response });
        let newRule;
        if (
          !lodash.isEmpty(response?.rule)
        ) {
          newRule = lodash.cloneDeep(response?.rule);
          this.savedKey = newRule.key;
          this.ruleIsSaved = true;
        } else {
          newRule = lodash.cloneDeep(this._rule);
        }
        this.rule = deserializeDatesInValue(newRule);

        const CONTEXT_NEW = lodash.cloneDeep(this.context);

        CONTEXT_NEW.wbc = response?.engagement?.actions?.wbc;

        this.context = CONTEXT_NEW;

        this.eventsService.loadingEmit(false);
        this.superShow();
        _debugW(RulesSaveModalV2.getClassName(), 'loadSaveModalData',
          {
            this_rule: this.rule,
          });
      });
  }


  private _save(onSave: any) {
    const RULE = lodash.cloneDeep(this.rule);
    _debugW(RulesSaveModalV2.getClassName(), 'observeSave',
      {
        RULE
      });

    const RET_VAL = this.rulesServiceV2.saveOne(RULE)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {

        _debugW(RulesSaveModalV2.getClassName(), 'save', { response });
        this.notificationService.showNotification(RULES_MESSAGES_V2.SUCCESS.SAVE_ONE);
        this.rule = lodash.cloneDeep(response);
        _debugW(RulesSaveModalV2.getClassName(), 'save', { this_rule: this.rule });
        this.savedKey = RULE.key;
        this.ruleIsSaved = true;
        this.eventsService.loadingEmit(false);
        this.eventsService.filterEmit(null);

        if (
          onSave
        ) {
          onSave();
        }

        // setTimeout(
        //   () => {
        //     this.showTab(this.tabConditions);
        //   },
        //   0,
        // );
      });
    return RET_VAL;
  }

  save() {
    const ON_SAVE = undefined;
    this._save(ON_SAVE);
  }

  saveAndClose() {
    const ON_SAVE = () => {
      this.close();
    };
    this._save(ON_SAVE);
  }

  handleTabConditionsSelect() {
    _debugW(
      RulesSaveModalV2.getClassName(),
      'handleConditionsTabSelect',
      {
        this_rule: this.rule
      });
    const VALIDATION_ENGAGEMENT_ID = this.rule?.engagement?.id;
    this.rulesTabConditions.updateTabData(VALIDATION_ENGAGEMENT_ID);
  }

  handleTabOutcomeSelect() {
    _debugW(
      RulesSaveModalV2.getClassName(),
      'handleTabOutcomeSelect',
      {
        this_rule: this.rule
      });
    this.rulesTabOutcome.resetView()
  }

  refreshTableData(): void {
    this.eventsService.filterEmit(this.queryService.query(this.queryType));
  }

  show(id: any) {
    this.rule = lodash.cloneDeep(this._rule);
    this.selections = lodash.cloneDeep(this._selections);
    this.rulesTabConditions.rulesConditionsTableV2.resetTable();
    this.ruleIsSaved = false;
    this.showTab(this.tabGeneral);
    this.loadSaveModalData(id);
  }

  isDisabledRulesTabConditions() {
    const RET_VAL =
      !this.ruleIsSaved ||
      this.rule.key !== this.savedKey ||
      lodash.isEmpty(this.rule.key) ||
      lodash.isEmpty(this.rule.engagement);
    return RET_VAL;
  }

  isDisabledRulesTabActions() {
    const RET_VAL =
      !this.ruleIsSaved ||
      this.rule.key !== this.savedKey ||
      lodash.isEmpty(this.rule.key) ||
      lodash.isEmpty(this.rule.engagement);
    return RET_VAL;
  }

  isFormInvalid() {
    const RET_VAL =
      lodash.isEmpty(this.rule.key) ||
      lodash.isEmpty(this.rule.name) ||
      lodash.isNil(this.rule.effective) ||
      lodash.isNil(this.rule.expires) ||
      lodash.isEmpty(this.rule.engagement);
    return RET_VAL;
  }

  showTab(tab: Tab) {
    _debugW(RulesSaveModalV2.getClassName(), 'showTab', { this_rule: this.rule });
    this.hideAllTabs();
    tab.active = true;
    tab.doSelect();
  }

  hideAllTabs() {
    this.tabConditions.active = false;
    this.tabGeneral.active = false;
    this.tabOutcome.active = false;
  }

  handleLoadSaveModalDataError(error: any) {
    _errorW(RulesSaveModalV2.getClassName(), 'handleLoadSaveModalDataError', { error });
    this.notificationService.showNotification(RULES_MESSAGES_V2.ERROR.FIND_ONE_BY_ID);
    return of();
  }

  handleSaveOneError(error: any) {
    _errorW(RulesSaveModalV2.getClassName(), 'handleSaveOneError', { error });
    this.notificationService.showNotification(RULES_MESSAGES_V2.ERROR.SAVE_ONE);
    return of();
  }

  handleRuleChangeByTabGeneral(event: any) {
    _debugW(RulesSaveModalV2.getClassName(), 'handleRuleChangeByTabGeneral', { event });
    this.rule = lodash.cloneDeep(event);
  }

  handleContextChangeByTabGeneral(event: any) {
    _debugW(RulesSaveModalV2.getClassName(), 'handleContextChangeByTabGeneral', { event });
    this.context = event;
  }

  handleRuleChangeByTabConditions(event: any) {
    _debugW(RulesSaveModalV2.getClassName(), 'handleRuleChangeByTabConditions', { event });
    this.rule = lodash.cloneDeep(event);
  }

  handleRuleChangeByTabOutcome(event: any) {
    _debugW(RulesSaveModalV2.getClassName(), 'handleRuleChangeByTabOutcome', { event });
    this.rule = lodash.cloneDeep(event);
  }

  handleContextChangeByTabOutcome(event: any) {
    _debugW(RulesSaveModalV2.getClassName(), 'handleContextChangeByTabGeneral', { event });
  }

}
