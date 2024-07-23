/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const createDeepLink = require('./lib/v1/deepLink');
const createImage = require('./lib/v1/image');
const createButtons = require('./lib/v1/buttons');

const createDeepLinkV2 = require('./lib/v2/deepLink');
const createImageV2 = require('./lib/v2/image');
const createButtonsV2 = require('./lib/v2/buttons');
const createCarouselV2 = require('./lib/v2/carousel');

const linkV3 = require('./lib/v3/link');
const imageV3 = require('./lib/v3/image');
const buttonsV3 = require('./lib/v3/buttons');
const carouselV3 = require('./lib/v3/carousel');

module.exports.createDeepLink = createDeepLink;
module.exports.createImage = createImage;
module.exports.createButtons = createButtons;

module.exports.v2 = {
  createDeepLink: createDeepLinkV2,
  createImage: createImageV2,
  createButtons: createButtonsV2,
  createCarousel: createCarouselV2,
};

module.exports.v3 = {
  link: linkV3,
  image: imageV3,
  buttons: buttonsV3,
  carousel: carouselV3,
};
