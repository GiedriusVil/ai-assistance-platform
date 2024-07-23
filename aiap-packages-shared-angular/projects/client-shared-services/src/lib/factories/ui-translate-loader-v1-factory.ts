/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { UITranslateLoaderV1 } from '../loaders/ui-translate-loader-v1';

let instance: UITranslateLoaderV1;

export function UITranslateLoaderFactoryV1(
  localStorageService: any
) {
  if (
    !instance
  ) {
    instance = new UITranslateLoaderV1(localStorageService);
  }
  return instance;
}
