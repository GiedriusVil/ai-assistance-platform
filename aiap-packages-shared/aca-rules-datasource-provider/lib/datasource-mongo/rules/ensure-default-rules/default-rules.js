const getDefaultRules = (organization, message) => {
  return [{
    'id': `default_rule_1_${organization.id}`,
    'actions': [
      'PA'
    ],
    'buyer': {
      'content': `${organization.name}`,
      'selected': true,
      'id': `${organization.id}`,
      'name': `${organization.name}`
    },
    'message': message,
    'conditions': [{
      'index': 0,
      'rootElement': 'client',
      'path': '$.address.country',
      'type': 'notIn',
      'valAsString': "['LTU']"
    }],
    'filters': [],
    'name': 'Client must be from Lithuania (default_rule_1)',
    'type': 'HEADER',
    'status': {
      'selectedMessageExists': true,
      'enabled': true
    }
  }, {
    'id': `default_rule_2_${organization.id}`,
    'actions': [
      'PA'
    ],
    'buyer': {
      'content': `${organization.name}`,
      'selected': true,
      'id': `${organization.id}`,
      'name': `${organization.name}`
    },
    'message': message,
    'conditions': [{
      'index': 0,
      'rootElement': 'totals',
      'path': '$.payable.value',
      'type': 'greaterThan',
      'valAsString': '100'
    }],
    'filters': [],
    'name': 'Total amount cannot exceed 100 EUR (default_rule_2)',
    'type': 'HEADER',
    'status': {
      'selectedMessageExists': true,
      'enabled': true
    }
  }, {
    'id': `default_rule_3_${organization.id}`,
    'actions': [
      'PA'
    ],
    'buyer': {
      'content': `${organization.name}`,
      'selected': true,
      'id': `${organization.id}`,
      'name': `${organization.name}`
    },
    'message': message,
    'conditions': [{
      'index': 0,
      'rootElement': 'item',
      'path': '$.price.money.value',
      'type': 'greaterThan',
      'valAsString': '10'
    }],
    'filters': [],
    'name': 'Single item amount cannot exceed 10 EUR (default_rule_3)',
    'type': 'ITEM',
    'status': {
      'selectedMessageExists': true,
      'enabled': true
    }
  }, {
    'id': `default_rule_4_${organization.id}`,
    'actions': [
      'PA'
    ],
    'buyer': {
      'content': `${organization.name}`,
      'selected': true,
      'id': `${organization.id}`,
      'name': `${organization.name}`
    },
    'message': message,
    'conditions': [{
      'index': 0,
      'rootElement': 'item',
      'path': '$.purchaseType',
      'type': 'in',
      'valAsString': "['Tradeshift.WrittenRequest', 'Tradeshift.BlanketPurchaseOrder', 'Tradeshift.Quote']"
    }],
    'filters': [],
    'name': 'Items from extension apps: WrittenRequest, BlanketPurchaseOrder and Quote should go to Procurement Assistant.',
    'type': 'ITEM',
    'status': {
      'selectedMessageExists': true,
      'enabled': true
    }
  }]
}

module.exports = {
  getDefaultRules,
}
