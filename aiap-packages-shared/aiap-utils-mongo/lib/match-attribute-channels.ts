/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const matchAttributeChannels = (params: any) => {
  const RET_VAL = {};
  const CHANNELS = params?.channels;
  if (lodash.isArray(CHANNELS) && !lodash.isEmpty(CHANNELS)) {
    RET_VAL['channel'] = {
      $in: CHANNELS,
    };
  }
  return RET_VAL;
};

export { matchAttributeChannels };
