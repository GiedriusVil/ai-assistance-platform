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
  selector: 'aca-transcript-ai-service-details',
  templateUrl: './transcript-ai-service-details.html',
  styleUrls: ['./transcript-ai-service-details.scss'],
})
export class TranscriptAiServiceDetails implements OnInit {

  static getClassName() {
    return 'TranscriptAiServiceDetails';
  }

  @Input() aiService: any;

  constructor() { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

  getAiServiceIconSrc() {
    let retVal = "";
    if (
      !lodash.isEmpty(this.aiService?.type)
    ) {
      switch (this.aiService?.type) {
        case 'wa':
        case 'WA':
        case 'wcs':
          retVal = "/assets/conversation-service-logos/IBM_Watson_Logo_2017.png";
          break;
        case 'lex':
          retVal = "/assets/conversation-service-logos/lex2.png";
          break;
        case 'df':
          retVal = "/assets/conversation-service-logos/dialog-flow2.png"
          break;
        case 'ms':
          retVal = "/assets/conversation-service-logos/qna2.png";
          break;
        default:
          break;
      }
      return retVal;
    }
  }

}
