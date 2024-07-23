import { TemplateRef } from '@angular/core'

/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface BreadcrumbItem {
  content: string,
  current?: boolean,
  route?: [
    {
      outlets: {
        [key: string]: string[]
      }
    }
  ],
  template?: TemplateRef<any>,
  path?: string;
}
