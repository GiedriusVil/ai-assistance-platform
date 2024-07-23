const MODULE_ID = 'aca-rules-service-rules-import-update-enable-status-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaRulesDatasourceByContext } = require('@ibm-aca/aca-rules-datasource-provider');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const _enableManyByIds = async (context, params) => {
  const DATASOURCE = getAcaRulesDatasourceByContext(context);
  const RET_VALS = [];

  for (const id of params.ids) {
    const RULE = await DATASOURCE.rulesImport.findOneById(context, { id });

    RULE.status = { ...RULE.status, selectedMessageExists: true };
    const MESSAGE_NAME = RULE?.message?.name;
    if (lodash.isEmpty(MESSAGE_NAME)) {
      RULE.status = { ...RULE.status, selectedMessageExists: false };
    }

    RULE.status.enabled = !RULE.status.enabled;
    params.rule = RULE; 

    const RET_VAL = await DATASOURCE.rulesImport.saveOne(context, params);
    RET_VALS.push(RET_VAL);
  }

  return RET_VALS;
}

const enableManyByIds = async (context, params) => {
  try {
    const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _enableManyByIds, context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', {ACA_ERROR});
    throw ACA_ERROR;
  }
};

module.exports = {
    enableManyByIds,
}
