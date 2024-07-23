/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export class JWTProviderV1 {

  constructor() {
    //
  }

  get token() {
    const RET_VAL = {
      generateWithUserData: (params: any) => {
        //
      },
    };
    return RET_VAL;
  }

  get config() {
    const RET_VAL = {
      retrieveSecret: () => {
        //
      },
      retrieveExpiration: () => {
        //
      },
    };
    return RET_VAL;
  }
}
