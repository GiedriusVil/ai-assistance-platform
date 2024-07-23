/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const _sanitizeDatasource = (datasource) => {
  let retVal;
  if (
    !lodash.isEmpty(datasource)
  ) {
    retVal = {
      id: datasource?.id,
      hash: datasource?.hash,
      type: datasource?.type,
      client: datasource?.client,
      clientHash: datasource?.clientHash,
    };
  }
  return retVal;
}

const _sanitizeDatasources = (datasources) => {
  let retVal;
  if (
    lodash.isArray(datasources)
  ) {
    retVal = datasources.map((item) => {
      return _sanitizeDatasource(item);
    });
  }
  return retVal;
}

const appendContextToError = (error, context) => {
  if (
    !lodash.isEmpty(error) &&
    !lodash.isEmpty(context)
  ) {
    error.context = {
      user: {
        id: context?.user?.id,
      },
      tenant: {
        id: context?.user?.session?.tenant?.id,
        hash: context?.user?.session?.tenant?.hash,
        datasources: _sanitizeDatasources(context?.user?.session?.tenant?._datasources),
      }
    };
  }
}

export {
  appendContextToError,
}
