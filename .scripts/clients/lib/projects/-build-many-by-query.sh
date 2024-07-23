#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_clients_projects_buildManyByQuery() {
  local FUNCTION_NAME="_clients_projects_buildManyByQuery"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"

  if
    [ "${AIAP_APPLICATION_CLIENT_PROJECTS_SKIP}" = true ]
  then
    _loggers_warn "${FUNCTION_NAME}" "Skipping..."
  else

    local CLIENT_PROJECTS_CLIENT_UTILS="client-utils"
    if
      [ ! -d "${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}/client/projects/${CLIENT_PROJECTS_CLIENT_UTILS}" ]
    then
      _loggers_warn "${FUNCTION_NAME}" "Skipping build of ${AIAP_APPLICATION_ID} client project ${CLIENT_PROJECTS_CLIENT_UTILS} - it does not exist!"
    else
      yarn run clients:projects:build-one-by-id \
        --aiap-application-id "${AIAP_APPLICATION_ID}" \
        --aiap-application-client-project-id "${CLIENT_PROJECTS_CLIENT_UTILS}"
    fi

    local CLIENT_PROJECT_CLIENTS_SHARED_SERVICES="client-services"
    if
      [ ! -d "${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}/client/projects/${CLIENT_PROJECT_CLIENTS_SHARED_SERVICES}" ]
    then
      _loggers_warn "${FUNCTION_NAME}" "Skipping build of ${AIAP_APPLICATION_ID} client project ${CLIENT_PROJECT_CLIENTS_SHARED_SERVICES} - it does not exist!"
    else
      yarn run clients:projects:build-one-by-id \
        --aiap-application-id "${AIAP_APPLICATION_ID}" \
        --aiap-application-client-project-id "${CLIENT_PROJECT_CLIENTS_SHARED_SERVICES}"
    fi

    local CLIENT_PROJECTS_CLIENT_COMPONENTS="client-components"
    if
      [ ! -d "${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}/client/projects/${CLIENT_PROJECTS_CLIENT_COMPONENTS}" ]
    then
      _loggers_warn "${FUNCTION_NAME}" "Skipping build of ${AIAP_APPLICATION_ID} client project ${CLIENT_PROJECTS_CLIENT_COMPONENTS} - it does not exist!"
    else
      yarn run clients:projects:build-one-by-id \
        --aiap-application-id "${AIAP_APPLICATION_ID}" \
        --aiap-application-client-project-id "${CLIENT_PROJECTS_CLIENT_COMPONENTS}"
    fi

    local CLIENT_PROJECTS_CLIENT_VIEWS="client-views"
    if
      [ ! -d "${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}/client/projects/${CLIENT_PROJECTS_CLIENT_VIEWS}" ]
    then
      _loggers_warn "${FUNCTION_NAME}" "Skipping build of ${AIAP_APPLICATION_ID} client project ${CLIENT_PROJECTS_CLIENT_VIEWS} - it does not exist!"
    else
      yarn run clients:projects:build-one-by-id \
        --aiap-application-id "${AIAP_APPLICATION_ID}" \
        --aiap-application-client-project-id "${CLIENT_PROJECTS_CLIENT_VIEWS}"
    fi
  fi
}
