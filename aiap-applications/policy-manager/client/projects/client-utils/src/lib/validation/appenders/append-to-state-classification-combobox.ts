/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';

export function appendToStateClassificationCombobox(state: any, items: any, value: any = undefined, setSelected = true) {
    const ITEMS = [];
    if (
        !lodash.isEmpty(items) &&
        lodash.isArray(items)
    ) {
        for (let item of items) {
            let selection: any = {
                content: `${item.code} - ${item.title}`,
            }
            selection.value = lodash.cloneDeep(item);

            if (
              setSelected && value?.id === selection?.value?.id
            ) {
                selection.selected = true;
                state.selected = selection;
            }
            ITEMS.push(selection);

        }
    }
    state.items = ITEMS;
}