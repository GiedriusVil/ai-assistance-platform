/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-event-stream-provider-event-stream';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import { IEventStreamConfigurationV1 } from '..';

abstract class EventStreamV1<E extends IEventStreamConfigurationV1> {

  configuration: E;
  id: string;
  type: string;
  hash: string;
  name: string;

  constructor(
    configuration: E,
  ) {
    try {
      this.configuration = configuration;
      this.id = configuration?.id;
      this.name = configuration?.name;
      this.hash = configuration?.hash;
      this.type = configuration?.type;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration });
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  abstract initialize(): Promise<void>;

  abstract subscribe(
    type: string,
    callback: (
      data: any,
      channel: any,
    ) => Promise<any>,
  ): Promise<any>;

  abstract publish(
    type: string,
    data: any,
  ): void;

}

export {
  EventStreamV1,
}
