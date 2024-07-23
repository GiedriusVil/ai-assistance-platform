/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const STATUS = {
  OFFLINE: 'offline',
  ONLINE: 'online',
};

class BrainStatus {

  dependencies: Array<any>;

  constructor() {
    this.dependencies = [];
  }

  static get status() {
    return STATUS;
  }

  addDependency(
    params: {
      name: any,
      statusFn: any,
    },
  ) {
    this.dependencies.push(
      {
        name: params?.name,
        statusFn: params?.statusFn,
      }
    );
  }

  async status() {
    const downDeps = (deps) => ramda.filter(ramda.propEq('status', STATUS.OFFLINE))(deps);
    const hasDownDeps = (deps) => downDeps(deps).length > 0;
    const fetchDeps = async (deps) =>
      await Promise.all(
        deps.map(async dep => {
          const baseParams = {
            name: dep.name,
            timestamp: Date.now().toString(),
          };
          try {
            const status = await dep.statusFn();
            return {
              ...status,
              ...baseParams,
            };
          } catch (err) {
            return {
              status: STATUS.OFFLINE,
              ...baseParams,
            };
          }
        })
      );

    const deps = await fetchDeps(this.dependencies);

    const RET_VAL = {
      status: hasDownDeps(deps) ? STATUS.OFFLINE : STATUS.ONLINE,
      dependencies: deps,
    };
    return RET_VAL;
  }
}

export {
  BrainStatus,
}
