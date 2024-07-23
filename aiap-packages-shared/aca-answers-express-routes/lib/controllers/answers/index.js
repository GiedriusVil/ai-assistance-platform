/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { deleteManyByKeys } = require('./delete-many-by-keys');
const { exportToFile } = require('./export-to-file');
const { findManyByQuery } = require('./find-many-by-query');
const { importManyFromFile } = require('./import-many-from-file');
const { saveOne } = require('./save-one');
const { translateOne } = require('./translate-one');


module.exports = {
  deleteManyByKeys,
  exportToFile,
  findManyByQuery,
  importManyFromFile,
  saveOne,
  translateOne,
}
