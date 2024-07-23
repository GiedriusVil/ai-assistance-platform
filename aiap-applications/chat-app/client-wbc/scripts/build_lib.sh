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

buildWbcLib --wbc $1 --production $2
