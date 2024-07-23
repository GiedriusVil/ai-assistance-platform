/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { deleteOneById } = require('./delete-one-by-id');
const { deleteManyByIds } = require('./delete-many-by-ids');
const { findManyByQuery } = require('./find-many-by-query');
const { findOneById } = require('./find-one-by-id');
const { saveOne } = require('./save-one');
const { importRulesFromFile } = require('./upload');
const { submitImport } = require('./submit');
const { clearImport } = require('./clear-import');
const { enableManyByIds } = require('./enable-many-by-ids');


module.exports = {
    deleteOneById,
    deleteManyByIds,
    findManyByQuery,
    findOneById,
    saveOne,
    importRulesFromFile,
    submitImport,
    clearImport,
    enableManyByIds,
};
