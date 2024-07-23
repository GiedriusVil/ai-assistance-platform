/*
 © Copyright IBM Corporation 2022. All Rights Reserved 
  
 SPDX-License-Identifier: EPL-2.0
*/
const AIAP_EVENT_TYPE = {
  /**
   * Changes to rule set configuration.
   * Notifies policy platform engines to update.
   */
  RESET_ENGINES: 'reset_rule_engines',
  /**
 * Changes to rule set configuration.
 * Notifies policy platform engines to update.
 */
  RESET_RULES_ENGINE_V2: 'reset_rule_engine_v2',
  /**
   *
   */
  RESET_LAMBDA_MODULES: 'reset_lamda_modules',
  /**
   *
   */
  RESET_LAMBDA_MODULE: 'reset_lambda_module',
  /**
   *
   */
  DELETE_LAMBDA_MODULE: 'delete_lambda_module',
  /**
  *
  */
  SAVE_TENANT: 'save_tenant',
  /**
  *
  */
  DELETE_TENANT: 'delete_tenant',
  /**
  *
  */
  REQUEST_TEST_WORKER_STATUS: 'request_test_worker_status',
  /**
  *
  */
  TEST_WORKER_STATUS: 'test_worker_status',
  /**
  *
  */
  RESET_TEST_WORKER: 'reset_test_worker',
  /**
  *
  */
  DELETE_TEST_WORKER: 'delete_test_worker',
  /**
  *
  */
  RESET_JOBS_QUEUE: 'reset_jobs_queue',
  /**
  *
  */
  DELETE_JOBS_QUEUE: 'delete_jobs_queue',
  /**
  *
  */
  SAVE_ENGAGEMENT: 'save_engagement',
  /**
  *
  */
  DELETE_ENGAGEMENT: 'delete_engagement',
  /**
  *
  */
  SAVE_DATA_MASKING_CONFIGURATION: 'save_data_masking_configuration',
  /**
  *
  */
  DELETE_DATA_MASKING_CONFIGURATION: 'delete_data_masking_configuration',
  /**
  *
  */
  SAVE_LIVE_ANALYTICS_QUERY: 'save_live_analytics_query',
  /**
  *
  */
  DELETE_LIVE_ANALYTICS_QUERY: 'delete_live_analytics_query',
  /**
  *
  */
  SAVE_LIVE_ANALYTICS_FILTER: 'save_live_analytics_filter',
  /**
  *
  */
  DELETE_LIVE_ANALYTICS_FILTER: 'delete_live_analytics_filter',
}

export {
  AIAP_EVENT_TYPE,
}
