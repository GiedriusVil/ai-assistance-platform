#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_images_localBuildOneById() {
  local FUNCTION_NAME="_images_localBuildOneById"

  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"

  podman build \
    --progress=plain \
    --build-arg BUILD_VERSION="1" \
    -f ./aiap-applications/${AIAP_APPLICATION_ID}/Dockerfile \
    ./
}
