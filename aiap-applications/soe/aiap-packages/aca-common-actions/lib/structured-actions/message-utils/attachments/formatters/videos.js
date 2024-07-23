/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-common-actions-structured-actions-message-utils-attachments-formatters-videos';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');


const _retrieveYoutubeIdFromUrl = (url) => {
  const REG_EXP = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const MATCH = url.match(REG_EXP);
  const RET_VAL = MATCH && MATCH[7].length == 11 ? MATCH[7] : false;
  return RET_VAL;
};

const _formatYoutubeUrl = (id) => {
  const RET_VAL = `https://www.youtube-nocookie.com/embed/${id}`;
  return RET_VAL;
};

const format = (sourceVideos) => {
  const VIDEOS = [];

  sourceVideos.forEach((video) => {
    const YOUTUBE_ID = _retrieveYoutubeIdFromUrl(video.url);
    if (YOUTUBE_ID) {
      const URL = _formatYoutubeUrl(YOUTUBE_ID);
      VIDEOS.push({
        url: URL,
        title: video.title,
      });
    } else {
      VIDEOS.push({
        url: video.url,
        title: video.title,
      });
    }
  });

  return {
    videos: VIDEOS,
  };
};

module.exports = {
  format,
};
