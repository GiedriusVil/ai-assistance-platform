/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { saveOne } = require('./save-one');
const { findManyByQuery } = require('./find-many-by-quey');
const { findOneById } = require('./find-one-by-id');
const { deleteManyByIds } = require('./delete-many-by-ids');
const { importMany } = require('./import-many');
const { exportMany } = require('./export-many');

module.exports = {
    saveOne,
    findManyByQuery,
    findOneById,
    deleteManyByIds,
    importMany,
    exportMany
};
