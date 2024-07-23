/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { findOneById } = require('./find-one-by-id');
const { saveOne } = require('./save-one');
const { deleteManyByIds } = require('./delete-many-by-ids');
const { findManyByQuery } = require('./find-many-by-query');
const { importMany } = require('./import-many');

module.exports = {
  findOneById,
  saveOne,
  deleteManyByIds,
  findManyByQuery,
  importMany,
};
