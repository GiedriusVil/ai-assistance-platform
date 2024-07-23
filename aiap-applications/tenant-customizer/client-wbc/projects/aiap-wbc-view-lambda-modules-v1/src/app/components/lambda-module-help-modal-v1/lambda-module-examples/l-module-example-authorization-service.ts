/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
export const L_MODULE_EXAMPLE_AUTHORIZATION_SERVICE = `
#### Authorization Service
\`\`\`javascript
const MODULE_ID = 'aca-authorization-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getAcaUserProfileProvider } = require('@ibm-aca/aca-user-profile-provider');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const __transformToAcaUserProfile = (userProfile) => {
  return defaultAcaUserProfile = {
      version: '0.0.1',
      id: userProfile?.userId ?? null,
      firstName: userProfile?.content?.name?.first ?? null,
      lastName: userProfile?.content?.nameDisplay ?? null,
      fullName: userProfile?.content?.mail?.[0] ?? null,
      email: userProfile?.email ?? null,
      company: {
          id: userProfile?.content?.legalEntity?.code ?? null,
          name: userProfile?.content?.legalEntity?.name ?? null,
      },
      businessUnit: {
          id: userProfile?.content?.org?.group ?? null,
          name: userProfile?.content?.org?.title ?? null,
      },
      costCenter: {
          id: userProfile?.content?.dept?.code ?? null,
          name: userProfile?.content?.dept?.title ?? null,
      },
      manager: {
          firstName: userProfile?.content?.functionalManager?.name?.first ?? null,
          lastName: userProfile?.content?.functionalManager?.name?.last ?? null,
          fullName: userProfile?.content?.functionalManager?.nameDisplay ?? null,
          email: userProfile?.content?.functionalManager?.preferredIdentity ?? null,
      },
      purchasingUnit: {
          id: userProfile?.content?.co ?? null,
      },
      address: {
          countryName: userProfile?.content?.co ?? null,
      },
      geography: {
          id: userProfile?.content.iot ?? null,
          name: null,
      },
  };
};

const execute = async (context, params) => {
  try {
      console.log('--> from lambda');
      const SESSION = ramda.path(['session'], params);

      const G_ACA_PROPS = ramda.path(['gAcaProps'], SESSION);
      const G_ACA_PROPS_USER = ramda.path(['user'], G_ACA_PROPS);
      let userProfile = ramda.path(['userProfile'], G_ACA_PROPS);

      if (
          lodash.isEmpty(userProfile)
      ) {
          const G_ACA_PROPS_USER_EMAIL = ramda.path(['email'], G_ACA_PROPS_USER);
          if (
              !lodash.isEmpty(G_ACA_PROPS_USER_EMAIL)
          ) {
              const USER_PROFILE_PROVIDER = getAcaUserProfileProvider();
              userProfile = await USER_PROFILE_PROVIDER.profiles.retrieveOneByEmail({}, { email: G_ACA_PROPS_USER_EMAIL });
          }
      }
      delete SESSION.user;
      if (
          !lodash.isEmpty(G_ACA_PROPS_USER)
      ) {
          SESSION.user = {
              id: ramda.path(['userId'], userProfile),
              ...G_ACA_PROPS_USER
          };
      }

      SESSION.userProfile = __transformToAcaUserProfile(userProfile);
  } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('->', { ACA_ERROR });
      throw ACA_ERROR;
  }
}

module.exports = {
  execute,
};
\`\`\`
`;
