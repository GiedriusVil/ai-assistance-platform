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
const matchAttributeMessageAuthor = (
  params: {
    author: any,
  },
) => {
  const RET_VAL = {};
  const AUTHOR = params?.author;

  if (
    !lodash.isEmpty(AUTHOR)
  ) {
    RET_VAL['author'] = {
      $regex: AUTHOR,
      $options: 'i'
    };
  }
  return RET_VAL;
}

export {
  matchAttributeMessageAuthor,
}
