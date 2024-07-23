#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#
. ./scripts/_utils.sh

echo "Build tenant-customizer application client..."
ng build --configuration production --output-hashing none --single-bundle true
