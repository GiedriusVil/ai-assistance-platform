#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#
echo "Build client..."
export NODE_OPTIONS=--max_old_space_size=4096
ng build --configuration production --aot --source-map true
