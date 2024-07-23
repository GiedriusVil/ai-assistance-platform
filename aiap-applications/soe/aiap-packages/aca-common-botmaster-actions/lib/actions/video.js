/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const Video = {
  controller: function ({ bot, attributes, message }) {
    if (bot.implements && bot.implements.video) {
      if (bot.videoTemplate && bot.videoTransformer) {
        return bot.videoTransformer(bot.videoTemplate, attributes.url, message.recipient.id);
      }
      return `<div
                class="video"
                url="${attributes.url}"
                style="display:none;"
             ></div><pause />`;
    } else {
      return attributes.url;
    }
  },
}

module.exports = {
  Video,
};
