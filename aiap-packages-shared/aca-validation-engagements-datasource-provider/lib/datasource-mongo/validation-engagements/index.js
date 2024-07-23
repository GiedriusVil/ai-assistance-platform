/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const { findManyByQuery } = require('./find-many-by-query');
const { findManyLiteByQuery } = require('./find-many-lite-by-query');
//
const { deleteManyByIds } = require('./delete-many-by-ids');
const { deleteManyByKeys } = require('./delete-many-by-keys');
const { findOneById } = require('./find-one-by-id');
const { findOneByKey } = require('./find-one-by-key');
const { saveOne } = require('./save-one');

module.exports = {
  findManyByQuery,
  findManyLiteByQuery,
  //
  deleteManyByIds,
  deleteManyByKeys,
  findOneById,
  findOneByKey,
  saveOne,
};
