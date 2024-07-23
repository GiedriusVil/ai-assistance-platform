/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';

export function appendToStateConditionFacts(state: any, facts: any, value: any = undefined, setSelected = true) {
    const RET_VAL = [];
    if (
        !lodash.isEmpty(facts) &&
        lodash.isArray(facts)
    ) {
        for (let fact of facts) {
            let selection = lodash.cloneDeep(fact);
            if (
                selection?.value?.path
            ) {
                if (
                  setSelected && value?.path === selection?.value?.path
                ) {
                    selection.selected = true;
                    state.selected = selection;
                }
                RET_VAL.push(selection);
            }
        }
    }
    state.items = RET_VAL;
}