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
  selector: 'aiap-ai-service-external-aws-lex-v3-save-form-v1',
  templateUrl: './ai-service-external-aws-lex-v3-save-form-v1.html',
  styleUrls: ['./ai-service-external-aws-lex-v3-save-form-v1.scss'],
  viewProviders: [{
    provide: ControlContainer,
    useExisting: NgForm
  }]
})
export class AiServiceExternalAwsLexV3SaveFormV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'AiServiceExternalAwsLexV3SaveFormV1';
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

  handleShowApiKeyClickEvent(event: any) {
    _debugX(AiServiceExternalAwsLexV3SaveFormV1.getClassName(), 'handleShowApiKeyClickEvent', {
      event: event,
      this_state: this.state,
    });
    const NEW_STATE = lodash.cloneDeep(this.state);
    NEW_STATE.isApiKeyVisible = !NEW_STATE.isApiKeyVisible;
    this.stateChange.emit(NEW_STATE);
  }
}
