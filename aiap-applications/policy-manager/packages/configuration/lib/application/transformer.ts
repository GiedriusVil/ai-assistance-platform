/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  isStringTrue,
} from '../utils';

const transformAppConfiguration = async (rawConfiguration) => {
  const RET_VAL = {
    users: {
      admin: {
        userName: rawConfiguration.ADMIN_USER_NAME || 'admin',
        userPass: rawConfiguration.ADMIN_USER_PASS,
      },
      firstUser: {
        userName: rawConfiguration.FIRST_USER_NAME || 'coh-user1',
        userPass: rawConfiguration.FIRST_USER_PASS,
      },
      secondUser: {
        userName: rawConfiguration.SECOND_USER_NAME || 'coh-user2',
        userPass: rawConfiguration.SECOND_USER_PASS,
      },
      adminTestUser: isStringTrue(rawConfiguration.ADMIN_TEST_USER_ENABLED) ? {
        userName: rawConfiguration.ADMIN_TEST_USER_NAME || 'coh-test-admin',
        userPass: rawConfiguration.ADMIN_TEST_USER_PASS,
      } : false
    },
    port: rawConfiguration.PORT || 3005,
  };
  return RET_VAL;
}

export {
  transformAppConfiguration
}
