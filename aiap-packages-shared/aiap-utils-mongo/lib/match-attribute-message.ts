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
const matchAttributeMessage = (
  params: {
    search: any,
  }
) => {
  const RET_VAL = {};
  const SEARCH = params?.search;
  if (
    SEARCH
  ) {
    RET_VAL['message'] = {
      $regex: SEARCH,
      $options: 'i'
    };
  }
  return RET_VAL;
};

export {
  matchAttributeMessage,
}
