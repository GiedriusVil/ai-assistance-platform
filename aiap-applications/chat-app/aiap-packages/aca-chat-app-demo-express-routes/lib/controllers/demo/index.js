/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { mockIdentification } = require('./mock-identification');
const { redirectToUrl } = require('./redirect-to-url');
const { renderPageDemo} = require('./render-page-demo');
const { renderPageDemoLegacy } = require('.//render-page-demo-legacy');

module.exports = {
  redirectToUrl,
  mockIdentification,
  renderPageDemo,
  renderPageDemoLegacy,
};
