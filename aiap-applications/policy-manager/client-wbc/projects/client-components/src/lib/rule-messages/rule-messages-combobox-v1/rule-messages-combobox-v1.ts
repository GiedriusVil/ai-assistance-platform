/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { Observable, of } from 'rxjs';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseComboboxV1,
} from 'client-shared-components';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  RULES_MESSAGES_MESSAGES_V1,
  RuleMessagesServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rule-messages-combobox-v1',
  templateUrl: './rule-messages-combobox-v1.html',
  styleUrls: ['./rule-messages-combobox-v1.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm,
    }
  ]
})
export class RuleMessagesComboboxV1 extends BaseComboboxV1 implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'RuleMessagesComboboxV1';
  }

  constructor(
    private notificationService: NotificationService,
    private ruleMessagesService: RuleMessagesServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super();
  }

  ngAfterViewInit(): void { }

  defaultSelectionType() {
    const RET_VAL = 'single';
    return RET_VAL;
  }

  defaultQuery() {
    const RET_VAL = {
      type: DEFAULT_TABLE.RULE_MESSAGES_V1.TYPE,
      sort: DEFAULT_TABLE.RULE_MESSAGES_V1.SORT,
    };
    _debugW(RuleMessagesComboboxV1.getClassName(), 'defaultQuery',
      {
        RET_VAL
      });
    return RET_VAL;
  }

  protected observeItemsLoad(state: any): Observable<any> {
    const QUERY = this.queryService.query(this.state?.query?.type);
    _debugW(RuleMessagesComboboxV1.getClassName(), 'observeItemsLoad',
      {
        state, QUERY
      });
    const RET_VAL = this.ruleMessagesService.findManyByQuery(QUERY);
    return RET_VAL;
  }

  protected handleFindManyByQueryError(error: any) {
    _debugW(RuleMessagesComboboxV1.getClassName(), 'handleSubmitEvent',
      {
        error
      });

    const NOTIFICATION = RULES_MESSAGES_MESSAGES_V1
      .ERROR
      .FIND_MANY_BY_QUERY();
    this.notificationService.showNotification(NOTIFICATION);

    const STATE_NEW = lodash.cloneDeep(this.state);
    STATE_NEW.skeleton = false;
    this.state = STATE_NEW;
    return of();
  }

  protected transformItemIntoSelection(item: any) {
    const RET_VAL = {
      content: item?.name,
      value: item,
    };
    return RET_VAL;
  }

  protected isEqualItemWithSelection(item: any, selection: any): boolean {
    let retVal = lodash.isEqual(
      {
        id: item?.id,
      },
      {
        id: selection?.value?.id,
      }
    );
    return retVal;
  }


  handleSubmitEvent(event: any) {
    _debugW(RuleMessagesComboboxV1.getClassName(), 'handleSubmitEvent',
      {
        event
      });
  }

  emitValueChangeEvent(items: any) {
    _debugW(RuleMessagesComboboxV1.getClassName(), 'emitValueChangeEvent',
      {
        items: items,
        this_state: this.state,
      });
    let valueNew;
    if (
      this.isMultiEnabled()
    ) {
      valueNew = [];
      if (
        lodash.isArray(items)
      ) {
        for (let item of items) {
          valueNew.push(item?.value);
        }
      }
    } else {
      valueNew = ramda.path([0, 'value'], items);
    }
    this.valueChange.emit(valueNew);
  }

}
