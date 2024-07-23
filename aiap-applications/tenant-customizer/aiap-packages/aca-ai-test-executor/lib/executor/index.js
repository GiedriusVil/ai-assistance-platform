/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
/*
 * This is an abstract class definition
 * with methods to be implemented by each actual
 * data store implementation
 */
class AcaAiTestExecutor {

    constructor() {
        this.setReady();
    }

    get tests() {
        const RET_VAL = {
            executeOne: (context, params) => { },
        };
        return RET_VAL;
    }


    isReady() {
        return this._ready;
    }

    setReady = () => {
        this._ready = true;
    }

    setBusy = () => {
        this._ready = true;
    }

}

module.exports = {
    AcaAiTestExecutor
};
