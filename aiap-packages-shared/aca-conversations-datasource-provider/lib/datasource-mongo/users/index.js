/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { saveOne } = require('./save-one');
const { findOneById } = require('./find-one-by-id');
const { findManyByQueryV2 } = require('./find-many-by-query-v2');
const { maskMany } = require('./mask-many');
const { saveMany } = require('./save-many');

module.exports = {
  saveOne,
  findOneById,
  findManyByQueryV2,
  maskMany,
  saveMany,
};
