import {
  IAiTranslationModelV1,
  IAiTranslationServiceV1,
  IChangesV1
} from "@ibm-aiap/aiap--types-server";

export interface IAiTranslationServicesChangesV1 extends IChangesV1<IAiTranslationServiceV1> { }
export interface IAiTranslationModelsChangesV1 extends IChangesV1<IAiTranslationModelV1> { }
