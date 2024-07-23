/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, EventEmitter, Input, Output, OnDestroy } from '@angular/core';

import * as lodash from 'lodash';

import {
  RULE_OUTCOME_TYPE,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aca-catalog-rules-outcome-type',
  templateUrl: './catalog-rules-outcome-type.comp.html',
  styleUrls: ['./catalog-rules-outcome-type.comp.scss'],
})
export class CatalogRulesOutcomeType implements OnInit, OnDestroy {

  static getClassName() {
    return 'CatalogRulesOutcomeType';
  }

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  ngOnInit() { }

  ngOnDestroy() { }

  ibmButtonRestrict() {
    let retVal = 'tetriary';
    if (
      this.value?.type === RULE_OUTCOME_TYPE.RESTRICT
    ) {
      retVal = 'primary';
    }
    return retVal;
  }

  ibmButtonAllow() {
    let retVal = 'tetriary';
    if (
      this.value?.type === RULE_OUTCOME_TYPE.ALLOW
    ) {
      retVal = 'primary';
    }
    return retVal;
  }

  handleRestrictModeClickEvent(event: any) {
    _debugX(CatalogRulesOutcomeType.getClassName(), `handleRestrictModeClickEvent`, { event });
    let newValue: any = {};
    if (
      lodash.isObject(this.value)
    ) {
      newValue = lodash.cloneDeep(this.value);
    }
    newValue.type = RULE_OUTCOME_TYPE.RESTRICT;
    this.valueChange.emit(newValue);
  }

  handleAllowModeClickEvent(event: any) {
    _debugX(CatalogRulesOutcomeType.getClassName(), `handleAllowModeClickEvent`, {});
    let newValue: any = {};
    if (
      lodash.isObject(this.value)
    ) {
      newValue = lodash.cloneDeep(this.value);
    }
    newValue.type = RULE_OUTCOME_TYPE.ALLOW;
    this.valueChange.emit(newValue);
  }

}
