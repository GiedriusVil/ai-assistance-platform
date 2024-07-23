/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const matchAttributeAction = (
  params: {
    action: any,
  },
) => {
  const RET_VAL = {};
  const ACTION = params?.action;
  if (
    !lodash.isEmpty(ACTION)
  ) {
    RET_VAL['action'] = ACTION;
  }
  return RET_VAL;
};

export {
  matchAttributeAction,
}
