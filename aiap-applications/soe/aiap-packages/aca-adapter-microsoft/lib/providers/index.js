/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const {
    GAcaPropsProvider,
    initGAcaPropsProvider,
    getGAcaPropsByAppId,
    getGAcaPropsByBot,
    getGAcaProps,
} = require('./g-aca-props');
const {
    MicrosoftCredentialsProvider,
    initMicrosoftCredentialsProvider,
    getMicrosoftCredentialsByAppId,
    getMicrosoftCredentials,
} = require('./microsoft-credentials');


module.exports = {
    GAcaPropsProvider,
    initGAcaPropsProvider,
    getGAcaPropsByAppId,
    getGAcaPropsByBot,
    getGAcaProps,
    MicrosoftCredentialsProvider,
    initMicrosoftCredentialsProvider,
    getMicrosoftCredentialsByAppId,
    getMicrosoftCredentials,
};
