/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { createOne } = require('./create-one');
const { deleteOne } = require('./delete-one');
const { findMany } = require('./find-many');

module.exports = {
  createOne,
  deleteOne,
  findMany,
};
