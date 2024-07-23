/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MOUDLE_ID = `aca-middleware-analytics-conversation-logger-ware`;
const logger = require('@ibm-aca/aca-common-logger')(MOUDLE_ID);

const moment = require('moment');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  AbstractLoggerWare,
} from '../abstract-logger-ware';

import { ISoeUpdateV1 } from '@ibm-aiap/aiap--types-soe';


const throwMissingAttributeThisStart = () => {
  const ERROR_MESSAGE = `Missing required this.start attribute!`;
  throwAcaError(MOUDLE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
}

export class AnalyticsConversationLoggerWare extends AbstractLoggerWare {

  start: any;
  profile: any;

  constructor(
    botStates,
    loggerName,
    middlewareTypes,
    configuration,
  ) {
    super(botStates, loggerName, middlewareTypes, configuration);
    this.start;
    this.profile;
  }

  setStartTime() {
    this.start = moment(new Date()).utc();
    return;
  }

  getStart() {
    try {
      let retVal;
      if (
        this.start
      ) {
        retVal = this.start.toDate();
      } else {
        throwMissingAttributeThisStart();
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MOUDLE_ID, error);
      logger.error(this.getStart.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  getEnd() {
    const RET_VAL = moment(new Date()).utc().toDate();
    return RET_VAL;
  }

  getDay() {
    try {
      let retVal;
      if (
        this.start
      ) {
        retVal = this.start.date();
      } else {
        throwMissingAttributeThisStart();
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MOUDLE_ID, error);
      logger.error(this.getDay.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  getDayOfWeek() {
    try {
      let retVal;
      if (
        this.start
      ) {
        retVal = this.start.isoWeekday();
      } else {
        throwMissingAttributeThisStart();
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MOUDLE_ID, error);
      logger.error(this.getDayOfWeek.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  getMonth() {
    try {
      let retVal;
      if (
        this.start
      ) {
        retVal = this.start.month() + 1;
      } else {
        throwMissingAttributeThisStart();
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MOUDLE_ID, error);
      logger.error(this.getMonth.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  getYear() {
    try {
      let retVal;
      if (
        this.start
      ) {
        retVal = this.start.year();
      } else {
        throwMissingAttributeThisStart();
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MOUDLE_ID, error);
      logger.error(this.getYear.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  setProfile(
    update: ISoeUpdateV1,
  ) {
    this.profile = update?.raw?.gAcaProps?.userProfile;
    return;
  }

  getChannel(update) {
    const RET_VAL = update?.channel?.id;
    return RET_VAL;
  }

  getChannelMeta(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.raw?.channelMeta;
    return RET_VAL;
  }

  getLanguage() {
    const RET_VAL = this.profile?.language;
    return RET_VAL;
  }

  getUserId(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.raw?.gAcaProps?.userProfile?.id;
    return RET_VAL;
  }

  getFirstName() {
    const RET_VAL = this.profile?.firstName;
    return RET_VAL;
  }

  getLastName() {
    const LAST_NAME = this.profile?.lastName;
    const SECOND_NAME = this.profile?.secondName;
    let retVal;
    if (
      LAST_NAME
    ) {
      retVal = LAST_NAME;
    } else if (
      SECOND_NAME
    ) {
      retVal = SECOND_NAME;
    }
    return retVal;
  }

  getFullName() {
    let retVal;

    const NAME_FIRST = this.profile?.firstName;
    const NAME_MIDDLE = this.profile?.middleName;
    const NAME_LAST = this.profile?.lastName;
    const NAME_SECOND = this.profile?.secondName;

    if (
      NAME_MIDDLE
    ) {
      retVal = `${NAME_FIRST} ${NAME_MIDDLE}`;
    } else {
      retVal = `${NAME_FIRST}`;
    }

    if (
      NAME_LAST
    ) {
      retVal = `${retVal} ${NAME_LAST}`;
    } else if (
      NAME_SECOND
    ) {
      retVal = `${retVal} ${NAME_SECOND}`;
    }
    return retVal;
  }

  getCountry() {
    let retVal;
    if (
      this.profile
    ) {
      retVal = this.profile?.address?.countryName;
    }
    return retVal;
  }

  getEmail() {
    let retVal;
    if (
      this.profile
    ) {
      retVal = this.profile?.email;
    }
    return retVal;
  }

  getClientSideWindowSize(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.raw?.clientSideInfo?.size;
    return RET_VAL;
  }

  getClientSideOS(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.raw?.clientSideInfo?.os;
    return RET_VAL;
  }

  getClientSideVersion(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.raw?.clientSideInfo?.version;
    return RET_VAL;
  }

  getClientSideSoftwareType(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.raw?.clientSideInfo?.type;
    return RET_VAL;
  }

  getClientSideHostname(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.raw?.clientSideInfo?.hostname;
    return RET_VAL;
  }

  getClientSideBrowserName(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.raw?.clientSideInfo?.name;
    return RET_VAL;
  }

  getClientSideBrowserLanguage(
    update: ISoeUpdateV1,
  ) {
    const RET_VAL = update?.raw?.clientSideInfo?.language;
    return RET_VAL;
  }

  hasUserInteraction(
    update: ISoeUpdateV1,
  ) {
    const MESSAGE = update?.raw?.message;

    const SOURCE = update?.source;
    let retVal = true;
    if (
      lodash.isEmpty(MESSAGE?.text) ||
      lodash.startsWith(MESSAGE?.text, '§§') ||
      SOURCE === 'SYSTEM'
    ) {
      retVal = false;
    }
    return retVal;
  }

  getCreated(
    existingUser: any,
  ) {
    let retVal;
    const CREATED = existingUser?.created;
    if (
      lodash.isNull(CREATED) &&
      this.start
    ) {
      retVal = this.start.toDate();
    }
    return retVal;
  }

  getLastVisitTimestamp() {
    let retVal;
    if (
      this.start
    ) {
      retVal = this.start.toDate();
    }
    return retVal;
  }

}

