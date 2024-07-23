/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

export type Metadata = object | undefined;

export interface Item {
  text: string,
  note?: string,
  metadata: Metadata
}
export interface Dropdown {
  title: string,
  metadata: Metadata,
  items: [Item]
}
export interface Params {
  description: string,
  metadata: Metadata,
  dropdowns: [Dropdown]
};
