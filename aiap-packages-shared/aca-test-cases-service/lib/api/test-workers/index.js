/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { saveOne } = require('./save-one');
const { findManyByQuery } = require('./find-many-by-query');
const { findManyLiteByQuery } = require('./find-many-lite-by-query');
const { findOneById } = require('./find-one-by-id');
const { deleteManyByIds } = require('./delete-many-by-ids');

module.exports = {
    saveOne,
    findManyByQuery,
    findManyLiteByQuery,
    findOneById,
    deleteManyByIds,
};
