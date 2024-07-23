/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const { findManyByQuery } = require('./find-many-by-query');
//
const { deleteManyByKeys } = require('./delete-many-by-keys');
const { findOneByKey } = require('./find-one-by-key');
const { saveOne } = require('./save-one');

module.exports = {
  findManyByQuery,
  //
  deleteManyByKeys,
  findOneByKey,
  saveOne,
};
