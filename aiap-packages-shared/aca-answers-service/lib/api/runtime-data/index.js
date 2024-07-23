/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { synchronizeWithConfigDirectoryAnswersStore } = require('./synchronize-with-config-directory-answers-store');

const { synchronizeWithDatabase } = require('./synchronize-with-database');

module.exports = {
  synchronizeWithConfigDirectoryAnswersStore,
  synchronizeWithDatabase,
}
