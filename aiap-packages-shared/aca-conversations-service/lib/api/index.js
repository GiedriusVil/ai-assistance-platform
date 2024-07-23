/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/

const conversationsService = require('./conversations');
const utterancesService = require('./utterances');
const transcriptsService = require('./transcripts');
const surveysService = require('./surveys');
const feedbacksService = require('./feedbacks');

module.exports = {
   conversationsService,
   utterancesService,
   transcriptsService,
   surveysService,
   feedbacksService,
}
