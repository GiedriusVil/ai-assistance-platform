/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  OnInit,
  OnDestroy,
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
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
  selector: 'aiap-ai-translation-service-tab-general-v1',
  templateUrl: './ai-translation-service-tab-general-v1.html',
  styleUrls: ['./ai-translation-service-tab-general-v1.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class AiTranslationServiceTabGeneralV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'AiTranslationServiceTabGeneralV1';
  }

  @Input() aiTranslationService: any;
  @Output() aiTranslationServiceChange = new EventEmitter<any>();

  @Input() state: any;
  @Output() stateChange = new EventEmitter<any>();

  constructor() {
    //
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    //
  }

  ngOnChanges() {
    //
  }

  handleTypeSelectedEvent(event: any) {
    _debugX(AiTranslationServiceTabGeneralV1.getClassName(), 'handleTypeSelectedEvent', {
      event: event,
      this_state: this.state,
    });
    const NEW_AI_TRANSLATION_SERVICE = lodash.cloneDeep(this.aiTranslationService);
    NEW_AI_TRANSLATION_SERVICE.type = this.state?.selections?.type?.value;
    this.aiTranslationServiceChange.emit(NEW_AI_TRANSLATION_SERVICE);
  }

}
