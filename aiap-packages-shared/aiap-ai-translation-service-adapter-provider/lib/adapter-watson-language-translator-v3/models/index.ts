/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { createOne } from './create-one';
import { deleteOne } from './delete-one';
import { deleteMany } from './delete-many';
import { getMany } from './get-many';
import { getOne } from './get-one';

export const _models = {
  createOne,
  deleteOne,
  deleteMany,
  getMany,
  getOne,
};
