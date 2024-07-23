/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/

const { constructGAcaProps } = require('./constructGAcaProps');
const { addDateToConversationId } = require('./addDateToConversationId');
const { constructIdFromRawUpdate } = require('./constructIdFromRawUpdate');
const { checkForExistingUser } = require('./checkForExistingUser');
const { getLastBotMessage } = require('../services/messages/get-last-bot-message');
const { formatHtmlTags } = require('./formatHtmlTags');

module.exports = {
    constructGAcaProps,
    addDateToConversationId,
    constructIdFromRawUpdate,
    checkForExistingUser,
    getLastBotMessage,
    formatHtmlTags,
}
