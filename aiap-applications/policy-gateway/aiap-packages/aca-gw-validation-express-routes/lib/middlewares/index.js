/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { addSupportForLegacyBody } = require('./add-support-for-legacy-body');
const { appendContextToRequestMidleware } = require('./append-context-to-request');

module.exports = {
  addSupportForLegacyBody,
  appendContextToRequestMidleware,
};
