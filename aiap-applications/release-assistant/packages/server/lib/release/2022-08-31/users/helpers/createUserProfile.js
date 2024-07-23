
const transformFromNewStructure = (userProfile, created, lastVisitTimestamp, assistantId, tenantId) => {
  const RET_VAL = {
    _id: userProfile?.id ?? null,
    tenantId: tenantId,
    assistantId: assistantId,
    externalUserId: userProfile?.id ?? null,
    firstName: userProfile?.firstName ?? null,
    lastName: userProfile?.lastName ?? null,
    fullName: userProfile?.fullName ?? null,
    country: userProfile?.address?.countryName ?? null,
    created: created,
    lastVisitTimestamp: lastVisitTimestamp,
    email: userProfile?.email ?? null,
    _processed_2022_08_31_created: true,
  };
  return RET_VAL;
};

const transformFromOldStructure = (userProfile, created, lastVisitTimestamp, assistantId, tenantId) => {
  const RET_VAL = {
    _id: userProfile?.userId ?? null,
    tenantId: tenantId,
    assistantId: assistantId,
    externalUserId: userProfile?.userId ?? null,
    firstName: userProfile.content?.name?.first,
    lastName: userProfile?.content?.name?.last ?? null,
    fullName: userProfile?.content?.nameDisplay ?? null,
    country: userProfile?.content?.co ?? null,
    created: created,
    lastVisitTimestamp: lastVisitTimestamp,
    email: userProfile?.content?.mail?.[0] ?? null,
    _processed_2022_08_31_created: true,
  };

  return RET_VAL;
};


const createUserProfile = (userData, created, lastVisitTimestamp, params) => {
  const CONFIG = params.config;
  const ASSISTANT_ID = CONFIG.app.assistantId;
  const TENANT_ID = CONFIG.app.tenantId;
  const RET_VAL = userData.standartAcaProfile 
    ? transformFromNewStructure(userData.data, created, lastVisitTimestamp, ASSISTANT_ID, TENANT_ID) 
    : transformFromOldStructure(userData.data, created, lastVisitTimestamp, ASSISTANT_ID, TENANT_ID);
  return RET_VAL;
};

module.exports = {
  createUserProfile,
};
