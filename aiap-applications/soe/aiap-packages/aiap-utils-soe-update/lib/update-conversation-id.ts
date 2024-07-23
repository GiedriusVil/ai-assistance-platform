/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

// TODO -> Check this method consumption - and figure out possibility to switch to update?.traceId?.convesationId???

const getUpdateConversationId = (
  update: ISoeUpdateV1,
) => {
  const RET_VAL = update?.sender?.id;
  return RET_VAL;
}

export {
  getUpdateConversationId,
}
