#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#
. ./scripts/_utils.sh

buildClientLib --lib 'client-shared-carbon'
buildClientLib --lib 'client-shared-utils'
buildClientLib --lib 'client-shared-services'
buildClientLib --lib 'client-shared-components'
buildClientLib --lib 'client-shared-views'

buildClientLib --lib 'client-utils'
buildClientLib --lib 'client-services' --configuration 'production'
buildClientLib --lib 'client-components'
buildClientLib --lib 'client-views'
