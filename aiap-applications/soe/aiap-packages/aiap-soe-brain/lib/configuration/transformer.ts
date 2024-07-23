/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transformRawConfiguration = async (
  rawConfiguration,
  provider,
) => {
  const RET_VAL = provider.isEnabled('AIAP_SOE_BRAIN_ENABLED', false,
    {
      error: {
        defaultMessage: rawConfiguration.AIAP_SOE_BRAIN_ERROR_DEFAULT_MESSAGE,
      },
    });
  return RET_VAL;
}

export {
  transformRawConfiguration,
}
