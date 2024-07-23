/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { findManyByQuery } = require('./find-many-by-query');
const { findTopIntentsByQuery } = require('./find-top-intents-by-query');
const { retrieveTotals } = require('./retrieve-totals');
const { updateOneById } = require('./update-one-by-id');

module.exports = {
    findManyByQuery,
    findTopIntentsByQuery,
    retrieveTotals,
    updateOneById, 
}
