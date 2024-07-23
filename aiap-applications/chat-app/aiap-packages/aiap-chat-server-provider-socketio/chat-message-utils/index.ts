/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-server-provider-chat-message-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IChatMessageV1,
} from '@ibm-aiap/aiap-chat-app--types';

const _ensureMessageGAcaPropsExistance = (
  message: IChatMessageV1,
) => {
  if (
    message &&
    lodash.isEmpty(message.gAcaProps)
  ) {
    message.gAcaProps = {};
  }
}

const resetMessageGAcaPropsUserBySession = (
  message: IChatMessageV1,
  session: any,
) => {
  _ensureMessageGAcaPropsExistance(message);
  const USER = session?.user;
  if (
    !lodash.isEmpty(USER)
  ) {
    message.gAcaProps.user = USER;
  }
}

const resetMessageGAcaPropsUserProfileBySession = (
  message: IChatMessageV1,
  session: any,
) => {
  _ensureMessageGAcaPropsExistance(message);
  const USER_PROFILE = session?.userProfile;
  if (
    !lodash.isEmpty(USER_PROFILE)
  ) {
    message.gAcaProps.userProfile = USER_PROFILE;
  }
}

export {
  resetMessageGAcaPropsUserBySession,
  resetMessageGAcaPropsUserProfileBySession,
}
