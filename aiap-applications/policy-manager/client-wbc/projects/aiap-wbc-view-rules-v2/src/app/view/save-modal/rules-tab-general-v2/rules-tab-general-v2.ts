/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import * as lodash from 'lodash';

import {
  _debugW,
} from 'client-shared-utils';

import {
  BaseTabV1,
} from 'client-shared-components';

@Component({
  selector: 'aiap-rules-tab-general-v2',
  templateUrl: './rules-tab-general-v2.html',
  styleUrls: ['./rules-tab-general-v2.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm,
    }
  ]
})
export class RulesTabGeneralV2 extends BaseTabV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'RulesTabGeneralV2';
  }

  constructor() {
    super();
  }

  ngOnInit(): void {
    _debugW(RulesTabGeneralV2.getClassName(), 'handleValidationEngagementChange',
      {
        this_context: this.context,
        this_value: this.value,
      });
  }

  handleValidationEngagementChange(event: any) {
    const VALUE_NEW = lodash.cloneDeep(this.value);
    const CONTEXT_NEW = lodash.cloneDeep(this.context);
    VALUE_NEW.engagement = {
      id: event?.id,
      key: event?.key,
    }
    CONTEXT_NEW.wbc = event?.actions?.wbc;
    _debugW(RulesTabGeneralV2.getClassName(), 'handleValidationEngagementChange',
      {
        this_context: this.context,
        this_value: this.value,
        event: event,
        VALUE_NEW: VALUE_NEW,
        CONTEXT_NEW: CONTEXT_NEW,
      });

    this.contextChange.emit(CONTEXT_NEW);
    this.valueChange.emit(VALUE_NEW);
  }
}
