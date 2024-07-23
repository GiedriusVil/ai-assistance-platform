/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { deleteManyByIds } = require('./delete-many-by-ids');
const { findManyByQuery } = require('./find-many-by-query');
const { findOneById } = require('./find-one-by-id');
const { saveOne } = require('./save-one');
const { testOneById } = require('./test-one-by-id');
const { trainOneById } = require('./train-one-by-id');
const { exportMany } = require('./export-many');
const { importManyFromFile } = require('./import-many-from-file');

module.exports = {
    findOneById,
    findManyByQuery,
    saveOne,
    deleteManyByIds,
    testOneById,
    trainOneById,
    exportMany,
    importManyFromFile
};
