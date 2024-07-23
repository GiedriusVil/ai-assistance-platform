/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { findManyByMatch } = require('./find-many-by-match');
const { findManyByQuery } = require('./find-many-by-query');

const { deleteManyByIds } = require('./delete-many-by-ids');
const { findLiteOneById } = require('./find-lite-one-by-id');
const { findOneById } = require('./find-one-by-id');
const { saveMany } = require('./save-many');
const { saveOne } = require('./save-one');

module.exports = {
  findManyByMatch,
  findManyByQuery,
  deleteManyByIds,
  findLiteOneById,
  findOneById,
  saveMany,
  saveOne,
}
