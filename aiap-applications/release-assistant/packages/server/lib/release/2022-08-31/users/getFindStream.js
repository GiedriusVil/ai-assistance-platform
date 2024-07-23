const MODULE_ID = 'release-assistant-find-conversations-stream';

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const getFindStream = async (db, params) => {
  try {
    const config = params.config;

    const QUERY = {
      $where: 'this._id == this.userId',
    };

    const RET_VAL = await db.collection(config.app.collections.conversations).find(QUERY).sort({ start: -1 }).batchSize(config.app.bulkSize);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  getFindStream,
};
