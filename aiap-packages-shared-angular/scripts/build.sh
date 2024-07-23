#!/bin/bash
#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#
. ./scripts/_utils.sh

echo "Build client-shared-carbon..."
ng build client-shared-carbon

echo "Build client-shared-utils..."
ng build client-shared-utils

echo "Build client-shared-services..."
ng build client-shared-services

echo "Build client-shared-components..."
ng build client-shared-components

echo "Build client-shared-views..."
ng build client-shared-views
