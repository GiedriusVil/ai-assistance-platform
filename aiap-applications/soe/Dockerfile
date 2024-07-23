#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#

##################################################################
#  This section is dedicated to copy source files into Docker image!
##################################################################
FROM node:18-bullseye-slim as copy_src_files

LABEL vendor IBM
LABEL version $BUILD_VERSION
LABEL maintainer ACA Team <aca.devops@lt.ibm.com>

ENV ENVIRONMENT_REFRESH 2022-02-02

RUN chown -R node:node /home/node
RUN mkdir -p /home/node/app 

RUN mkdir -p /home/node/app/node_modules
RUN chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node scripts scripts
COPY --chown=node:node .scripts .scripts
COPY --chown=node:node lerna.json lerna.json
COPY --chown=node:node package.json package.json
COPY --chown=node:node yarn.lock yarn.lock
COPY --chown=node:node tsconfig-base.json tsconfig-base.json
COPY --chown=node:node aiap-packages-shared aiap-packages-shared
COPY --chown=node:node aiap-applications/soe aiap-applications/soe

##################################################################
#  Section build_server
##################################################################
FROM copy_src_files as build_server

USER root

RUN apt-get update -y
RUN apt-get install jq --yes
RUN DEBIAN_FRONTEND="noninteractive" apt-get install --no-install-recommends --yes libxml2 python3 make gcc g++

RUN yarn global add node-gyp@9.3.1


WORKDIR /home/node/app

COPY --from=copy_src_files --chown=node:node /home/node/app .
RUN yarn run servers:dependencies:install --aiap-application-id soe
RUN yarn run servers:build-one-by-id --aiap-application-id soe
RUN yarn run servers:aiap-packages:remove:sources-4-one-by-id --aiap-application-id soe

RUN yarn run lerna clean --yes
RUN apt-get clean

# ##################################################################
# #  Section build_runtime
# ##################################################################
FROM node:18-bullseye-slim as build_runtime

LABEL vendor IBM
LABEL version $BUILD_VERSION
LABEL maintainer AIAP Community

ENV ENVIRONMENT_REFRESH 2022-10-14

ARG BUILD_VERSION=local
RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install jq --yes
RUN DEBIAN_FRONTEND="noninteractive" apt-get install --no-install-recommends --yes libxml2 python3 make gcc g++

WORKDIR /home/node/app
COPY --from=build_server --chown=node:node /home/node/app .

RUN rm -rf ./node_modules/node-gyp/test

ENV LD_LIBRARY_PATH ./node_modules/appmetrics

RUN apt-get clean

USER node

EXPOSE 3001
ENV START_COMMAND servers:start-one-by-id --aiap-environment production --aiap-application-id soe
ENV NODE_ENV production
CMD yarn run $START_COMMAND
