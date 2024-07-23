/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const credential = (flatClient) => {
    const RET_VAL = {
        botName: flatClient?.botName,
        appId: flatClient?.botAppId,
        appPassword: flatClient?.botAppPassword,
    }
    return RET_VAL;
}

const credentials = (flatSources) => {
    const RET_VAL = [];
    if (!ramda.isNil(flatSources)) {
        for (let flatSource of flatSources) {
            if (!ramda.isNil(flatSource)) {
                RET_VAL.push(credential(flatSource));
            }
        }
    }
    return RET_VAL;
}

const gAcaProp = (flatClient) => {
    const RET_VAL = {
        botName: flatClient?.botName,
        appId: flatClient?.botAppId,
        tenant: flatClient?.tenantName,
        tenantId: flatClient?.tenantId,
        assistantId: flatClient?.assistantId,
        engagementId: flatClient?.engagementId,
        displayName: flatClient?.assistantDisplayName,
        isoLang: flatClient?.isoLang,
    }
    return RET_VAL;
}

const gAcaProps = (flatSources) => {
    const RET_VAL = [];
    if (!ramda.isNil(flatSources)) {
        for (let flatSource of flatSources) {
            if (!ramda.isNil(flatSource)) {
                RET_VAL.push(gAcaProp(flatSource));
            }
        }
    }
    return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
    const CLIENTS_FLAT = provider.getKeys(
        'MICROSOFT_ADAPTER',
        [
            'BOT_NAME',
            'BOT_APP_ID',
            'BOT_APP_PASSWORD',
            'TENANT_NAME',
            'TENANT_ID',
            'ASSISTANT_DISPLAY_NAME',
            'ASSISTANT_ID',
            'ENGAGEMENT_ID',
            'ISO_LANG'
        ]
    );
    const CREDENTIALS = credentials(CLIENTS_FLAT);
    const G_ACA_PROPS = gAcaProps(CLIENTS_FLAT);
    const RET_VAL = provider.isEnabled('MICROSOFT_ADAPTER_ENABLED', false, {
        credentials: CREDENTIALS,
        gAcaProps: G_ACA_PROPS
    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
