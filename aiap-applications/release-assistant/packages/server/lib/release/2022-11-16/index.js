const MODULE_ID = 'release-assistant-release-2022-11-16'

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');


const { run: updateUtterancesWithTransfers } = require('./utterances-transfers');
const { run: updateConversationsWithChannelMetaType } = require('./conversations-channel-meta-type');
const { run: updatedUtterancesWithCreateTicket } = require('./utterances-create-ticket');


const execute = async (config) => {
  try {
    await updateConversationsWithChannelMetaType(config);
    await updatedUtterancesWithCreateTicket(config);
    await updateUtterancesWithTransfers(config);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error('->', { ACA_ERROR });
  }
};

module.exports = {
  execute,
};
