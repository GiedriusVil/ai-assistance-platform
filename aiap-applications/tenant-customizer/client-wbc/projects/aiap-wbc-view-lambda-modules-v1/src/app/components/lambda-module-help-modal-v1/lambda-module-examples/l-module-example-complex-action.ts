/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
export const L_MODULE_EXAMPLE_COMPLEX_ACTION = `
#### Complex Action
  
\`\`\`javascript
const MODULE_ID = \`Λ-module-action-tag-<__demo-complex-action___>\`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const ComplexAction = (soaContext) => ({
    replace: 'all',
    series: true,
    evaluate: 'step',
    controller: async (params) => {
        const SESSION_STORE = soaContext?.sessionStore;

        const PARAMS_UPDATE_SESSION = params?.update?.session;
        const PARAMS_UPDATE_SENDER_ID = params?.update.sender?.id;

        const ADAPTER = params?.bot;
        try {
            const RET_VAL = \`<a>ComplexActionTag - demo</a>\`;
            return RET_VAL;
        } catch (error) {
            const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
            appendDataToError(ACA_ERROR), { PARAMS_UPDATE_SENDER_ID, PARAMS_UPDATE_SESSION };
            logger.error('->', { ACA_ERROR });
            await sendErrorMessage(adapter, PARAMS_UPDATE, ON_ERROR_MESSAGE, ACA_ERROR);
        }
    },
});

module.exports = {
    ComplexAction,
}
\`\`\`
`;
