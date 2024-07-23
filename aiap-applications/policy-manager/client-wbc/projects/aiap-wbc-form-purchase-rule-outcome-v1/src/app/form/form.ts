/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';


import * as lodash from 'lodash';

import {
  _debugW,
} from 'client-shared-utils';

import {
  BaseFieldWbcV1,
} from 'client-shared-components';

@Component({
  selector: 'aiap-wbc-purchase-rule-outcome-form-v1',
  templateUrl: './form.html',
  styleUrls: ['./form.scss']
})
export class PurchaseRuleOutcomeFormV1 extends BaseFieldWbcV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'PurchaseRuleOutcomeFormV1';
  }

  @Input() context: any;
  @Output() contextChange = new EventEmitter<any>();

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  _state: any = {}
  state = lodash.cloneDeep(this._state);

  constructor() {
    super();
  }

  ngOnInit(): void {
    _debugW(PurchaseRuleOutcomeFormV1.getClassName(), 'ngOnChanges',
      {
        this_state: this.state,
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugW(PurchaseRuleOutcomeFormV1.getClassName(), 'ngOnChanges',
      {
        changes: changes,
        this_context: this.context,
        this_value: this.value,
        this_state: this.state,
      }
    );
  }

  ngOnDestroy(): void { }

}
