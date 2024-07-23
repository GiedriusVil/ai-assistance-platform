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
const matchAttributeSlackMessageId = (
  params: {
    slackMessageId: any,
  },
) => {
  const RET_VAL = {};
  const SLACK_MESSAGE_ID = params?.slackMessageId;

  if (
    !lodash.isEmpty(SLACK_MESSAGE_ID)
  ) {
    RET_VAL['slackMessageId'] = {
      $regex: SLACK_MESSAGE_ID,
      $options: 'i'
    };
  }
  return RET_VAL;
};

export {
  matchAttributeSlackMessageId
}
