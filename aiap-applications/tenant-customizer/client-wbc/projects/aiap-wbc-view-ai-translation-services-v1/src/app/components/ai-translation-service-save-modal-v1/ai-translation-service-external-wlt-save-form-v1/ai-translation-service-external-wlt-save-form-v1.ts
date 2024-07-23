/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-ai-translation-service-external-wlt-save-form-v1',
  templateUrl: './ai-translation-service-external-wlt-save-form-v1.html',
  styleUrls: ['./ai-translation-service-external-wlt-save-form-v1.scss'],
  viewProviders: [{
    provide: ControlContainer,
    useExisting: NgForm
  }]
})
export class AiTranslationServiceExternalWltSaveFormV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'AiTranslationServiceExternalWltSaveFormV1';
  }

  _grid: any = {
    rightGutter: true,
    leftGutter: true,
  }

  @Input() skeleton: boolean;

  @Input() value: any; // it is AiTranslationService.external
  @Output() valueChange = new EventEmitter<any>();

  @Input() state: any;
  @Output() stateChange = new EventEmitter<any>();

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
      this.state.selections?.authType
    ) {
      retVal = false;
    }
    return retVal;
  }

  isUsernameFieldDisabled() {
    let retVal = true;
    if (
      this.state.selections?.authType &&
      this.state.selections?.authType?.type === 'basic'
    ) {
      retVal = false;
    }
    return retVal;
  }

  handleAuthTypeSelectedEvent(event: any) {
    _debugX(AiTranslationServiceExternalWltSaveFormV1.getClassName(), 'onAuthTypeSelected', {
      this_selections: this.state.selections,
      event: event,
    });
    const NEW_VALUE = lodash.cloneDeep(this.value);
    NEW_VALUE.authType = this.state.selections.authType.type;
    NEW_VALUE.password = undefined;
    if (
      NEW_VALUE.authType === 'iam'
    ) {
      NEW_VALUE.username = 'apikey';
    }
    this.valueChange.emit(NEW_VALUE);
  }

  handleShowApiKeyClickEvent(event: any) {
    _debugX(AiTranslationServiceExternalWltSaveFormV1.getClassName(), 'handleShowApiKeyClickEvent', {
      event: event,
      this_state: this.state,
    });
    const NEW_STATE = lodash.cloneDeep(this.state);
    NEW_STATE.selections.isPasswordShown = !NEW_STATE.selections.isPasswordShown;
    this.stateChange.emit(NEW_STATE);
  }
}
