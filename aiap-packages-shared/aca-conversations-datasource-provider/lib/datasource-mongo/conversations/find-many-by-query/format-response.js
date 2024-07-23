/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const moment = require('moment');

const formatDuration = (duration) => {
  let retVal = '00:00:00.000';
  if (duration) {
    retVal = moment.utc(duration).format('HH:mm:ss.SSS')
  }
  return retVal;
};

const formatResponse = (conversations) => {
  const RET_VAL = conversations.map(item => {

    const START = item?.start;
    const END = item?.end;
    const DURATION = item?.duration;
    const CHANNEL = item?.channel;

    const LANGUAGE = ramda.path(['language', 0], item);
    
    const SURVEY = ramda.path(['surveys', 0], item);

    const CLIENT_SIDE_INFO_OS = item?.clientSideOS;
    const CLIENT_SIDE_INFO_VERSION = item?.clientSideVersion;
    const CLIENT_SIDE_INFO_WINDOW_SIZE = item?.clientSideWindowSize;
    const CLIENT_SIDE_INFO_SOFT_TYPE = item?.clientSideSoftwareType;
    const CLIENT_SIDE_INFO_HOSTNAME = item?.clientSideHostname;
    const CLIENT_SIDE_INFO_BROWSER_NAME = item?.clientSideBrowserName;
    const CLIENT_SIDE_INFO_BROWSER_LANGUAGE = item?.clientSideBrowserLanguage;

    const WAS_REVIEWED = item?.reviewed;
    const TAGS = item?.tags;

    return {
      id: item?._id,
      conversationId: item?._id,
      assistantId: item?.assistantId,
      userId: item?.userId,
      started: START,
      ended: END,
      duration: formatDuration(DURATION),
      channel: CHANNEL,
      score: SURVEY?.score,

      clientSideOS: CLIENT_SIDE_INFO_OS,
      clientSideVersion: CLIENT_SIDE_INFO_VERSION,
      clientSideWindowSize: CLIENT_SIDE_INFO_WINDOW_SIZE,
      clientSideSoftwareType: CLIENT_SIDE_INFO_SOFT_TYPE,
      clientSideHostname: CLIENT_SIDE_INFO_HOSTNAME,
      clientSideBrowserName: CLIENT_SIDE_INFO_BROWSER_NAME,
      clientSideBrowserLanguage: CLIENT_SIDE_INFO_BROWSER_LANGUAGE,
      userLanguage: LANGUAGE,
      reviewed: WAS_REVIEWED,
      tags: TAGS,
      hasErrorMessages: item?.hasErrorMessages,
    };
  });

  return RET_VAL;
};

module.exports = {
  formatResponse,
};
