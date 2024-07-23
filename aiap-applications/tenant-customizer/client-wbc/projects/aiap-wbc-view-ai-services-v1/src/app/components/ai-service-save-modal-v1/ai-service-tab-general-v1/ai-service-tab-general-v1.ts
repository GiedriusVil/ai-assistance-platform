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
  selector: 'aiap-ai-service-tab-general-v1',
  templateUrl: './ai-service-tab-general-v1.html',
  styleUrls: ['./ai-service-tab-general-v1.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class AiServiceTabGeneralV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'AiServiceTabGeneralV1';
  }

  @Input() aiService: any;
  @Output() aiServiceChange = new EventEmitter<any>();

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

  handleAssistantSelectedEvent(event: any) {
    _debugX(AiServiceTabGeneralV1.getClassName(), 'handleAssistantSelectedEvent', {
      event: event,
      this_state: this.state,
    });
    const NEW_AI_SERVICE = lodash.cloneDeep(this.aiService);
    NEW_AI_SERVICE.assistantId = this.state?.selections?.assistant?.value?.id;
    this.aiServiceChange.emit(NEW_AI_SERVICE);
  }

  handleTypeSelectedEvent(event: any) {
    _debugX(AiServiceTabGeneralV1.getClassName(), 'handleTypeSelectedEvent', {
      event: event,
      this_state: this.state,
    });

    const NEW_AI_SERVICE = lodash.cloneDeep(this.aiService);

    NEW_AI_SERVICE.type = this.state?.selections?.type?.value;

    this.aiServiceChange.emit(NEW_AI_SERVICE);
  }

  handlePullOptionSelectedEvent(event: any) {
    _debugX(AiServiceTabGeneralV1.getClassName(), 'handlePullOptionSelectedEvent', {
      event: event,
      this_state: this.state,
    });
    const NEW_AI_SERVICE = lodash.cloneDeep(this.aiService);

    NEW_AI_SERVICE.assistantId = this.state?.selections?.assistant?.id;
    NEW_AI_SERVICE.pullConfiguration = {
      tenantId: this.state?.selections?.pullOption?.tenantId,
      assistantId: this.state?.selections?.pullOption?.assistantId,
      aiServiceId: this.state?.selections?.pullOption?.aiServiceId,
    }

    this.aiServiceChange.emit(NEW_AI_SERVICE);
  }

  pullOptionsPlaceHolder() {
    let retVal = '';
    if (
      this.state &&
      this.state?.selections &&
      this.state?.selections.pullOptions &&
      this.state?.selections.pullOptions.length > 0
    ) {
      retVal = 'Select pull source';
    }
    return retVal;
  }

  handleSynchroniseAiSkillsByAiProvider(event: boolean): void {
    _debugX(AiServiceTabGeneralV1.getClassName(), 'handleSynchroniseAiSkillsByAiProvider', {
      event: event,
      this_state: this.state,
    });
    let newState = lodash.cloneDeep(this.state);
    if (
      lodash.isEmpty(newState)
    ) {
      newState = {};
    }
    newState.synchroniseAiSkills = event;
    this.stateChange.emit(newState);
  }

  isSynchronisationOfAiSkillsDisabled() {
    const RET_VAL = lodash.isEmpty(this.aiService?.id);
    return RET_VAL;
  }

  isPullOptionsDisabled() {
    let retVal = true;
    if (
      this.state &&
      this.state?.selections &&
      this.state?.selections?.pullOptions &&
      this.state?.selections?.pullOptions.length > 0
    ) {
      retVal = false;
    }
    return retVal;
  }

}
