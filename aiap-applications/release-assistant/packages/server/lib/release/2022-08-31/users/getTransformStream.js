const MODULE_ID = 'release-assistant-users-transform-stream';

const { Transform } = require('stream');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { createUserProfile } = require('./helpers/createUserProfile');
const { checkUserExistance } = require('./helpers/checkUserExistance');

let conversationsData = [];

const mapUserIdsToConversationIdsFromUtterances = (utterances) => {
  const RET_VAL = {};

  if (lodash.isEmpty(utterances) || !lodash.isArray(utterances)) {
    return RET_VAL;
  }

  utterances.forEach((utterance) => {
    // ugly, but should work
    if (!lodash.isEmpty(utterance?.context?.private?.userProfile?.id) && !lodash.isEmpty(utterance?.conversationId)) {
      if (lodash.isEmpty(RET_VAL[utterance.context.private.userProfile.id])) {
        RET_VAL[utterance.context.private.userProfile.id] = [utterance.conversationId];
      } else {
        RET_VAL[utterance.context.private.userProfile.id].push(utterance.conversationId);
      }
    }

    if (!lodash.isEmpty(utterance?.context?.private?.userProfile?.userId) && !lodash.isEmpty(utterance?.conversationId)) {
      if (lodash.isEmpty(RET_VAL[utterance.conversationId])) {
        RET_VAL[utterance.context.private.userProfile.userId] = [utterance.conversationId];
      } else {
        RET_VAL[utterance.context.private.userProfile.userId].push(utterance.conversationId);
      }
    }
  });
  
  return RET_VAL;
};

const mapConversationIdsToUserIdsFromUtterances = (utterances) => {
  const RET_VAL = {};

  if (lodash.isEmpty(utterances) || !lodash.isArray(utterances)) {
    return RET_VAL;
  }

  utterances.forEach((utterance) => {
    // ugly, but should work
    if (!lodash.isEmpty(utterance?.context?.private?.userProfile?.id) && !lodash.isEmpty(utterance?.conversationId)) {
      RET_VAL[utterance.conversationId] = { userId: utterance.context.private.userProfile.id, channelMeta: { hostname: utterance?.context?.gAcaProps?.href || null  }};
    }

    if (!lodash.isEmpty(utterance?.context?.private?.userProfile?.userId) && !lodash.isEmpty(utterance?.conversationId)) {
      RET_VAL[utterance.conversationId] = { userId: utterance.context.private.userProfile.userId, channelMeta: { hostname: utterance?.context?.gAcaProps?.href || null  }};
    }
  });

  return RET_VAL;
};

const mapUserIdsToUsersDataFromUtterances = (utterances) => {
  const RET_VAL = {};

  if (lodash.isEmpty(utterances) || !lodash.isArray(utterances)) {
    return RET_VAL;
  }

  utterances.forEach((utterance) => {
    if (!lodash.isEmpty(utterance?.context?.private?.userProfile?.id)) {
      RET_VAL[utterance.context.private.userProfile.id] = { data: utterance.context.private.userProfile, standartAcaProfile: true };
    }

    if (!lodash.isEmpty(utterance?.context?.private?.userProfile?.userId)) {
      RET_VAL[utterance.context.private.userProfile.userId] = { data: utterance.context.private.userProfile, standartAcaProfile: false };
    }
  });

  return RET_VAL;
};

const getUserCreatedAndLastVisitTimestampsFromConversations = (userConversationIds) => {
  let minCreated;
  let maxLastVisitTimestamp;
  userConversationIds.forEach((userConversationId) => {

    const USER_CONVERSATION = conversationsData.find(conversation => conversation.id === userConversationId);

    const TEMP_DATE = new Date(USER_CONVERSATION.started);

    if (TEMP_DATE == 'Invalid Date') {
      console.log('--> invalid conversation date detected', JSON.stringify(USER_CONVERSATION, null, 2));
      return;
    }

    if (!minCreated && !maxLastVisitTimestamp) {
      minCreated = maxLastVisitTimestamp = TEMP_DATE;
    } else if (TEMP_DATE.getTime() < minCreated.getTime()) {
      minCreated = TEMP_DATE;
    } else if (maxLastVisitTimestamp.getTime() < TEMP_DATE.getTime()) {
      maxLastVisitTimestamp = TEMP_DATE;
    }
  });

  if (!minCreated && !maxLastVisitTimestamp) {
    return null;
  }

  return { minCreated, maxLastVisitTimestamp };
};

