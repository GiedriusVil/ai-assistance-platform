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

import {
  ControlContainer,
  NgForm,
} from '@angular/forms';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-ai-service-external-wa-v1-save-form-v1',
  templateUrl: './ai-service-external-wa-v1-save-form-v1.html',
  styleUrls: ['./ai-service-external-wa-v1-save-form-v1.scss'],
  viewProviders: [{
    provide: ControlContainer,
    useExisting: NgForm
  }]
})
export class AiServiceExternalWaV1SaveFormV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'AiServiceExternalWaV1SaveFormV1';
  }

  uiState: any = {
    grid: {
      rightGutter: true,
      leftGutter: true,
    },
  }

  @Input() value: any;
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

  isAiServicePasswordFieldDisabled() {
    let retVal = true;
    if (
      this.state?.selections?.authType
    ) {
      retVal = false;
    }
    return retVal;
  }

  isAiServiceUsernameFieldDisabled() {
    let retVal = true;
    if (
      this.state?.selections?.authType &&
      this.state?.selections?.authType?.type === 'basic'
    ) {
      retVal = false;
    }
    return retVal;
  }

  handleAuthTypeSelectedEvent(event: any) {
    _debugX(AiServiceExternalWaV1SaveFormV1.getClassName(), 'handleAuthTypeSelectedEvent', {
      event: event,
      this_state: this.state,
    });
    const NEW_VALUE = lodash.cloneDeep(this.value);
    NEW_VALUE.authType = this.state?.selections?.authType?.type;
    NEW_VALUE.password = undefined;
    if (
      NEW_VALUE.authType === 'iam'
    ) {
      NEW_VALUE.username = 'apikey';
    }
    this.valueChange.emit(NEW_VALUE);
  }

  handleShowPasswordClickEvent(event: any) {
    _debugX(AiServiceExternalWaV1SaveFormV1.getClassName(), 'handleShowPasswordClickEvent', {
      event: event,
      this_state: this.state,
    });
    const NEW_STATE = lodash.cloneDeep(this.state);
    NEW_STATE.isPasswordShown = !NEW_STATE.isPasswordShown;
    this.stateChange.emit(NEW_STATE);
  }

}
