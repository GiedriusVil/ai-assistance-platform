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
  selector: 'aiap-ai-service-external-chatgpt-v3-save-form-v1',
  templateUrl: './ai-service-external-chatgpt-v3-save-form-v1.html',
  styleUrls: ['./ai-service-external-chatgpt-v3-save-form-v1.scss'],
  viewProviders: [{
    provide: ControlContainer,
    useExisting: NgForm
  }]
})
export class AiServiceExternalChatGptV3SaveFormV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'AiServiceExternalChatGptV3SaveFormV1';
  }

  uiState: any = {
    grid: {
      rightGutter: true,
      leftGutter: true,
    },
    temperature: {
      min: 0,
      max: 1,
      step: 0.01,
      precision: 3
    },
    maxTokens: {
      min: 0,
      max: 4096,
      step: 1,
    },
    topP: {
      min: 0,
      max: 1,
      step: 0.01,
      precision: 2
    },
    frequencyPenalty: {
      min: -2,
      max: 2,
      step: 0.01,
      precision: 2
    },
    presencePenalty: {
      min: -2,
      max: 2,
      step: 0.01,
      precision: 2
    }
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
    _debugX(AiServiceExternalChatGptV3SaveFormV1.getClassName(), 'handleShowApiKeyClickEvent', {
      event: event,
      this_state: this.state,
    });
    const NEW_STATE = lodash.cloneDeep(this.state);
    NEW_STATE.isApiKeyVisible = !NEW_STATE.isApiKeyVisible;
    this.stateChange.emit(NEW_STATE);
  }

}
