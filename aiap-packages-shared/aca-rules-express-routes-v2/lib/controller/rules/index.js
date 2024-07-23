/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const { deleteManyByIds } = require('./delete-many-by-ids');
const { deleteManyByKeys } = require('./delete-many-by-keys');
const { exportMany } = require('./export-many');
const { findManyByQuery } = require('./find-many-by-query');
const { findOneById } = require('./find-one-by-id');
const { importManyFromFile } = require('./import-many-from-file');
const { saveOne } = require('./save-one');

module.exports = {
  deleteManyByIds,
  deleteManyByKeys,
  exportMany,
  findManyByQuery,
  findOneById,
  importManyFromFile,
  saveOne,
};