const prepareUsersMongoOperations = (checkedUsers, usersData, userConversationIds, params) => {
  const RET_VAL = [];

  for (const [USER_ID, METADATA] of Object.entries(checkedUsers)) {
    const USER_CONVERSATION_IDS = userConversationIds[USER_ID];

    const { minCreated, maxLastVisitTimestamp } = getUserCreatedAndLastVisitTimestampsFromConversations(USER_CONVERSATION_IDS);

    if (!minCreated && !maxLastVisitTimestamp) {
      console.log(`--> Cannot get user date from conversation. UserId: ${USER_ID}`, JSON.stringify(METADATA, null, 2));
      continue; //skip this user;
    }

    if (METADATA.exists) {
      const TEMP_CREATED_DATE = new Date(METADATA.created);
      const TEMP_LAST_VISIT_TIMESTAMP = new Date(METADATA.lastVisitTimestamp);

      if (TEMP_CREATED_DATE == 'Invalid Date' || TEMP_LAST_VISIT_TIMESTAMP == 'Invalid Date') {
        console.log(`--> invalid user date detected. UserId: ${USER_ID}`, JSON.stringify(METADATA, null, 2));
        continue; // skip this user;
      }

      if (minCreated.getTime() < TEMP_CREATED_DATE.getTime()) {
        const UPDATE_ONE = {
          updateOne: {
            filter: {
              _id: USER_ID
            },
            update: {
              $set: {
                created: minCreated,
              }
            }
          }
        };

        RET_VAL.push(UPDATE_ONE);
      } 

      if (maxLastVisitTimestamp.getTime() > TEMP_LAST_VISIT_TIMESTAMP.getTime()) {
        const UPDATE_ONE = {
          updateOne: {
            filter: {
              _id: USER_ID
            },
            update: {
              $set: {
                lastVisitTimestamp: maxLastVisitTimestamp
              }
            }
          }
        };

        RET_VAL.push(UPDATE_ONE);
      }

      if (!METADATA.email) {
        const EMAIL = usersData[USER_ID].standartAcaProfile 
        ? usersData[USER_ID].data.email || null 
        : usersData[USER_ID].data?.content?.mail?.[0] ?? null;

        const UPDATE_ONE = {
          updateOne: {
            filter: {
              _id: USER_ID
            },
            update: {
              $set: {
                email: EMAIL,
                created: TEMP_CREATED_DATE,
                lastVisitTimestamp: TEMP_LAST_VISIT_TIMESTAMP,
              }
            }
          }
        };

        RET_VAL.push(UPDATE_ONE);
      }

      if (!METADATA.country) {
        const COUTRY = usersData[USER_ID].standartAcaProfile 
        ? usersData[USER_ID].data?.address?.countryName ?? null 
        : usersData[USER_ID].data?.content?.co ?? null;

        const UPDATE_ONE = {
          updateOne: {
            filter: {
              _id: USER_ID
            },
            update: {
              $set: {
                country: COUTRY,
                created: TEMP_CREATED_DATE,
                lastVisitTimestamp: TEMP_LAST_VISIT_TIMESTAMP,
              }
            }
          }
        };

        RET_VAL.push(UPDATE_ONE);
      }
      
    } else {
      const NEW_USER = createUserProfile(usersData[USER_ID], minCreated, maxLastVisitTimestamp, params);
      
      const INSERT_ONE = {
        insertOne: {
          document: NEW_USER,
        },
      };

      RET_VAL.push(INSERT_ONE);
    }
  }


  return RET_VAL;
};

const updateUsers = async (db, params) => {
  const OPERATIONS = params.operations;
  const CONFIG = params.config;

  await db.collection(CONFIG.app.collections.users).bulkWrite(OPERATIONS, { ordered: false });
};

const processConversations = async (db, params) => {
  const CONFIG = params.config;

  const UTTERANCE_PROMISES = conversationsData.map((conversation) => {
    const QUERY = {
      conversationId: {
        $eq: conversation.id
      },
      $or: [
        {
          "context.private.userProfile.userId": {
            $exists: true
          }
        },
        {
          "context.private.userProfile.id": {
            $exists: true
          }
        }
      ]
    };

    return db.collection(CONFIG.app.collections.utterances).find(QUERY).sort({ timestamp: 1 }).limit(1).toArray();
  });

  const UTTERANCES = (await Promise.all(UTTERANCE_PROMISES)).flat(); // check the structure

  const MAPPED_USER_IDS_WITH_USERS_DATA = mapUserIdsToUsersDataFromUtterances(UTTERANCES);
  const MAPPED_USER_IDS_WITH_CONVERSATION_IDS = mapUserIdsToConversationIdsFromUtterances(UTTERANCES);
  const MAPPED_CONVERSATION_IDS_WITH_USER_IDS = mapConversationIdsToUserIdsFromUtterances(UTTERANCES);

  const CHECKED_USERS = await checkUserExistance(db, { userIds: Object.keys(MAPPED_USER_IDS_WITH_USERS_DATA), config: CONFIG }); 

  const USERS_MONGO_OPERATIONS = prepareUsersMongoOperations(CHECKED_USERS, MAPPED_USER_IDS_WITH_USERS_DATA, MAPPED_USER_IDS_WITH_CONVERSATION_IDS, params);

  if (USERS_MONGO_OPERATIONS.length > 0) {
    await updateUsers(db, { config: CONFIG, operations: USERS_MONGO_OPERATIONS });
  }

  if (lodash.isEmpty(MAPPED_CONVERSATION_IDS_WITH_USER_IDS)) {
    console.log('--> WARNING: MISSING USER IDS FOR FOLLOWING CONVERSATIONS');
    console.log('--> conversationsData', JSON.stringify(conversationsData, null, 2));
  } else {
    params.self.push({ conversations: MAPPED_CONVERSATION_IDS_WITH_USER_IDS });
  }

  conversationsData = [];
  params.done();
};

const getTransformStream = (db, params) => {
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true, // Enables us to use object in chunk
    async transform(record, encoding, done) {
      try {
        conversationsData.push({
          id: record._id,
          started: record.start,
        });
        if (conversationsData.length >= 10) {
          // TODO: add projection to find query
          params.self = this;
          params.done = done;
          await processConversations(db, params);
          
        } else {
          done();
        }
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        console.error('->', { ACA_ERROR });
        done(ACA_ERROR);
      }
    },
    async flush(done) {
      try {
        if (conversationsData.length > 0) {
          params.self = this;
          params.done = done;
          await processConversations(db, params);
        } else {
          done();
        }
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        console.error('->', { ACA_ERROR });
        done(ACA_ERROR);
      }
    }
  });
}

module.exports = {
  getTransformStream,
};
