#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#
export NODE_OPTIONS=--max_old_space_size=4096

ng version

echo "Build {{dashCase name}} application client..."
ng build --configuration production --output-hashing none --single-bundle true
