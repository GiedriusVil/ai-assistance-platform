/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-classification-catalog-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');
const nlp = require('compromise');

const LANGUAGE = 'en'; // TODO temp hardcoded
const SOURCE_TYPE = {
  CONVERSATION_INSIGHTS: 'CONVERSATION_INSIGHTS',
  SEMANTIC_SEARCH: 'SEMANTIC_SEARCH'
};
const NORMALIZE_CONFIG = {
  // remove hyphens, newlines, and force one space between words
  whitespace: false,
  // keep only first-word, and 'entity' titlecasing
  case: false,
  // remove commas, semicolons - but keep sentence-ending punctuation
  punctuation: true,
  // visually romanize/anglicize 'Björk' into 'Bjork'.
  unicode: true,
  // turn "isn't" to "is not"
  contractions: true,
  //remove periods from acronyms, like 'F.B.I.'
  acronyms: true,
  //---these ones don't run unless you want them to---
  //remove words inside brackets (like these)
  parentheses: true,
  // turn "Google's tax return" to "Google tax return"
  possessives: true,
  // turn "batmobiles" into "batmobile"
  plurals: true,
  // turn all verbs into Infinitive form - "I walked" → "I walk"
  verbs: false,
  //turn 'Vice Admiral John Smith' to 'John Smith'
  honorifics: false
};

const _retrieveNounsByTile = item => {
  const TEXT = ramda.pathOr('', ['title', LANGUAGE], item);
  const NOUNS = _sanitizeConversationInsightsNouns(TEXT);

  item.titleCanonical = {
    [LANGUAGE]: NOUNS
  };
};

const _createCanonicalFormByText = segments => {
  segments.forEach(segment => {
    _retrieveNounsByTile(segment);

    const FAMILIES = ramda.pathOr([], ['families'], segment);
    if (
      !lodash.isEmpty(FAMILIES) &&
      lodash.isArray(FAMILIES)
    ) {
      segment.families.forEach(family => {
        _retrieveNounsByTile(family);

        const CLASSES = ramda.pathOr([], ['classes'], family);
        if (
          !lodash.isEmpty(CLASSES) &&
          lodash.isArray(CLASSES)
        ) {
          family.classes.forEach(classItem => {
            _retrieveNounsByTile(classItem);

            const COMMODITIES = ramda.pathOr([], ['commodities'], classItem);
            if (
              !lodash.isEmpty(COMMODITIES) &&
              lodash.isArray(COMMODITIES)
            ) {
              classItem.commodities.forEach(commodity => {
                _retrieveNounsByTile(commodity);
              });
            }
          });
        }
      });
    }
  });
};

/**
 * Sanitize and get available nouns for English language only
 * canonization process:
 * -> get unique words
 * -> normalize(strip whitespace, punctuation)
 * -> get singular form of noun
 * -> to lower case
 * -> order alphabetically
 * -> normalize to remove additional spaces at start and end(used solve concatenation of two words after sorting)
 *
 * @param {*} text type of string
 */
const _sanitizeConversationInsightsNouns = text => {
  let nouns = '';

  if (text) {
    const DOC = nlp(` ${text} `);
    nouns = DOC.terms()
      .unique()
      .normalize(NORMALIZE_CONFIG)
      .nouns()
      .sort('alpha')
      .toLowerCase()
      .normalize({ whitespace: true })
      .out('text');
  }
  return nouns;
};

/**
 * Sanitize and get available nouns for English language only
 * canonization process:
 * -> get unique words
 * -> normalize(strip whitespace, punctuation)
 * @param {*} text type of string
 */
const _sanitizeSemanticSearchNouns = text => {
  let nouns = '';

  if (text) {
    const DOC = nlp(text);
    nouns = DOC.terms()
      .unique()
      .normalize(NORMALIZE_CONFIG)
      .nouns()
      .out('text');
  }
  return nouns;
};

const addCanonicalFormToSegments = segments => {
  logger.info('Add canonical form to each segment item');
  if (
    !lodash.isEmpty(segments) &&
    lodash.isArray(segments)
  ) {
    _createCanonicalFormByText(segments);
  }
};

const retrieveCanonicalFormByInput = params => {
  const INPUT = ramda.path(['input'], params);
  const SOURCE = ramda.path(['source'], params);
  let retVal = '';

  switch (SOURCE) {
    case SOURCE_TYPE.CONVERSATION_INSIGHTS:
      retVal = _sanitizeConversationInsightsNouns(INPUT);
      break;
    case SOURCE_TYPE.SEMANTIC_SEARCH:
      retVal = _sanitizeSemanticSearchNouns(INPUT);
      break;
    default:
      logger.warn('Source not found, retrieve default canonical form by input');
      retVal = _sanitizeConversationInsightsNouns(INPUT);
      break;
  }

  return retVal;
};

const parseIsoLangCode = language => {
  let retVal = '';

  switch (language) {
    case 'ENG':
      retVal = 'en';
      break;
    default:
      retVal = 'en';
      break;
  }

  return retVal;
};

module.exports = {
  addCanonicalFormToSegments,
  retrieveCanonicalFormByInput,
  parseIsoLangCode
};
