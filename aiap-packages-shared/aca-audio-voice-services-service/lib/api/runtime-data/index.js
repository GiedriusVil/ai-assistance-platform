/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { synchronizeWithConfigDirectoryAudioVoiceService } = require('./synchronize-with-config-directory-audio-voice-service');
const { synchronizeWithDatabase } = require('./synchronize-with-database');
const { deleteManyByIdsFromDirectoryAudioVoiceService } = require('./delete-many-by-ids-from-config-directory-audio-voice-service');

module.exports = {
  synchronizeWithConfigDirectoryAudioVoiceService,
  synchronizeWithDatabase,
  deleteManyByIdsFromDirectoryAudioVoiceService
}
