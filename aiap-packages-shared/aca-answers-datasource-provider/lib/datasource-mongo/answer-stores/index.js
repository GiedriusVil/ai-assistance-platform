/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { findManyByQuery } = require('./find-many-by-query');
const { findManyLiteByQuery } = require('./find-many-lite-by-query');
const { findOneByReference } = require('./find-one-by-answer-store-reference');
const { findOneById } = require('./find-one-by-id');
const { findOneLiteById } = require('./find-one-lite-by-id');
const { deleteManyByIds } = require('./delete-many-by-ids');
const { saveOne } = require('./save-one');

module.exports = {
  findManyByQuery, 
  findManyLiteByQuery,
  findOneByReference,
  findOneById,
  findOneLiteById,
  deleteManyByIds,
  saveOne,
};
