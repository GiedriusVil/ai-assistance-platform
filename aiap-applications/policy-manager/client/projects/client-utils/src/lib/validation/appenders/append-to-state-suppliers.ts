/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';

export function appendToStateSuppliers(state: any, suppliers: any, value: any = undefined, setSelected = true) {
    const SUPPLIERS = [];
    if (
        !lodash.isEmpty(suppliers) &&
        lodash.isArray(suppliers)
    ) {
        for (let supplier of suppliers) {
            let selection: any = {
                content: `${supplier.id} - ${supplier.name}`,
            }
            selection.value = lodash.cloneDeep(supplier);

            if (
              setSelected && value?.id === selection?.value?.id
            ) {
                selection.selected = true;
                state.selected = selection;
            }
            SUPPLIERS.push(selection);

        }
    }
    state.items = SUPPLIERS;
}