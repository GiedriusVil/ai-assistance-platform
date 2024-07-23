/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const matchAttributeAuthor = (
  params: {
    author: any,
  }
) => {
  const RET_VAL = {};
  const AUTHOR = params?.author;
  if (
    !lodash.isEmpty(AUTHOR)
  ) {
    RET_VAL['author'] = {
      $eq: AUTHOR,
    };
  }
  return RET_VAL;
}

export {
  matchAttributeAuthor,
}
