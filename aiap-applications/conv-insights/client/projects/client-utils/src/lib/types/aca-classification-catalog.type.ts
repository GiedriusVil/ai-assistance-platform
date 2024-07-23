/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
export class AcaClassificationCatalog {
    id: string;
    title: string;
    created: Date;
    createdBy: string;
    updated: Date;
    updatedBy: string;


    public static of(arg:any):AcaClassificationCatalog {
        if (arg !== null && arg !== undefined) {
            let instance = new AcaClassificationCatalog();
            instance.id = arg.id;
            instance.title = arg.title;
            instance.created = arg.created;
            instance.createdBy = arg.createdBy;
            instance.updated = arg.updatedBy;
            instance.updatedBy = arg.updatedBy;
        }

        return null;
    };
}