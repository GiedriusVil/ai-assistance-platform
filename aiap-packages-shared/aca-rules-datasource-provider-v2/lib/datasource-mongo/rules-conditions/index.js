/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const { findManyByQuery } = require('./find-many-by-query');
//
const { deleteManyByIds } = require('./delete-many-by-ids');
const { deleteManyByRuleId } = require('./delete-many-by-rule-id');
const { deleteManyByRuleKey } = require('./delete-many-by-rule-key');
const { findOneById } = require('./find-one-by-id');
const { saveOne } = require('./save-one');

module.exports = {
  findManyByQuery,
  //
  deleteManyByIds,
  deleteManyByRuleId,
  deleteManyByRuleKey,
  findOneById,
  saveOne,
};
