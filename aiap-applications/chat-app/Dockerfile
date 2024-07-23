#
# © Copyright IBM Corporation 2022. All Rights Reserved.
#
# SPDX-License-Identifier: EPL-2.0
#
##################################################################
#  This section is dedicated to copy source files into Docker image!
##################################################################
FROM node:18-bullseye-slim as copy_src_files

RUN chown -R node:node /home/node
RUN mkdir -p /home/node/app 

WORKDIR /home/node/app
COPY --chown=node:node scripts scripts
COPY --chown=node:node .scripts .scripts
COPY --chown=node:node lerna.json lerna.json
COPY --chown=node:node package.json package.json
COPY --chown=node:node yarn.lock yarn.lock
COPY --chown=node:node tsconfig-base.json tsconfig-base.json
COPY --chown=node:node aiap-libs-shared aiap-libs-shared
COPY --chown=node:node aiap-packages-shared aiap-packages-shared
COPY --chown=node:node aiap-packages-shared-angular aiap-packages-shared-angular
COPY --chown=node:node aiap-applications/chat-app aiap-applications/chat-app

##################################################################
#  Section build_client
##################################################################
FROM copy_src_files as build_client

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install jq --yes

WORKDIR /home/node/app
COPY --from=copy_src_files --chown=node:node /home/node/app .
USER node
RUN NODE_ENV=development 

WORKDIR /home/node/app

RUN yarn run clients:dependencies:install-4-one-by-id --aiap-application-id chat-app
RUN yarn run aiap-packages-shared-angular:dependencies:install
RUN yarn run aiap-packages-shared-angular:projects:build-many-by-query --aiap-application-id chat-app 
RUN yarn run clients:projects:build-many-by-query --aiap-application-id chat-app
RUN yarn run clients:versions:build-many-by-query --aiap-application-id chat-app
RUN yarn run clients:build-one-by-id --aiap-application-id chat-app --aiap-environment production

RUN yarn run client-wbcs:dependencies:install-4-one-by-id --aiap-application-id chat-app 
RUN yarn run client-wbcs:wbcs:generate-angular-json-by-id --aiap-application-id chat-app
RUN yarn run client-wbcs:projects:build-many-by-query --aiap-application-id chat-app
RUN yarn run client-wbcs:wbcs:build-many-by-query --aiap-application-id chat-app --aiap-environment production

RUN yarn run widgets:dependencies:install --aiap-application-id chat-app
RUN yarn run widgets:build-one-by-id --aiap-application-id chat-app

##################################################################
#  Section build_server
##################################################################
FROM copy_src_files as build_server

USER root

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install jq --yes
RUN apt-get install --no-install-recommends --yes curl python build-essential

RUN yarn global add node-gyp@9.3.1


WORKDIR /home/node/app

COPY --from=copy_src_files --chown=node:node /home/node/app .
RUN yarn run servers:dependencies:install --aiap-application-id chat-app
RUN yarn run servers:build-one-by-id --aiap-application-id chat-app && yarn run servers:aiap-packages:remove:sources-4-one-by-id --aiap-application-id chat-app

RUN yarn run lerna clean --yes
RUN apt-get clean

##################################################################
#  Section build_runtime
##################################################################
FROM node:18-bullseye-slim as build_runtime

LABEL vendor IBM
LABEL version $BUILD_VERSION
LABEL maintainer ACA Team <aca.devops@lt.ibm.com>

ENV ENVIRONMENT_REFRESH 2022-02-02

ARG BUILD_VERSION=local
RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install jq --yes
RUN apt-get install --no-install-recommends --yes curl build-essential python python3-pip 

WORKDIR /home/node/app
COPY --from=build_server --chown=node:node /home/node/app .
COPY --from=build_client --chown=node:node /home/node/app/aiap-applications/chat-app/client/dist/client-widget ./aiap-applications/chat-app/client/dist/client-widget
COPY --from=build_client --chown=node:node /home/node/app/aiap-applications/chat-app/client/dist/client-v1 ./aiap-applications/chat-app/client/dist/client-v1
COPY --from=build_client --chown=node:node /home/node/app/aiap-applications/chat-app/client/dist/client-v2 ./aiap-applications/chat-app/client/dist/client-v2
COPY --from=build_client --chown=node:node /home/node/app/aiap-applications/chat-app/client-wbc/dist ./aiap-applications/chat-app/client-wbc/dist

RUN rm -rf ./node_modules/node-gyp/test

RUN apt-get clean
USER node

EXPOSE 3000

ENV START_COMMAND servers:start-one-by-id --aiap-environment production --aiap-application-id chat-app
ENV NODE_ENV production
CMD yarn run $START_COMMAND
