const lodash = require('@ibm-aca/aca-wrapper-lodash');

const deleteUsersWithNoReference = async (db, params) => {
  const CONFIG = params.config;

  const ALL_USERS = await db.collection(CONFIG.app.collections.users).find({}).toArray();

  const PROMISES = [];

  ALL_USERS.forEach((user) => {
    PROMISES.push(
      db.collection(CONFIG.app.collections.conversations).find({
        userId: user._id
      }).limit(1).toArray()
    );
  });

  const CONVERSATIONS = (await Promise.all(PROMISES)).flat();

  const USERS_TO_DELETE = [];

  ALL_USERS.forEach((user) => {
    const FOUND = CONVERSATIONS.find((conversation) => conversation.userId === user._id);
    if (lodash.isEmpty(FOUND)) {
      USERS_TO_DELETE.push(user._id);
    }
  });

  const QUERY = {
    _id: {
      $in: USERS_TO_DELETE,
    }
  }

  const RESULT = await db.collection(CONFIG.app.collections.users).deleteMany(QUERY);

  return RESULT.deletedCount;
};

module.exports = {
  deleteUsersWithNoReference,
};
