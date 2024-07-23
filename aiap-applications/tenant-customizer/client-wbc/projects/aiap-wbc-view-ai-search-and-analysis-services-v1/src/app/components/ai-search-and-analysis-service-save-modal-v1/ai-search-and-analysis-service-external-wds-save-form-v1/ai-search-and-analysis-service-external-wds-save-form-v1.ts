/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { ControlContainer, NgForm } from '@angular/forms';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-ai-search-and-analysis-service-external-wds-save-form-v1',
  templateUrl: './ai-search-and-analysis-service-external-wds-save-form-v1.html',
  styleUrls: ['./ai-search-and-analysis-service-external-wds-save-form-v1.scss'],
  viewProviders: [{
    provide: ControlContainer,
    useExisting: NgForm
  }]
})
export class AiSearchAndAnalysisServiceSaveModelExternalWdsFormV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'AiSearchAndAnalysisServiceSaveModelExternalWdsFormV1';
  }

  _grid: any = {
    rightGutter: true,
    leftGutter: true,
  }

  @Input() skeleton: boolean;

  @Input() value: any; // it is AiSearchAndAnalysisService.external
  @Output() valueChange = new EventEmitter<any>();

  @Input() selections: any;
  @Output() selectionsChange = new EventEmitter<any>();

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    //
  }

  ngOnChanges(changes: SimpleChanges): void {
    //
  }

  isPasswordFieldDisabled() {
    let retVal = true;
    if (
      this.selections?.authType
    ) {
      retVal = false;
    }
    return retVal;
  }

  isUsernameFieldDisabled() {
    let retVal = true;
    if (
      this.selections?.authType &&
      this.selections?.authType?.type === 'basic'
    ) {
      retVal = false;
    }
    return retVal;
  }

  handleAuthTypeSelectedEvent(event: any) {
    _debugX(AiSearchAndAnalysisServiceSaveModelExternalWdsFormV1.getClassName(), 'onAuthTypeSelected',
      {
        this_selections: this.selections,
        event: event,
      });

    const NEW_VALUE = lodash.cloneDeep(this.value);
    NEW_VALUE.authType = this.selections.authType.type;
    NEW_VALUE.password = undefined;
    if (
      NEW_VALUE.authType === 'iam'
    ) {
      NEW_VALUE.username = 'apikey';
    }
    this.valueChange.emit(NEW_VALUE);
  }

  handleShowPasswordClickEvent(event: any) {
    _debugX(AiSearchAndAnalysisServiceSaveModelExternalWdsFormV1.getClassName(), 'handleShowPasswordClickEvent',
      {
        this_selections: this.selections,
        event: event,
      });

    const NEW_VALUE = lodash.cloneDeep(this.selections);
    NEW_VALUE.isPasswordShown = !NEW_VALUE.isPasswordShown;
    this.selectionsChange.emit(NEW_VALUE);
  }

}
