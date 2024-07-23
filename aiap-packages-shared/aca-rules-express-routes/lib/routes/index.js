/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const {
  rulesRoutes,
} = require('./rules');

const {
  rulesImportRoutes,
} = require('./rules-import');

const {
  rulesMessagesRoutes,
} = require('./rules-messages');

const {
   rulesMessagesImportRoutes
} = require('./rules-messages-import');

module.exports = {
  rulesRoutes,
  rulesImportRoutes,
  rulesMessagesRoutes,
  rulesMessagesImportRoutes,
}
