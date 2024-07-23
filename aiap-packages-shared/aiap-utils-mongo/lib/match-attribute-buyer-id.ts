/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const matchAttributeBuyerId = (
  params: {
    buyer?: {
      id?: string,
    }
  }
) => {
  const RET_VAL = {};
  const BUYER_ID = params?.buyer?.id;

  if (
    !lodash.isEmpty(BUYER_ID)
  ) {
    RET_VAL['buyer.id'] = BUYER_ID;
  }
  return RET_VAL;
};

export {
  matchAttributeBuyerId,
}
