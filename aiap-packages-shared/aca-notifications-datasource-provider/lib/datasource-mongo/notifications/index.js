/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { findManyByQuery } = require('./find-many-by-query');
const { findOneById } = require('./find-one-by-id');
const { saveOne } = require('./save-one');
const { deleteOneById } = require('./delete-one-by-id');

module.exports = {
  findManyByQuery,
  findOneById,
  saveOne,
  deleteOneById,
};
