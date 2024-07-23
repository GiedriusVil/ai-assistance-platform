#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_images_dockerBuildOneById(){
  local FUNCTION_NAME="_images_dockerBuildOneById"

  if
    [ -z "${AIAP_IMAGE_BUILD_FILE_PATH}" ]
  then
    _loggers_error "${FUNCTION_NAME}"
    _loggers_error "${FUNCTION_NAME}" "Missing mandatory paramter (AIAP_IMAGE_BUILD_FILE_PATH)! You can add ir by adding flag --aiap-image-build-file-path ."
    _loggers_error "${FUNCTION_NAME}"
    exit 1
  fi

  if
    [ -z "${AIAP_APPLICATION_ID}" ]
  then
    _loggers_error "${FUNCTION_NAME}"
    _loggers_error "${FUNCTION_NAME}" "Missing mandatory paramter (AIAP_APPLICATION_ID)! You can add ir by adding flag --aiap-application-id ."
    _loggers_error "${FUNCTION_NAME}"
    exit 1
  fi

  _loggers_debug "${FUNCTION_NAME}" "AIAP_IMAGE_BUILD_FILE_PATH: ${AIAP_IMAGE_BUILD_FILE_PATH}"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"

  docker build -f ${AIAP_IMAGE_BUILD_FILE_PATH} -t ${AIAP_APPLICATION_ID} .
}
