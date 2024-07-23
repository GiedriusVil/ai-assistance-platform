/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'botium-connector-aca-socketio-authorize-chat-session';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { execHttpPostRequest } = require(`@ibm-aca/aca-wrapper-http`);

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const authorizeChatSession = async (params) => {
    const REQUEST_URL = params?.authorization?.url;
    const G_ACA_PROPS = params?.gAcaProps;
    try {
        if (
            lodash.isEmpty(REQUEST_URL)
        ) {
            const MESSAGE = `Missing required params.authorization.url parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        if (
            lodash.isEmpty(G_ACA_PROPS)
        ) {
            const MESSAGE = `Missing required params.gAcaProps parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const POST_REQUEST_OPTIONS = {
          url: REQUEST_URL,
          body: {
            gAcaProps: G_ACA_PROPS
          },
          options: {
            retry: 0,
            timeout: 10000
          }
        };

      const RESPONSE = await execHttpPostRequest({}, POST_REQUEST_OPTIONS);

        const RET_VAL = RESPONSE?.body;

        logger.info('authorizeChatSession', { RET_VAL });

        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);

        ACA_ERROR.data = {
            authorization: {
                url: REQUEST_URL,
            },
            gAcaProps: G_ACA_PROPS,
        };

        const ERRORS = error?.body?.errors;
        if (
            !lodash.isEmpty(ERRORS)
        ) {
            ACA_ERROR.errors = ERRORS;
        }

        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    authorizeChatSession,
}
