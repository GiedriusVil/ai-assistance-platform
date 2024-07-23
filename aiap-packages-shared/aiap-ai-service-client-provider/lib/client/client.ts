/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IAiServiceV1,
} from '@ibm-aiap/aiap--types-server';

export abstract class AiServiceClientV1<E extends IAiServiceV1> {

  aiService: E;

  constructor(
    aiService: E,
  ) {
    this.validateAiService(aiService);
    this.aiService = aiService;
  }

  abstract validateAiService(aiService: E): void;

  abstract initialise(): Promise<void>;

}
