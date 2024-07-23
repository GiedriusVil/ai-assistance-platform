/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { saveOne } = require('./save-one');
const { findOneById } = require('./find-one-by-id');
const { findManyByQuery } = require('./find-many-by-query');
const { deleteManyByIds } = require('./delete-many-by-ids');
const { importMany } = require('./import-many');
const { exportMany } = require('./export-many');

module.exports = {
    saveOne,
    findOneById,
    findManyByQuery,
    deleteManyByIds,
    importMany,
    exportMany,
}
