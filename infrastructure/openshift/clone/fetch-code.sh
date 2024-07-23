#!/bin/bash
# uncomment to debug the script
# set -x
# ------------------
# This script:
# - copies all cloned repo into archive dir
# - collects git metadata and store it in build.properties file
# ------------------
# copy the script below into your app code repo (e.g. ./bin/fetch-code.sh) and 'source' it from your pipeline job
#    source ./bin/fetch-code.sh
# ------------------
# Properties file:
#   buildprops: "build.properties"
# Requires ENV vars:
#   N/A
# Exports ENV vars:
#   N/A
# Updates build.properties file with:
#   GIT_URL
#   GIT_BRANCH
#   GIT_COMMIT
#   SOURCE_BUILD_NUMBER
echo "=========================================================="
echo "Git repo cloned at ${WORKING_DIR}, copying into ${ARCHIVE_DIR}"
mkdir -p $ARCHIVE_DIR
cp -R -n ./ $ARCHIVE_DIR/ || true

# Persist env variables into a properties file (build.properties) so that all pipeline stages consuming this
# build as input and configured with an environment properties file valued 'build.properties'
# will be able to reuse the env variables in their job shell scripts.
cp build.properties $ARCHIVE_DIR/ || :
echo "=========================================================="
echo "COPYING JOB VARIABLES into build.properties file"
echo "GIT_URL=${GIT_URL}" >> $ARCHIVE_DIR/build.properties
echo "GIT_BRANCH=${GIT_BRANCH}" >> $ARCHIVE_DIR/build.properties
echo "GIT_COMMIT=${GIT_COMMIT}" >> $ARCHIVE_DIR/build.properties
echo "SOURCE_BUILD_NUMBER=${BUILD_NUMBER}" >> $ARCHIVE_DIR/build.properties
cat $ARCHIVE_DIR/build.properties | grep -v -i password
