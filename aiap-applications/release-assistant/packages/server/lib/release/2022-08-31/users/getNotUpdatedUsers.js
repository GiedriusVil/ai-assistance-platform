
const getNotUpdatedUsers = async (db, params) => {
  const config = params.config;
  const PIPELINE = [
    {
      $match: { $expr: { $eq: ["$_id", "$userId"] } }
    },
    {
      $lookup: {
        from: "utterances",
        localField: "_id",
        foreignField: "conversationId",
        as: "utterances"
      }
    },
  ];

  const RESULT = await db.collection(config.app.collections.conversations).aggregate(PIPELINE).toArray();

  const missingUsers = new Map();

  RESULT.forEach((conversation) => {
    conversation?.utterances?.forEach((utterance) => {
      if (utterance?.context?.private?.userProfile?.userId) {
        missingUsers.set(conversation._id, {
          conversationId: conversation._id,
          userId: utterance?.context?.private?.userProfile?.userId,
          old: true
        })
      }
      if (utterance?.context?.private?.userProfile?.id) {
        missingUsers.set(conversation._id, {
          conversationId: conversation._id,
          userId: utterance?.context?.private?.userProfile?.id,
          old: false
        });
      }
    });
  });

  console.log('--> missing users size', missingUsers.size);
  for (let entry of missingUsers.entries()) {
    console.log('-->', entry);
  }
  
};

module.exports = {
  getNotUpdatedUsers
};
