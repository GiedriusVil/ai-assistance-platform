/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import { AcaLocalizedString } from 'client-shared-utils';

export interface AcaClassificationCatalogCategory {
  id: string;
  supplierName: string;
  title: AcaLocalizedString;
  titleCanonical: AcaLocalizedString;
  created: Date;
  createdBy: string;
  updated: Date;
  updatedBy: string;
  synonyms: AcaLocalizedString[];
}
