/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const { deleteManyByKeys } = require('./delete-many-by-keys');
const { exportMany } = require('./export-many');
const { findManyByQuery } = require('./find-many-by-query');
const { findOneByKey } = require('./find-one-by-key');
const { importManyFromFile } = require('./import-many-from-file');
const { saveOne } = require('./save-one');

module.exports = {
  deleteManyByKeys,
  exportMany,
  findManyByQuery,
  findOneByKey,
  importManyFromFile,
  saveOne,
};
