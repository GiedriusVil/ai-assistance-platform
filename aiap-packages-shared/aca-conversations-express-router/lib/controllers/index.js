/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/


const conversationsController = require('./conversations');
const utterancesController = require('./utterances');
const transcriptsController = require('./transcripts');
const surveysController = require('./surveys');
const feedbacksController = require('./feedbacks');

module.exports = {
   conversationsController,
   utterancesController,
   transcriptsController,
   surveysController,
   feedbacksController,
}
