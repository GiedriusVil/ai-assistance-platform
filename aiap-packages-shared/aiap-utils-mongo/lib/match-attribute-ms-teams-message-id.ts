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
const matchAttributeMsTeamsMessageId = (
  params: {
    msTeamsMessageId: any,
  },
) => {
  const RET_VAL = {};
  const MS_TEAMS_MESSAGE_ID = params?.msTeamsMessageId;

  if (
    !lodash.isEmpty(MS_TEAMS_MESSAGE_ID)
  ) {
    RET_VAL['msTeamsMessageId'] = {
      $regex: MS_TEAMS_MESSAGE_ID,
      $options: 'i'
    };
  }
  return RET_VAL;
};

export {
  matchAttributeMsTeamsMessageId,
}
