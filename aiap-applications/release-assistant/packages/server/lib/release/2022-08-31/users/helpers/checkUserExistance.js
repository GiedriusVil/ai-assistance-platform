const lodash = require('@ibm-aca/aca-wrapper-lodash');

const checkUserExistance = async (db, params) => {
  const USER_IDS = params.userIds;
  const CONFIG = params.config;

  const QUERY = {
    _id: {
      $in: USER_IDS,
    }
  };

  const USERS = await db.collection(CONFIG.app.collections.users).find(QUERY).toArray();

  const RET_VAL = {};

  USER_IDS.forEach((id) => {
    const FOUND = USERS.find((user) =>  user._id === id);

    if (lodash.isEmpty(FOUND)) {
      RET_VAL[id] = { exists: false } ;
    } else {
      RET_VAL[id] = { exists: true, lastVisitTimestamp: FOUND.lastVisitTimestamp, created: FOUND.created, email: FOUND.email, country: FOUND.country };
    }
  });

  return RET_VAL;
};

module.exports = {
  checkUserExistance,
};
