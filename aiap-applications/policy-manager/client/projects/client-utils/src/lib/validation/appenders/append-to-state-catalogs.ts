/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';

export function appendToStateCatalogs(state: any, catalogs: any, value: any = undefined, setSelected = true) {
    const CATALOGS = [];
    if (
        !lodash.isEmpty(catalogs) &&
        lodash.isArray(catalogs)
    ) {
        for (let catalog of catalogs) {
            let selection: any = {
              content: `${catalog?.name} - (${catalog?.supplier?.name})`,
            }
            selection.value = lodash.cloneDeep(catalog);

            if (
                setSelected && value?.id === selection?.value?.id
            ) {
                selection.selected = true;
                state.selected = selection;
            }
            CATALOGS.push(selection);

        }
    }
    state.items = CATALOGS;
}
