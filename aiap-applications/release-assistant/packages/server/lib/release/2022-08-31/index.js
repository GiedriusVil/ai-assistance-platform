const MODULE_ID = 'release-assistant-release-2022-08-31'

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');


// const { run: updateUtterances } = require('./utterances');
// const { run: updateUtterances } = require('./utterances-new');
// const { run: updateUsers } = require('./users');
const { run: updateSurveys } = require('./surveys');

const execute = async (config) => {
  try {
    // await updateUtterances(config);
    // await updateUsers(config);
    await updateSurveys(config);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error('->', { ACA_ERROR });
  }
};

module.exports = {
  execute,
};
