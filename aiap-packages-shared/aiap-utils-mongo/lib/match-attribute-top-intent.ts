/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

/**
 * 
 * @param params 
 * @returns 
 * @deprecated -> Use more generic matcher!
 */
const matchAttributeTopIntent = (
  params: {
    intent: any,
  },
) => {
  const RET_VAL = {};
  const TOP_INTENT = params?.intent;
  if (
    TOP_INTENT
  ) {
    RET_VAL['topIntent'] = {
      $eq: TOP_INTENT,
    };
  }
  return RET_VAL;
};

export {
  matchAttributeTopIntent,
}
