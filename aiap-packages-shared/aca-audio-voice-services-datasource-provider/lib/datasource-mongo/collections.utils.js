/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-audio-voice-services-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
    audioVoiceServices: 'audioVoiceServices',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
    const COLLECTIONS_CONFIGURATION = configuration?.collections;

    const AUDIO_VOICE_SERVICES = COLLECTIONS_CONFIGURATION?.audioVoiceServices;

    const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
    if (
        !lodash.isEmpty(AUDIO_VOICE_SERVICES)
    ) {
        RET_VAL.audioVoiceServices = AUDIO_VOICE_SERVICES;
    }
    return RET_VAL;
}


module.exports = {
    sanitizedCollectionsFromConfiguration,
}
