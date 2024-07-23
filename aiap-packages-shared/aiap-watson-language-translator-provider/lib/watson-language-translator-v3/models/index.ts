/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
import { listModels } from './list-models';
import { createModel } from './create-model';
import { deleteModel } from './delete-model';
import { getModel } from './get-model';

export const _models = {
  listModels,
  createModel,
  deleteModel,
  getModel,
};
