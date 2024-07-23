/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

/**
 * 
 * @param params 
 * @returns 
 * @deprecated -> Use more generic matcher!
 */
const matchAttributeConversationId = (
  params: {
    conversationId: string,
  }
) => {
  const RET_VAL = {};
  const CONVERSATION_ID = params?.conversationId;
  if (
    !lodash.isEmpty(CONVERSATION_ID) &&
    lodash.isString(CONVERSATION_ID)
  ) {
    RET_VAL['conversationId'] = `${CONVERSATION_ID}`;
  }
  return RET_VAL;
};

export {
  matchAttributeConversationId,
}
