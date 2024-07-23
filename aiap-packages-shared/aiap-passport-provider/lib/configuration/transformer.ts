/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import ramda from '@ibm-aca/aca-wrapper-ramda';

const strategy = (
  flatClient: {
    name: any,
  },
) => {
  const RET_VAL = {
    name: flatClient?.name,
  }

  return RET_VAL;
}

const strategies = (
  flatSources: Array<any>,
) => {
  const RET_VAL = [];
  if (
    !ramda.isNil(flatSources)
  ) {
    for (const FLAT_SOURCE of flatSources) {
      if (
        !ramda.isNil(FLAT_SOURCE)
      ) {
        RET_VAL.push(strategy(FLAT_SOURCE));
      }
    }
  }
  return RET_VAL;
}

export const transformRawConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const CONFIG_FLAT = provider.getKeys(
    'PASSPORT_PROVIDER_STRATEGY',
    [
      'NAME',
    ]
  );
  const STRATEGIES = strategies(CONFIG_FLAT);
  const RET_VAL = provider.isEnabled('PASSPORT_PROVIDER_ENABLED', false, {
    strategies: STRATEGIES
  });
  return RET_VAL;
}
