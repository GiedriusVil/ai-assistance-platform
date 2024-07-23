/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aca-transcript-message-entities',
  templateUrl: './transcript-message-entities.html',
  styleUrls: ['./transcript-message-entities.scss'],
})
export class TranscriptMessageEntities implements OnInit {

  static getClassName() {
    return 'TranscriptMessageEntities';
  }

  @Input() value: any;

  constructor() { }

  ngOnInit(): void { }

  hasEntities() {
    let retVal = false;
    if (
      this.value &&
      !lodash.isEmpty(this.value?.aiServiceResponse?.external?.result?.entities)
    ) {
      retVal = true;
    }
    // message.conversationValues && (message.dialogType === 'wa' || message.dialogType === 'wcs') && message.type === 'user' && message.conversationValues.intents.length < 1
    return retVal;
  }

  retrieveEntities() {
    const RET_VAL = [];
    let entities;
    try {
      entities = this.value?.aiServiceResponse?.external?.result?.entities;
      if (
        !lodash.isEmpty(entities) &&
        lodash.isArray(entities)
      ) {
        if (this.value?.expanded) {
          RET_VAL.push(...entities);
        } else {
          RET_VAL.push(...entities.slice(0, 1));
        }
      }
    } catch (error) {
      _errorX(TranscriptMessageEntities.getClassName(), 'reduceIntents', { error, entities });
    }
    return RET_VAL;
  }

  isBotMessage() {
    const RET_VAL = this.value?.type == 'bot';
    return RET_VAL;
  }

  isUserMessage() {
    const RET_VAL = this.value?.type == 'user';
    return RET_VAL;
  }

  checkAiServiceType(type: any) {
    const RET_VAL = this.value?.aiService?.type === type;
    return RET_VAL;
  }

}
