#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

_clientWbcs_projects_buildManyByQuery() {
  local FUNCTION_NAME="_clientWbcs_projects_buildManyByQuery"
  _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"

  if
    [ "${AIAP_APPLICATION_CLIENT_WBC_PROJECTS_SKIP}" = true ]
  then
    _loggers_warn "${FUNCTION_NAME}" "Skipping..."
  else

    local CLIENT_WBC_PROJECTS_CLIENT_UTILS="client-utils"
    if
      [ ! -d "${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}/client-wbc/projects/${CLIENT_WBC_PROJECTS_CLIENT_UTILS}" ]
    then
      _loggers_warn "${FUNCTION_NAME}" "Skipping build of ${AIAP_APPLICATION_ID} client-wbc project ${CLIENT_WBC_PROJECTS_CLIENT_UTILS} - it does not exist!"
    else
      yarn run client-wbcs:projects:build-one-by-id \
        --aiap-application-id "${AIAP_APPLICATION_ID}" \
        --aiap-application-client-wbc-project-id "${CLIENT_WBC_PROJECTS_CLIENT_UTILS}"
    fi

    local CLIENT_WBC_PROJECT_CLIENTS_SERVICES="client-services"
    if
      [ ! -d "${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}/client-wbc/projects/${CLIENT_WBC_PROJECT_CLIENTS_SERVICES}" ]
    then
      _loggers_warn "${FUNCTION_NAME}" "Skipping build of ${AIAP_APPLICATION_ID} client-wbc project ${CLIENT_WBC_PROJECT_CLIENTS_SERVICES} - it does not exist!"
    else
      yarn run client-wbcs:projects:build-one-by-id \
        --aiap-application-id "${AIAP_APPLICATION_ID}" \
        --aiap-application-client-wbc-project-id "${CLIENT_WBC_PROJECT_CLIENTS_SERVICES}"
    fi

    local CLIENT_WBC_PROJECTS_CLIENT_COMPONENTS="client-components"
    if
      [ ! -d "${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}/client-wbc/projects/${CLIENT_WBC_PROJECTS_CLIENT_COMPONENTS}" ]
    then
      _loggers_warn "${FUNCTION_NAME}" "Skipping build of ${AIAP_APPLICATION_ID} client-wbc project ${CLIENT_WBC_PROJECTS_CLIENT_COMPONENTS} - it does not exist!"
    else
      yarn run client-wbcs:projects:build-one-by-id \
        --aiap-application-id "${AIAP_APPLICATION_ID}" \
        --aiap-application-client-wbc-project-id "${CLIENT_WBC_PROJECTS_CLIENT_COMPONENTS}"
    fi

    local CLIENT_WBC_PROJECTS_CLIENT_VIEWS="client-views"
    if
      [ ! -d "${LOCAL_HOME_DIR}/aiap-applications/${AIAP_APPLICATION_ID}/client-wbc/projects/${CLIENT_WBC_PROJECTS_CLIENT_VIEWS}" ]
    then
      _loggers_warn "${FUNCTION_NAME}" "Skipping build of ${AIAP_APPLICATION_ID} client-wbc project ${CLIENT_WBC_PROJECTS_CLIENT_VIEWS} - it does not exist!"
    else
      yarn run client-wbcs:projects:build-one-by-id \
        --aiap-application-id "${AIAP_APPLICATION_ID}" \
        --aiap-application-client-wbc-project-id "${CLIENT_WBC_PROJECTS_CLIENT_VIEWS}"
    fi

  fi
}
