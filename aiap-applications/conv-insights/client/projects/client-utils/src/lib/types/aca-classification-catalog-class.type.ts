/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as _ from 'lodash';
import { AcaClassificationCatalogCategory } from './aca-classification-catalog-category.type';
import { AcaLocalizedString } from 'client-shared-utils';

export class AcaClassificationCatalogClass implements AcaClassificationCatalogCategory {
  id: string;
  catalogId: string;
  segmentId: string;
  familyId: string;
  supplierName: string;
  title: AcaLocalizedString = new AcaLocalizedString();
  titleCanonical: AcaLocalizedString = new AcaLocalizedString();
  created: Date = new Date();
  createdBy: string = null;
  updated: Date = new Date();
  updatedBy: string = null;
  synonyms: AcaLocalizedString[] = [];

  public static of(arg: any): AcaClassificationCatalogClass {
    let instance = new AcaClassificationCatalogClass();
    if (arg != null) {
      instance.id = arg.id;
      instance.catalogId = arg.catalogId;
      instance.segmentId = arg.segmentId;
      instance.familyId = arg.familyId;
      instance.supplierName = arg.supplierName;
      instance.title = arg.title;
      instance.titleCanonical = arg.titleCanonical;
      instance.created = arg.created;
      instance.createdBy = arg.createdBy;
      instance.updated = arg.updated;
      instance.updatedBy = arg.updatedBy;
      instance.synonyms = _.cloneDeep(arg.synonyms);
    }

    return instance;
  }
}
