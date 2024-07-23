/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { createOne } = require('./create-one');
const { deleteOne } = require('./delete-one');
const { findMany } = require('./find-many');
const { findOne } = require('./find-one');
const { queryMany } = require('./query-many');
const { updateOne } = require('./update-one');

module.exports = {
  createOne,
  deleteOne,
  findMany,
  findOne,
  queryMany,
  updateOne,
};
