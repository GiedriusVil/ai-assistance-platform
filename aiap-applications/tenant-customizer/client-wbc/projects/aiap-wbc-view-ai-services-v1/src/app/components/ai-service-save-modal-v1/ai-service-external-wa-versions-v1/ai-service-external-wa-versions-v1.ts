/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component } from '@angular/core';

@Component({
  selector: 'aiap-ai-service-external-wa-versions-v1',
  templateUrl: './ai-service-external-wa-versions-v1.html',
  styleUrls: ['./ai-service-external-wa-versions-v1.scss'],
})
export class AiServiceExternalWaVersionsV1 {

  static getClassName() {
    return 'AiServiceExternalWaVersionsV1';
  }

  uiState: any = {
    accordion: {
      align: 'start',
    },
  }

  constructor() {
    //
  }

}
