/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const stream = (
  flatStream: {
    name: string,
    type: string,
    scope: string,
    clientEmitter: any,
    clientReceiver: any,
  },
) => {
  let retVal;
  if (
    !lodash.isEmpty(flatStream)
  ) {
    retVal = {
      name: flatStream.name,
      type: flatStream.type,
      scope: flatStream.scope,
      clientEmitter: flatStream.clientEmitter,
      clientReceiver: flatStream.clientReceiver,
    };
  }
  return retVal;
}

const streams = (
  flatStreams: Array<any>
) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(flatStreams) &&
    lodash.isArray(flatStreams)
  ) {
    for (const FLAT_STREAM of flatStreams) {
      const TMP_FLAT_STREAM = stream(FLAT_STREAM);
      if (
        !lodash.isEmpty(TMP_FLAT_STREAM)
      ) {
        RET_VAL.push(TMP_FLAT_STREAM);
      }
    }
  }
  return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const STREAMS_FLAT = provider.getKeys(
    'EVENT_STREAM_PROVIDER',
    [
      'NAME',
      'TYPE',
      'SCOPE',
      'CLIENT_EMITTER',
      'CLIENT_RECEIVER'
    ]
  );
  const STREAMS = streams(STREAMS_FLAT);
  const RET_VAL = provider.isEnabled('EVENT_STREAM_PROVIDER_ENABLED', false, {
    streams: STREAMS
  });
  return RET_VAL;
}

export {
  transformRawConfiguration
}
