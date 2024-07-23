/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  // 
  IConversationShadowSaveOneParamsV1,
  IUtteranceShadowSaveOneParamsV1,
  IMessageShadowSaveOneParamsV1,
  //
  IConversationShadowV1,
  IUtteranceShadowV1,
  IMessageShadowV1,
} from '..';


interface IShadowDatasourceConversationsV1 {

  get conversations(): {
    saveOne(
      context: IContextV1,
      params: IConversationShadowSaveOneParamsV1,
    ): Promise<IConversationShadowV1>,
  }

  get utterances(): {
    saveOne(
      context: IContextV1,
      params: IUtteranceShadowSaveOneParamsV1,
    ): Promise<IUtteranceShadowV1>,
  }

  get messages(): {
    saveOne(
      context: IContextV1,
      params: IMessageShadowSaveOneParamsV1,
    ): Promise<IMessageShadowV1>,
  }
}

export {
  IShadowDatasourceConversationsV1,
}
