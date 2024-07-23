/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { findAvgScoreByQuery } = require('./find-average-score-by-query');
const { findManyByQuery } = require('./find-many-by-query');
const { deleteManyByQuery } = require('./delete-many-by-query');
const { saveOne } = require('./save-one');
const { saveMany } = require('./save-many');

module.exports = {
  findAvgScoreByQuery,
  findManyByQuery,
  deleteManyByQuery,
  saveOne,
  saveMany,
};
