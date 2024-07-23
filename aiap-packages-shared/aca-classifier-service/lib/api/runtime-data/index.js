/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { deleteManyByIdsFromDirectoryClassifierModel } = require('./delete-many-by-ids-from-config-directory-classifier-model');
const { synchronizeWithConfigDirectoryClassifierModel } = require('./synchronize-with-config-directory-classifier-model');
const { synchronizeWithDatabase } = require('./synchronize-with-database');

module.exports = {
  deleteManyByIdsFromDirectoryClassifierModel,
  synchronizeWithConfigDirectoryClassifierModel,
  synchronizeWithDatabase,
}
