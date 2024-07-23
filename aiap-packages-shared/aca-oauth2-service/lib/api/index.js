/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const oauth2Service = require('./oauth2');
const oauth2TokenAccessService = require('./oauth2-tokens-access');
const oauth2TokensRefreshService = require('./oauth2-tokens-refresh');

module.exports = {
  oauth2Service,
  oauth2TokenAccessService,
  oauth2TokensRefreshService,
}
