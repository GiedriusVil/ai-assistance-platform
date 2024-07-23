/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const rulesController = require('./rules');
const rulesMessagesController = require('./rules-messages');
const rulesImportController = require('./rules-import');
const rulesMessagesImportController = require('./rules-messages-import');

module.exports = {
   rulesController,
   rulesMessagesController,
   rulesImportController,
   rulesMessagesImportController,
}
