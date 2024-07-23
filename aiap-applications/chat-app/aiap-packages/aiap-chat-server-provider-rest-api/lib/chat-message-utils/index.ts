/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import lodash from '@ibm-aca/aca-wrapper-lodash';

const _resetMessageGAcaPropsUser = (
  message: any,
  session: any
) => {
  _ensureMessageGAcaPropsExistance(message);
  const USER = session?.user;
  if (
    !lodash.isEmpty(USER)
  ) {
    message.gAcaProps.user = USER;
  }
}

const _resetMessageGAcaPropsUserProfile = (
  message: any,
  session: any
) => {
  _ensureMessageGAcaPropsExistance(message);
  const USER_PROFILE = session?.userProfile;
  if (
    !lodash.isEmpty(USER_PROFILE)
  ) {
    message.gAcaProps.userProfile = USER_PROFILE;
  }
}


const _ensureMessageGAcaPropsExistance = (message) => {
  if (
    message &&
    lodash.isEmpty(message.gAcaProps)
  ) {
    message.gAcaProps = {};
  }
}

const _ensureChannelMetaExistance = (message) => {
  if (
    message &&
    lodash.isEmpty(message.channelMeta)
  ) {
    message.channelMeta = {};
  }
}

const _resetChannelMeta = (
  message: any,
  session: any
) => {
  _ensureChannelMetaExistance(message);
  const CHANNEL_META = session?.channelMeta;
  if (
    lodash.isEmpty(CHANNEL_META)
  ) {
    message.channelMeta = {
      type: 'voicebot'
    };
  }
}



export {
  _resetMessageGAcaPropsUser,
  _resetMessageGAcaPropsUserProfile,
  _ensureMessageGAcaPropsExistance,
  _resetChannelMeta
}
