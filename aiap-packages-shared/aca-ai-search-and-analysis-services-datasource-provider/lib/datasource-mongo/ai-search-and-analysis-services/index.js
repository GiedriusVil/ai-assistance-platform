/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { saveOne } = require('./save-one');
const { findOneById } = require('./find-one-by-id');
const { deleteManyByIds } = require('./delete-many-by-ids');
const { findManyByQuery } = require('./find-many-by-query');

module.exports = {
  saveOne,
  findOneById,
  deleteManyByIds,
  findManyByQuery,
};
