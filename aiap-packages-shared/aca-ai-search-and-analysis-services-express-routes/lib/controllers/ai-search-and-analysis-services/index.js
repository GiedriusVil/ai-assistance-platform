/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/

const { deleteManyByIds } = require('./delete-many-by-ids');
const { exportManyByQuery } = require('./export-many-by-query');
const { findManyByQuery } = require('./find-many-by-query');
const { findOneById } = require('./find-one-by-id');
const { importManyFromFile } = require('./import-many-from-file');
const { saveOne } = require('./save-one');

module.exports = {
  deleteManyByIds,
  exportManyByQuery,
  findManyByQuery,
  findOneById,
  importManyFromFile,
  saveOne,
};
