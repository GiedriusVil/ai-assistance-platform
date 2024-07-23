/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'release-assistant-2022-11-16-utterances-transform-record-ensure-channel-meta';
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const CHANNEL_META_TYPES = {
  S2P: 'S2P',
  W3: 'W3',
}

const CHANNEL_HOST_URLS = {
  S2P: 'https://va-prod.dal1a.cirrus.ibm.com',
  W3: 'https://w3.ibm.com/buyatibm',
}

const getTypeFromHostname = (hostname) => {
  let channelMetaType = null;
  if (lodash.isEmpty(channelMetaType)) {
    for (let key in CHANNEL_HOST_URLS) {
      const IS_HOSTNAME_MATCH = hostname.includes(CHANNEL_HOST_URLS[key]);
      if (IS_HOSTNAME_MATCH) {
        channelMetaType = CHANNEL_META_TYPES[key];
      } 
    }
  }
  return channelMetaType;
}

const ensureChannelMeta = (conversation) => {
  try {
    channelMetaHostname = conversation?.channelMeta?.hostname;

    if (
      !lodash.isEmpty(channelMetaHostname)
    ) {
      const channelMetaType = getTypeFromHostname(channelMetaHostname);
      channelMeta = {
        hostname: channelMetaHostname,
        type: channelMetaType
      };
      conversation.channelMeta = channelMeta;
    }

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error(ensureAiServiceRequest.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  ensureChannelMeta,
}
