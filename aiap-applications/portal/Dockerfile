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

RUN apt-get update && apt-get install -y git

ARG GIT_REPO_URL_DOCS_BOOK
RUN if [ ! -z "$GIT_REPO_URL_DOCS_BOOK" ]; then git clone $GIT_REPO_URL_DOCS_BOOK; fi

# Adding a non-cachable step to force Docker to re-run these commands
RUN echo "Non-cachable step to force cache bust" && echo "Listing all files:" && find /home/node/app
RUN echo "Non-cachable step to force cache bust" && echo "Listing files in the working directory:" && ls -R /home/node/app

RUN echo "Listing files in the root directory:" && ls -R /


COPY --chown=node:node scripts scripts
COPY --chown=node:node .scripts .scripts
COPY --chown=node:node lerna.json lerna.json
COPY --chown=node:node package.json package.json
COPY --chown=node:node yarn.lock yarn.lock
COPY --chown=node:node tsconfig-base.json tsconfig-base.json
COPY --chown=node:node aiap-libs-shared aiap-libs-shared
COPY --chown=node:node aiap-client-assets aiap-client-assets
COPY --chown=node:node aiap-packages-shared aiap-packages-shared
COPY --chown=node:node aiap-packages-shared-angular aiap-packages-shared-angular
COPY --chown=node:node client/src/app/components/portal-header-v1 client/src/app/components/portal-header-v1

##################################################################
#  Section build_client
##################################################################
FROM copy_src_files as build_client

RUN yarn global add @angular/cli

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install jq --yes

WORKDIR /home/node/app
COPY --from=copy_src_files --chown=node:node /home/node/app .

USER node
RUN NODE_ENV=development

WORKDIR /home/node/app
RUN yarn run clients:dependencies:install-4-one-by-id --aiap-application-id portal
RUN yarn run aiap-packages-shared-angular:dependencies:install
RUN yarn run aiap-packages-shared-angular:projects:build-many-by-query --aiap-application-id portal
RUN yarn run clients:projects:build-many-by-query --aiap-application-id portal
RUN yarn run clients:build-one-by-id --aiap-application-id portal --aiap-environment production

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
RUN yarn run servers:dependencies:install --aiap-application-id portal
RUN yarn run servers:build-one-by-id --aiap-application-id portal && yarn run servers:aiap-packages:remove:sources-4-one-by-id --aiap-application-id portal

RUN yarn run lerna clean --yes
RUN apt-get clean

# ##################################################################
# #  Section build_runtime
# ##################################################################
FROM node:18-bullseye-slim as build_runtime

LABEL vendor IBM
LABEL version $BUILD_VERSION
LABEL maintainer ACA Team <aca.devops@lt.ibm.com>

ENV ENVIRONMENT_REFRESH 2022-02-02

ARG BUILD_VERSION=local
RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install jq --yes
RUN apt-get install --no-install-recommends --yes curl build-essential

WORKDIR /home/node/app
COPY --from=build_server --chown=node:node /home/node/app .
COPY --from=build_client --chown=node:node /home/node/app/aiap-applications/portal/client/dist ./aiap-applications/portal/client/dist
# COPY --from=build_client --chown=node:node /home/node/app/docs-book/docs/ ./aiap-applications/portal/client/dist/client/docs/

RUN rm -rf ./node_modules/node-gyp/test

RUN apt-get clean
USER node

EXPOSE 3005
ENV START_COMMAND servers:start-one-by-id --aiap-environment production --aiap-application-id portal
ENV NODE_ENV production
CMD yarn run $START_COMMAND
