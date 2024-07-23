/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

/**
 * Greet users with a greeting that reflects the time of day
 *
 * ```xml
 * <greet />
 * <greet tz='America/New_York' lang='es' />
 * ```
 *
 * Outputs based on the system language, or set attribute, default is english if none of these are found.
 * Timezone is based on the users timezone on bots that implement getUserInfo, the set attribute, default is UTC if noen of these are found.
 *
 * **English (en)**
 * * between 4 am and 12 pm say "Good morning"
 * * between 12 pm and 5pm  say "Good afternoon"
 * * between 5 pm and 4am  say "Good evening"
 *
 * **Spanish (es)**
 * * between 4 am and 12 pm say "Buenos dias"
 * * between 12 pm and 8pm  say "Buenas tardes"
 * * between 8 pm and 4am  say "Buenas noches"
 *
 * @param {String} tz Which timezone to use for the time-based greeting. Defaults to GMT. To see available options see https://day.js.org/docs/en/plugin/timezone
 * @param {String} lang Which language to use. Defaults to system locale setting
 * @module greet
 */

const { dayjs } = require('@ibm-aca/aca-wrapper-dayjs');
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const logger = require('@ibm-aca/aca-common-logger')('aca-botmaster-fulfill-actions-greet');

const DEFAULT_TIMEZONE = 'Europe/London';

const GREETINGS = {
  en: [
    { start: 4, end: 12, greetings: ['Good morning'] },
    { start: 12, end: 17, greetings: ['Good afternoon'] },
    { start: 17, end: 4, greetings: ['Good evening'] }
  ],
  es: [
    { start: 4, end: 12, greetings: ['Buenos dias'] },
    { start: 12, end: 20, greetings: ['Buenas tardes'] },
    { start: 20, end: 4, greetings: ['Buenas noches'] }
  ],
  nl: [
    { start: 4, end: 12, greetings: ['Goedemorgen'] },
    { start: 12, end: 18, greetings: ['Goedemiddag'] },
    { start: 18, end: 0, greetings: ['Goedenavond'] },
    { start: 0, end: 4, greetings: ['Goedenacht'] }
  ]
};


const controller = async (params) => {
  const TIMEZONE = await getTimezone(params);
  const HOUR = getHour(TIMEZONE);
  const GREETINGS = getGreetings(params);
  const GREETING = getGreetingFromHour(GREETINGS, HOUR);
  logger.debug(`${TIMEZONE} - hour ${HOUR} = ${GREETING}`);
  return GREETING;
};

const getImplementsTimezone = (params) => {
  return params?.bot?.implements?.userInfo?.timezone;
};

const getTimezone = async (params) => {
  try {
    const USER_ID = getUserId(params);
    const IMPLEMENTS_TIMEZONE = getImplementsTimezone(params);
    if (params?.attributes?.tz) {
      return params.attributes.tz;
    } 

    if (USER_ID && IMPLEMENTS_TIMEZONE) {
      const USER_INFO = await params?.bot?.getUserInfo(USER_ID);
      logger.debug(`got userinfo ${USER_INFO}`);
      return USER_INFO?.timezone || DEFAULT_TIMEZONE;
    }
      
    return DEFAULT_TIMEZONE;
  } catch (error) {
    logger.debug('Error getting user timezone from bot', error);
    return DEFAULT_TIMEZONE;
  }
};

const getUserId = (params) => {
  return params?.update?.sender?.id;
}; 

const getHour = (timezone) => dayjs().tz(timezone).hour();

const getGreetings = (params) => {
  const LANG = params.attributes.lang ? params.attributes.lang : process.env.LANG.split('_').shift();
  return GREETINGS[LANG] || GREETINGS['en'];
};

const getGreetingFromHour = (greetings, hour) => ramda.compose(
  randomGreeting,
  ramda.prop('greetings'),
  ramda.defaultTo({
    greetings: ['Hi', 'Ciao']
  }),
  findGreetings(greetings)
)(hour);

const findGreetings = (greetings) => (hour) => ramda.find(ramda.allPass([gteStart(hour), ltEnd(hour)]), greetings);
const gteStart = hour => greeting => {
  if (greeting.end - greeting.start > 0)
    return greeting.start <= hour;
  else
    return greeting.start - 24 <= hour;
};
const ltEnd = hour => greeting => {
  if (greeting.end - greeting.start > 0)
    return greeting.end > hour;
  else
    return greeting.end > hour - 24;
};

const randomGreeting = (greetings) => greetings[Math.floor(Math.random() * greetings.length)];

module.exports = {
  controller,
};
