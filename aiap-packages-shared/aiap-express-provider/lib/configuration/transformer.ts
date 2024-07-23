/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const _security = (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = provider.isEnabled('AIAP_EXPRESS_PROVIDER_SECURITY_ENABLED', true, {
    frameguardEnabled: provider.isEnabled('AIAP_EXPRESS_PROVIDER_SECURITY_FRAMEGUARD_ENABLED', true),
    redirectToSSL: provider.isEnabled('AIAP_EXPRESS_PROVIDER_SECURITY_REDIRECT_TO_SSL', true),
    rateLimiting: provider.isEnabled('AIAP_EXPRESS_PROVIDER_SECURITY_RATE_LIMITING_ENABLED', true, {
      maxRequests: rawConfiguration.AIAP_EXPRESS_PROVIDER_SECURITY_RATE_LIMITING_MAX_REQUESTS,
      windowSecs: rawConfiguration.AIAP_EXPRESS_PROVIDER_SECURITY_WINDOW_SECS,
    }),
  });
  return RET_VAL;
}

const _urlRewrite = (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = provider.isEnabled('AIAP_EXPRESS_PROVIDER_URL_REWRITE_ENABLED', false, {
    matchPattern: rawConfiguration.AIAP_EXPRESS_PROVIDER_URL_REWRITE_MATCH_PATTERN,
    replacePattern: rawConfiguration.AIAP_EXPRESS_PROVIDER_URL_REWRITE_REPLACE_PATTERN,
  });
  return RET_VAL;
}

const _session = (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = provider.isEnabled('AIAP_EXPRESS_PROVIDER_SESSION_ENABLED', true, {
    redisClientName: rawConfiguration.AIAP_EXPRESS_PROVIDER_SESSION_REDIS_CLIENT_NAME,
  });
  return RET_VAL;
}

const _cors = (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = provider.isEnabled('AIAP_EXPRESS_PROVIDER_CORS_ENABLED', false, {
    whitelist: rawConfiguration.AIAP_EXPRESS_PROVIDER_CORS_WHITELIST,
  });
  return RET_VAL;
}

const _bodyParser = (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = provider.isEnabled('AIAP_EXPRESS_PROVIDER_BORY_PARSER_ENABLED', false, {
    json: {
      limit: rawConfiguration.AIAP_EXPRESS_PROVIDER_BORY_PARSER_JSON_LIMIT,
    },
    urlencoded: {
      extended: provider.isTrue(rawConfiguration.AIAP_EXPRESS_PROVIDER_BORY_PARSER_URLENCODED_EXTENDED),
      limit: rawConfiguration.AIAP_EXPRESS_PROVIDER_BORY_PARSER_URLENCODED_LIMIT,
      parameterLimit: rawConfiguration.AIAP_EXPRESS_PROVIDER_BORY_PARSER_URLENCODED_PARAMETER_LIMIT,
    }
  });
  return RET_VAL;
}

export const transformRawConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const RET_VAL = {
    cors: _cors(rawConfiguration, provider),
    session: _session(rawConfiguration, provider),
    urlRewrite: _urlRewrite(rawConfiguration, provider),
    bodyParser: _bodyParser(rawConfiguration, provider),
    security: _security(rawConfiguration, provider),
  };
  return RET_VAL;
}

