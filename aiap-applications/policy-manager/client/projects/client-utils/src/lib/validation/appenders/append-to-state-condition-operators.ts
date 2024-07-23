/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';

export function appendToStateConditionOperators(state: any, operators: any, value: any = undefined, setSelected = true) {
    const OPERATORS = [];
    if (
        !lodash.isEmpty(operators) &&
        lodash.isArray(operators)
    ) {
        for (let operator of operators) {
            let selection = lodash.cloneDeep(operator);
            if (
                selection?.value?.type
            ) {
                if (
                    setSelected && value?.type === selection?.value?.type
                ) {
                    selection.selected = true;
                    state.selected = selection;
                }
                OPERATORS.push(selection);
            }
        }
    }
    state.items = OPERATORS;
}