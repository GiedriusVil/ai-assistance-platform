/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchAttributeByRegex,
  matchFieldBetween2Dates,
  matchRuleType,
  matchAttributeDocType,
  matchAttributeDocExtId,
  matchAttributeOrganizationId,
} = require('@ibm-aiap/aiap-utils-mongo');

const _matcher = (context, params) => {
  const FILTER = params?.filter;
  const FILTER_SEARCH = FILTER?.search;

  const RET_VAL = {
    $match: {
      $and: [
        matchAttributeOrganizationId(FILTER),
        matchAttributeDocExtId(FILTER),
        {
          actionId: {
            $exists: 1
          }
        },
        {
          $or: [
            matchFieldBetween2Dates('timestamp', FILTER),
            matchFieldBetween2Dates('created.date', FILTER),
          ]
        },
        matchRuleType(FILTER),
        matchAttributeDocType(FILTER),
        {
          $or: [
            matchAttributeByRegex('actionId', FILTER_SEARCH),
            matchAttributeByRegex('doc.id', FILTER_SEARCH),
            matchAttributeByRegex('ruleType', FILTER_SEARCH),
            matchAttributeByRegex('docNumber', FILTER_SEARCH),
          ]
        },
      ]
    },
  };
  return RET_VAL;
}

const aggregateQuery = (context, params) => {

  const RET_VAL = [
    _matcher(context, params),
  ];

  RET_VAL.push({
    $group: {
      _id: '$actionId',
      steps: {
        $push: '$$ROOT'
      },
      TSID: {
        $addToSet: '$docExtId'
      },
      context: {
        $addToSet: '$context'
      },
      country: {
        $addToSet: '$doc.tenant.country'
      },
      items1: {
        $addToSet: '$doc.document.items'
      },
      items2: {
        $addToSet: '$doc.items'
      },
      timestamp: {
        $min: '$created.date'
      }
    }
  });

  RET_VAL.push({
    $project: {
      _id: 1,
      context: 1,
      country: 1,
      steps: 1,
      timestamp: 1,
      TSID: 1,
      items: {
        $setUnion: ['$items1', '$items2'],
      },
    }
  });
  RET_VAL.push({
    $match: {
      'steps': {
        $size: 4
      }
    }
  });
  RET_VAL.push({ $unwind: '$TSID' });
  RET_VAL.push({ $unwind: '$context' });
  RET_VAL.push({ $unwind: '$country' });
  RET_VAL.push({ $unwind: '$items' });
  RET_VAL.push({
    $group: {
      _id: '$TSID',
      validations: {
        $addToSet: {
          actionId: '$_id',
          prId: '$TSID',
          country: '$country',
          timestamp: '$timestamp',
          organization: {
            extId: '$context.user.session.organization.external.id',
            name: '$context.user.session.organization.name',
          },
          steps: {
            $map: {
              input: '$steps',
              as: 'step',
              in: {
                action: '$$step.action',
                created: {
                  date: '$$step.created.date'
                },
                doc: {
                  headerValidationResults: '$$step.doc.headerValidationResults',
                  groupValidationResults: '$$step.doc.groupValidationResults',
                  itemValidationResults: '$$step.doc.itemValidationResults',
                },
              }
            }
          },
          items: {
            $map: {
              input: '$items',
              as: 'item',
              in: {
                id: '$$item.id',
                category: '$$item.category',
                categoryText: '$$item.categoryText',
                seller: {
                  name: '$$item.seller.name',
                  extId: '$$item.seller.extId',
                },
              }
            }
          }
        }
      }
    }
  });

  return RET_VAL;
}

const distinctQuery = (context, params) => {
  const RET_VAL = _matcher(context, params)['$match'];

  return RET_VAL;
}

module.exports = {
  aggregateQuery,
  distinctQuery,
}
