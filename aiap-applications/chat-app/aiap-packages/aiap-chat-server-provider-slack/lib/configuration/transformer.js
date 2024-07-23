/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const server = (flatServer) => {
    const RET_VAL = {
        tenant: {
            id: ramda.path(['tenantId'], flatServer),
        },
        engagement: {
            id: ramda.path(['engagementId'], flatServer),
        },
        assistant: {
            id: ramda.path(['assistantId'], flatServer),
        },
        external: {
            appId: ramda.path(['externalAppId'], flatServer),
            botUserAccessToken: ramda.path(['externalBotUserAccessToken'], flatServer),
            botSigningSecret: ramda.path(['externalBotSigningSecret'], flatServer),
        }
    }
    return RET_VAL;
}

const servers = (flatServers) => {
    const RET_VAL = [];
    if (
        !lodash.isEmpty(flatServers)
    ) {
        for (let flatServer of flatServers) {
            if (
                !lodash.isEmpty(flatServer)
            ) {
                RET_VAL.push(server(flatServer));
            }
        }
    }
    return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
    const SERVERS_FLAT = provider.getKeys(
        'SLACK_SERVER_PROVIDER',
        [
            'TENANT_ID',
            'ENGAGEMENT_ID',
            'ASSISTANT_ID',

            'EXTERNAL_APP_ID',
            'EXTERNAL_BOT_USER_ACCESS_TOKEN',
            'EXTERNAL_BOT_SIGNING_SECRET',
        ]
    );
    const SERVERS = servers(SERVERS_FLAT);
    const RET_VAL = provider.isEnabled('SLACK_SERVER_PROVIDER_ENABLED', false, {
        servers: SERVERS,
    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
} 
