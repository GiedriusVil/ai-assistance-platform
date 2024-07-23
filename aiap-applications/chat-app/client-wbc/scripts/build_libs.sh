#!/bin/bash
#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#
. ./scripts/_utils.sh

echo "Build aca-shared-wbc-utils..."
ng build aca-shared-wbc-utils

echo "Build aca-shared-wbc-services..."
ng build aca-shared-wbc-services

echo "Build aca-shared-wbc-components..."
ng build aca-shared-wbc-components

buildWbcLib --wbc 'aca-wbc-chat-app-button' --production $production
buildWbcLib --wbc 'aca-wbc-message' --production $production
buildWbcLib --wbc 'aca-wbc-feedback-modal-contents' --production $production
buildWbcLib --wbc 'aca-wbc-feedback-modal-dropdown-contents' --production $production
buildWbcLib --wbc 'aca-wbc-accordion' --production $production
buildWbcLib --wbc 'aca-wbc-banner' --production $production
buildWbcLib --wbc 'aca-wbc-date-picker' --production $production
buildWbcLib --wbc 'aca-wbc-double-date-picker' --production $production
buildWbcLib --wbc 'aca-wbc-dropdown-options' --production $production
buildWbcLib --wbc 'aca-wbc-mult-response' --production $production
buildWbcLib --wbc 'aca-wbc-mult-response-v2' --production $production
buildWbcLib --wbc 'aca-wbc-multimedia-box' --production $production
buildWbcLib --wbc 'aca-wbc-order-status' --production $production
buildWbcLib --wbc 'aca-wbc-supplier-catalog' --production $production
buildWbcLib --wbc 'aca-wbc-table' --production $production
buildWbcLib --wbc 'aca-wbc-template' --production $production
