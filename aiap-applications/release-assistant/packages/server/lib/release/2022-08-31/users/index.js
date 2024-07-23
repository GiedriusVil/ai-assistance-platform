const MODULE_ID = 'release-assistant-2022-08-31-users';

const { pipeline } = require('stream/promises');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getFindStream } = require('./getFindStream');
const { getTransformStream } = require('./getTransformStream');
const { getUpdateStream } = require('./getUpdateStream');
const { deleteUsersWithNoReference } = require('./deleteUsersWithNoReference');

// const { getNotUpdatedUsers } = require('./getNotUpdatedUsers');

const run = async (config) => {
  try {
    console.log('### USERS UPDATE STARTED');
    console.time('time elapsed');
    const ACA_MONGO_CLIENT = getAcaMongoClient(config.app.client);

    const DB = await ACA_MONGO_CLIENT.getDB();

    const COUNT = await DB.collection(config.app.collections.conversations).count();
    console.log('---> COUNT', COUNT);

    const COUNT_WITH_SAME_IDS = await DB.collection(config.app.collections.conversations).find({ $where: 'this._id == this.userId' }).count();

    console.log('---> COUNT_WITH_SAME_IDS', COUNT_WITH_SAME_IDS);

    console.timeLog('time elapsed');

    await pipeline(
      await getFindStream(DB, { config }),
      getTransformStream(DB, { config, }),
      getUpdateStream(DB, { config, total: COUNT_WITH_SAME_IDS }),
    );

    console.timeLog('time elapsed');
    console.log('### DELETING REDUNDANT USERS');

    const DELETED_COUNT = await deleteUsersWithNoReference(DB, { config });
    console.log(`### DELETED REDUNDANT USERS ${DELETED_COUNT}`);
    console.timeEnd('time elapsed');
    console.log('### USERS UPDATE FINISHED');

    // For validation of non-updated users
    // await getNotUpdatedUsers(DB, { config });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  run,
};
