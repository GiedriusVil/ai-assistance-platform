/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { catchError, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import { NotificationService } from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  RULE_ACTIONS_MESSAGES_V1,
  RuleActionsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rule-actions-combobox-v1',
  templateUrl: './rule-actions-combobox-v1.html',
  styleUrls: ['./rule-actions-combobox-v1.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm,
    }
  ]
})
export class RuleActionsComboboxV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'RuleActionsComboboxV1';
  }

  public _destroyed$: Subject<void> = new Subject();

  @Input() value;
  @Output() valueChange = new EventEmitter<Array<any>>();

  _state: any = {
    ruleActionsRaw: [],
    ruleActions: [],
    ruleActionsSelected: [],
    size: 'md',
    label: this.translateService.instant('rule_actions.combobox_v1.label'),
    helperText: this.translateService.instant('rule_actions.combobox_v1.helper_text'),
    invalidText: 'Invalid',
    theme: 'dark',
    query: {
      type: DEFAULT_TABLE.RULE_ACTIONS_V1.TYPE,
      sort: DEFAULT_TABLE.RULE_ACTIONS_V1.SORT,
    }
  }
  state: any = lodash.cloneDeep(this._state);

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private queryService: QueryServiceV1,
    private ruleActionsService: RuleActionsServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) { }

  ngOnInit() {
    this.loadItems();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugW(RuleActionsComboboxV1.getClassName(), 'ngOnChanges',
      {
        changes: changes,
        this_value: this.value,
      });

    const NEW_STATE = lodash.cloneDeep(this.state);
    this.appendToStateRuleActions(NEW_STATE, NEW_STATE.ruleActionsRaw, this.value);
    this.state = NEW_STATE;
  }

  handleSelectedEvent(items: any) {
    _debugW(RuleActionsComboboxV1.getClassName(), 'handleSelectedEvent',
      {
        items
      });
  }

  handleCloseEvent(event: any) {
    _debugW(RuleActionsComboboxV1.getClassName(), 'handleCloseEvent',
      {
        event
      });

    const NEW_VALUE = [];
    if (
      lodash.isArray(this.state?.ruleActionsSelected)
    ) {
      for (let action of this.state?.ruleActionsSelected) {
        if (
          action?.value?.key
        ) {
          NEW_VALUE.push(action?.value?.key);
        }
      }
    }
    this.valueChange.emit(NEW_VALUE);
  }

  handleSubmitEvent(event: any) {
    _debugW(RuleActionsComboboxV1.getClassName(), 'handleSubmitEvent',
      {
        event
      });
  }

  private loadItems() {
    const QUERY = this.queryService.query(this.state.queryType);
    _debugW(RuleActionsComboboxV1.getClassName(), 'loadItems',
      {
        QUERY
      });

    this.eventsService.loadingEmit(true);
    this.ruleActionsService.findManyByQuery(QUERY)
      .pipe(
        catchError(error => this.handleFindManyByQueryError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugW(RuleActionsComboboxV1.getClassName(), 'loadItems',
          {
            response
          });


        this.eventsService.loadingEmit(false);
        const NEW_STATE = lodash.cloneDeep(this._state);
        NEW_STATE.ruleActionsRaw = response?.items;

        this.appendToStateRuleActions(NEW_STATE, NEW_STATE.ruleActionsRaw, this.value);
        this.state = NEW_STATE;
      });
  }

  private handleFindManyByQueryError(error: any) {
    _debugW(RuleActionsComboboxV1.getClassName(), 'handleSubmitEvent', { error });
    const NOTIFICATION = RULE_ACTIONS_MESSAGES_V1
      .ERROR
      .FIND_MANY_BY_QUERY();

    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }


  private appendToStateRuleActions(state: any, ruleActions: any, value: any = undefined) {
    const RULE_ACTIONS = [];
    const RULE_ACTIONS_SELECTED = [];
    if (
      !lodash.isEmpty(ruleActions) &&
      lodash.isArray(ruleActions)
    ) {
      for (let ruleAction of ruleActions) {
        let selection: any = {
          content: ruleAction?.text,
          value: {
            key: ruleAction?.key,
            text: ruleAction?.text,
          }
        }
        if (
          lodash.isArray(value)
        ) {
          let tmpItem = value.find((item: any) => {
            let condition = item === selection?.value?.key;
            return condition;
          });
          if (
            tmpItem
          ) {
            selection.selected = true;
            RULE_ACTIONS_SELECTED.push(selection);
          }
        }
        RULE_ACTIONS.push(selection);
      }
    }
    state.ruleActions = RULE_ACTIONS;
    state.ruleActionsSelected = RULE_ACTIONS_SELECTED;
  }

}
