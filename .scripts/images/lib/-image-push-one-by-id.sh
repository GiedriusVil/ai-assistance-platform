#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_images_imagePushOneById(){
  local FUNCTION_NAME="_images_dockerBuildOneById"
  local TIMESTAMP=$(date +%s)

  _loggers_debug "${FUNCTION_NAME}" "AIAP_IMAGE_PUSH_URL: ${AIAP_IMAGE_PUSH_URL}"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_IMAGE_PUSH_USERNAME: ${AIAP_IMAGE_PUSH_USERNAME}"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_IMAGE_PUSH_PASSWORD: ${AIAP_IMAGE_PUSH_PASSWORD}"

  if
    [ -z "${AIAP_IMAGE_PUSH_URL}" ]
  then
    _loggers_error "${FUNCTION_NAME}"
    _loggers_error "${FUNCTION_NAME}" "Missing mandatory parameter (AIAP_IMAGE_PUSH_URL)! You can add ir by adding flag --aiap-image-push-url ."
    _loggers_error "${FUNCTION_NAME}"
    exit 1
  fi

  if
    [ -z "${AIAP_IMAGE_PUSH_USERNAME}" ]
  then
    _loggers_error "${FUNCTION_NAME}"
    _loggers_error "${FUNCTION_NAME}" "Missing mandatory parameter (AIAP_IMAGE_PUSH_USERNAME)! You can add ir by adding flag --aiap-image-push-username ."
    _loggers_error "${FUNCTION_NAME}"
    exit 1
  fi

  if
    [ -z "${AIAP_IMAGE_PUSH_PASSWORD}" ]
  then
    _loggers_error "${FUNCTION_NAME}"
    _loggers_error "${FUNCTION_NAME}" "Missing mandatory parameter (AIAP_IMAGE_PUSH_PASSWORD)! You can add ir by adding flag --aiap-image-push-password ."
    _loggers_error "${FUNCTION_NAME}"
    exit 1
  fi


  echo "${AIAP_IMAGE_PUSH_PASSWORD}" | docker login --username 'robot$aiap' --password-stdin "${AIAP_IMAGE_PUSH_URL}"
  docker tag "${AIAP_APPLICATION_ID}":latest "${AIAP_IMAGE_PUSH_URL}/library/${AIAP_APPLICATION_ID}:latest"
  docker push "${AIAP_IMAGE_PUSH_URL}/library/${AIAP_APPLICATION_ID}:latest"

}
