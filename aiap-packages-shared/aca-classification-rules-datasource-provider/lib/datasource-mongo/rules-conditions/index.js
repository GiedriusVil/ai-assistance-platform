/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { saveOne } = require('./save-one');
const { findManyByQuery } = require('./find-many-by-query');
const { findOneById } = require('./find-one-by-id');
const { deleteManyByIds } = require('./delete-many-by-ids');
const { deleteManyByRuleId } = require('./delete-many-by-rule-id');

module.exports = {
  saveOne,
  findManyByQuery,
  findOneById,
  deleteManyByIds,
  deleteManyByRuleId,
};
