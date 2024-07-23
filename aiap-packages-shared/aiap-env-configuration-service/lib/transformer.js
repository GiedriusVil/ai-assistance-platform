/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const build = () => process.env.BUILD || 'local';

const isLocal = () => build() === 'local';
const environment = () => {
  if (isLocal()) return 'local';
  if (!process.env.ENV) throw new Error('ENV environment variable is not defined.');
  return process.env.ENV;
};

const space = () => {
  if (isLocal()) return 'local';
  if (!process.env.SPACE) throw new Error('SPACE environment variable is not defined.');
  return process.env.SPACE;
};

const namespace = () => {
  if (isLocal()) return 'local';
  return `${space()}-${environment()}-${build()}`;
};


const transform = (params) => {
  const RET_VAL = {
    build,
    environment,
    space,
    namespace,
    isLocal
  }
  return RET_VAL;
}

module.exports = {
  transform
}
