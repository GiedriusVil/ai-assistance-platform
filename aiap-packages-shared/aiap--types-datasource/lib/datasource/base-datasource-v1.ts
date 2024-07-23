/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/*
 * This is an abstract class definition
 * with methods to be implemented by each actual
 * data store implementation
 */
const EventEmitter = require('events');

import {
  IDatasourceConfigurationV1,
} from '../configuration';

abstract class BaseDatasourceV1<EConfiguration extends IDatasourceConfigurationV1> extends EventEmitter {

  configuration: EConfiguration;

  id: string;
  name: string;
  hash: string;
  type: string;

  constructor(configuration: EConfiguration) {
    super();
    this.configuration = configuration;
    this.id = this.configuration?.id;
    this.name = this.configuration?.name;
    this.type = this.configuration?.type;
    this.hash = this.configuration?.hash;
  }

}

export {
  BaseDatasourceV1,
}
