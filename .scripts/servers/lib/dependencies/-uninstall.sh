#!/bin/bash
# -------------------------------------------------------------------------------------
#
# PLACEHOLDER_COPYRIGHT
#
# PLACEHOLDER_LICENCE
#
# -------------------------------------------------------------------------------------

. ./.scripts/loggers/lib/--index-api.sh

. ./.scripts/node-modules/lib/-delete-many-by-query.sh

__remove_platform_application_aiap_packages_node_modules() {
    local FUNCTION_NAME="remove_platform_application_aiap_packages_node_modules"
    _loggers_debug "${FUNCTION_NAME}" "# remove_platform_applications_node_modules... "
    local APP_PATH=$1
    local APP_ACA_PACKAGES_PATH="${APP_PATH}aiap-packages/*/"
    for APP_ACA_PACKAGE in $APP_ACA_PACKAGES_PATH; do
        _nodeModules_deleteManyByQuery ./$APP_ACA_PACKAGE
    done
}

__remove_custom_application_aiap_packages_node_modules() {
    local FUNCTION_NAME="__remove_custom_application_aiap_packages_node_modules"
    _loggers_debug "${FUNCTION_NAME}"
    local APP_PATH=$1
    local APP_ACA_PACKAGES_PATH="${APP_PATH}aiap-packages/*/"
    for APP_ACA_PACKAGE in $APP_ACA_PACKAGES_PATH; do
        _nodeModules_deleteManyByQuery ./$APP_ACA_PACKAGE
    done
}

__remove_platform_application_packages_node_modules() {
    local FUNCTION_NAME="__remove_platform_application_packages_node_modules"
    _loggers_debug "${FUNCTION_NAME}"
    local APP_PATH=$1
    local APP_PACKAGES_PATH="${APP_PATH}packages/*/"
    for APP_PACKAGE in $APP_PACKAGES_PATH; do
        _nodeModules_deleteManyByQuery ./$APP_PACKAGE
    done
}

__remove_custom_application_packages_node_modules() {
    local FUNCTION_NAME="__remove_custom_application_packages_node_modules"
    _loggers_debug "${FUNCTION_NAME}"
    local APP_PATH=$1
    local APP_PACKAGES_PATH="${APP_PATH}packages/*/"
    for APP_PACKAGE in $APP_PACKAGES_PATH; do
        _nodeModules_deleteManyByQuery ./$APP_PACKAGE
    done
}

__remove_platform_applications_node_modules() {
    local FUNCTION_NAME="__remove_platform_applications_node_modules"
    _loggers_debug "${FUNCTION_NAME}"
    local APPS_PATH="aiap-applications/*/"
    for app in $APPS_PATH; do
        __remove_platform_application_aiap_packages_node_modules $app
        __remove_platform_application_packages_node_modules $app
    done
}

__remove_custom_applications_node_modules() {
    local FUNCTION_NAME="__remove_custom_applications_node_modules"
    _loggers_debug "${FUNCTION_NAME}"
    local APPS_PATH="custom-applications/*/"
    for app in $APPS_PATH; do
        __remove_custom_application_aiap_packages_node_modules $app
        __remove_custom_application_packages_node_modules $app
    done
}

__remove_platform_packages_shared_node_modules() {
    local FUNCTION_NAME="__remove_platform_packages_shared_node_modules"
    _loggers_debug "${FUNCTION_NAME}" "${AIAP_PACKAGES_SHARED_DIR}"

    local TMP_DIR="${AIAP_PACKAGES_SHARED_DIR}/*/"

    for d in $TMP_DIR; do
        _nodeModules_deleteManyByQuery "${d}"
    done
}

__remove_platform_custom_packages_shared_node_modules() {
    local FUNCTION_NAME="__remove_platform_custom_packages_shared_node_modules"
    _loggers_debug "${FUNCTION_NAME}"
    local TMP_DIR="${AIAP_DIR_CUSTOM_PACKAGES_SHARED}/*/"
    for d in $TMP_DIR; do
        _nodeModules_deleteManyByQuery "${d}"
    done
}

__remove_platform_node_modules() {
    local FUNCTION_NAME="__remove_platform_node_modules"
    _loggers_debug "${FUNCTION_NAME}"
    rm -rf package-lock.json
    _loggers_debug "${FUNCTION_NAME}" "Removed -> package-lock.json"
    rm -rf yarn.lock
    _loggers_debug "${FUNCTION_NAME}" "Removed -> yarn.lock"
    _nodeModules_deleteManyByQuery ./
}

_servers_dependencies_uninstall() {
    local FUNCTION_NAME="_servers_dependencies_uninstall"

    _loggers_debug "${FUNCTION_NAME}" "AIAP_APPLICATION_ID: ${AIAP_APPLICATION_ID}"

    __remove_platform_node_modules
    __remove_platform_packages_shared_node_modules
    __remove_platform_applications_node_modules
    # __remove_custom_applications_node_modules
    # __remove_platform_custom_packages_shared_node_modules

}
