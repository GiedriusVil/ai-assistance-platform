/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { findOneAndModify } = require('./find-one-and-modify');
const { findOneById } = require('./find-one-by-id');
const { saveOne } = require('./save-one');

module.exports = {
  findOneAndModify,
  findOneById,
  saveOne,
}
