/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/

const { recordAction } = require('./record-action');
const { findManyByExternalId } = require('./find-many-by-external-id');
const { findManyByQuery } = require('./find-many-by-query');

module.exports = {
    recordAction,
    findManyByExternalId,
    findManyByQuery,
}
