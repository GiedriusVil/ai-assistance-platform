/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const image = require('./image');
const link = require('./link');
const audio = require('./audio');
const video = require('./video');
const file = require('./file');
const carousel = require('./carousel');
const widget = require('./widget');
const card = require('./card');
const list = require('./list');
const quickReply = require('./quickReply');

const processContent = (content, settings) => {
  switch (content.tag) {
    case 'carousel':
      return carousel.process(content, settings);
    case 'image':
      return image.process(content, settings);
    case 'link':
      return link.process(content, settings);
    case 'audio':
      return audio.process(content, settings);
    case 'video':
      return video.process(content, settings);
    case 'file':
      return file.process(content, settings);
    case 'widget':
      return widget.process(content, settings);
    case 'list':
      return list.process(content, settings);
    case 'card':
      return card.process(content, settings);
    case 'quickReply':
      return quickReply.process(content, settings);
  }
  return null;
};

module.exports = {
  processContent,
};
