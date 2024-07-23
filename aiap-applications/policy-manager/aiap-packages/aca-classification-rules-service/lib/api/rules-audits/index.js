/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { deleteManyByIds } = require('./delete-many-by-ids');
const { exportMany } = require('./export-many');
const { findManyByQuery } = require('./find-many-by-query');
const { findOneById } = require('./find-one-by-id');
const { saveOne } = require('./save-one');

module.exports = {
  deleteManyByIds,
  exportMany,
  findManyByQuery,
  findOneById,
  saveOne,
};
