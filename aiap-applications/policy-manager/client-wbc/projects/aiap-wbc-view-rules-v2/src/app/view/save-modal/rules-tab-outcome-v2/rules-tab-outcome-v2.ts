/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  BaseTabV1,
  WbcFormLoaderV1,
} from 'client-shared-components';

@Component({
  selector: 'aiap-rules-tab-outcome-v2',
  templateUrl: './rules-tab-outcome-v2.html',
  styleUrls: ['./rules-tab-outcome-v2.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm
    }
  ]
})
export class RulesTabOutcomeV2 extends BaseTabV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'RulesTabOutcomeV2';
  }

  @ViewChild('wbcFormLoaderV1') wbcFormLoaderV1: WbcFormLoaderV1;

  constructor() {
    super();
  }

  ngOnInit(): void {
    _debugW(RulesTabOutcomeV2.getClassName(), 'ngOnInit',
      {
        this_context: this.context,
        this_value: this.value,
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugW(RulesTabOutcomeV2.getClassName(), 'ngOnChanges',
      {
        this_context: this.context,
        this_value: this.value,
        changes: changes,
      });
  }

  handleContextChange(event: any) {
    _debugW(RulesTabOutcomeV2.getClassName(), 'handleContextChange',
      {
        this_context: this.context,
        this_value: this.value,
        event: event,
      });
    this.contextChange.emit(event);
  }

  handleValueChange(event: any) {
    _debugW(RulesTabOutcomeV2.getClassName(), 'handleValueChange',
      {
        this_context: this.context,
        this_value: this.value,
        event: event,
      });
    this.valueChange.emit(event);
  }

  resetView() {
    _debugW(RulesTabOutcomeV2.getClassName(), 'resetView',
      {
        this_context: this.context,
        this_value: this.value,
      });
    this.wbcFormLoaderV1.resetView();
  }

}
