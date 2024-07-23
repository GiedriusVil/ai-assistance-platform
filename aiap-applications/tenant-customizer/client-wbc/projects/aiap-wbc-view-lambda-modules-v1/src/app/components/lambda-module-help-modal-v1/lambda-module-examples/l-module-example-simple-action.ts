/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
export const L_MODULE_EXAMPLE_SIMPLE_ACTION = `
#### Simple Action

\`\`\`javascript
const MODULE_ID = \`Λ-module-action-tag-<__action_tag_name__>\`
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const SimpleAction = ({
    replace: 'all',
    series: true,
    evaluate: 'step',
    controller: async (params) => {
        const PARAMS_UPDATE_SENDER_ID = params?.update?.sender?.id;
        try {
            if (
                lodash.isEmpty(PARAMS_UPDATE_SENDER_ID)
            ) {
                const MESSAGE = \`Missing required params.update.sender.id parameter!\`;
                throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
            }
            if ('ACA_CANCEL_OUTGOING_THREAD' === params.before) {
                return '';
            };
            // CUSTOM_CHANGES_START

            

            // CUSTOM_CHANGES_END
            const RET_VAL = \`\${params}\`;
            return RET_VAL;
        } catch (error) {
            const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
            appendDataToError(ACA_ERROR, { PARAMS_UPDATE_SENDER_ID })
            logger.error('->', { ACA_ERROR });
            throw ACA_ERROR;
        }
    },
});

module.exports = {
    SimpleAction,
}
\`\`\`
`;
