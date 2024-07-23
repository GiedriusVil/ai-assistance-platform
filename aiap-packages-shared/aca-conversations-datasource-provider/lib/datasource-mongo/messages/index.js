/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { saveOne } = require('./save-one');
const { saveMany } = require('./save-many');
const { updateOneById } = require('./update-one-by-id');
const { deleteManyByQuery } = require('./delete-many-by-query');
const { findManyByQuery } = require('./find-many-by-query');

module.exports = {
    saveOne,
    saveMany,
    updateOneById, 
    deleteManyByQuery,
    findManyByQuery
}
