'use strict';
(function () {
  function _debugX(message, data) {
    console.log(`[ACA_WIDGET_BUTTON] [DEBUG] ${message}`, data);
  }
  function _errorX(message, data) {
    console.log(`[ACA_WIDGET_BUTTON] [ERROR] ${message}`, data);
  }

  function loadWbcChatAppButtonOptions() {
    // language
    let documentLanguage = document?.documentElement?.lang;
    if (documentLanguage.includes('-')) {
      const INDEX_OF_DASH = documentLanguage.indexOf('-');
      documentLanguage = documentLanguage.slice(0, INDEX_OF_DASH);
    }

    let chatAppHost;
    let scriptParams;
    let scriptEl;

    // [jg] TODO this is temp solution for getting script url - to be replaced once migration to wbc-chat-app-button is done
    const SCRIPTS_TEMP = document.getElementsByTagName('script');
    for (const script of SCRIPTS_TEMP) {
      const IS_GET_WIDGET_SCRIPT = script.src.includes('get-widget');
      if (IS_GET_WIDGET_SCRIPT) {
        scriptEl = script;
      }
    }
    if (scriptEl) {
      const SCRIPT_SRC_TMP = scriptEl.getAttribute('src');
      const SCRIPT_SRC_TMP_URL = new URL(SCRIPT_SRC_TMP);
      // chat-app host
      chatAppHost = SCRIPT_SRC_TMP_URL.origin;
      // script params
      scriptParams = Object.fromEntries(SCRIPT_SRC_TMP_URL.searchParams.entries());
      //
    } else {
      // [jg] TODO this part to be used once migration to wbc-chat-app-button is done
      scriptEl = document.getElementById('wbc-widget-button');
      const SCRIPT_SRC = scriptEl.getAttribute('src');
      const SCRIPT_SRC_URL = new URL(SCRIPT_SRC);
      //
      // chat-app host
      chatAppHost = SCRIPT_SRC_URL.origin;
      // script params
      scriptParams = Object.fromEntries(SCRIPT_SRC_URL.searchParams.entries());
    }

    const WBC_CHAT_APP_BUTTON_OPTIONS = {
      ...scriptParams,
      chatAppHost: chatAppHost,
      lang: documentLanguage,
    }

    _debugX('loadWbcChatAppButtonOptions', { WBC_CHAT_APP_BUTTON_OPTIONS });

    return WBC_CHAT_APP_BUTTON_OPTIONS;
  }

  function initialize() {
    var lpHead = document.head || document.getElementsByTagName('head')[0];
    var lpBody = document.body || document.getElementsByTagName('body')[0];
    _debugX('wbc-widget-button.js', { lpHead });
    _debugX('wbc-widget-button.js', { lpBody });
    // Add IBM Fonts
    var link = document.createElement('link');
    link.type = 'text/css';
    link.href = 'https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,400';
    link.rel = 'stylesheet';
    link.media = 'all';
    lpHead.appendChild(link);

    function loadAcaChatAppButtonScript(url, onLoad, onError) {
      _debugX('loadAcaChatAppButtonScript', { url, onLoad, onError });
      const ACA_WBC_BUTTON_OPTIONS_AS_STRING = JSON.stringify(WBC_CHAT_APP_BUTTON_OPTIONS);
      _debugX('loadAcaChatAppButtonScript', { ACA_WBC_BUTTON_OPTIONS_AS_STRING });
      window['aiapChatAppButtonOptions'] = ACA_WBC_BUTTON_OPTIONS_AS_STRING;
      const CHAT_APP_SCRIPT_ID = 'aca-chat-app-button-script';
      const CHAT_APP_SCRIPT_OLD = lpHead.querySelector(`#${CHAT_APP_SCRIPT_ID}`);
      _debugX('loadAcaChatAppButtonScript', { CHAT_APP_SCRIPT_OLD });
      if (
        CHAT_APP_SCRIPT_OLD
      ) {
        lpHead.removeChild(CHAT_APP_SCRIPT_OLD);
      }
      const ACA_CHAT_APP_SCRIPT = document.createElement('script');
      ACA_CHAT_APP_SCRIPT.id = CHAT_APP_SCRIPT_ID;
      ACA_CHAT_APP_SCRIPT.src = url + '/main.js';
      if (
        onLoad
      ) {
        ACA_CHAT_APP_SCRIPT.onload = () => {
          _debugX(`loadAcaChatAppButtonScript -> onLoad`, { lpHead, ACA_CHAT_APP_SCRIPT });
          onLoad();
        };
      }
      if (
        onError
      ) {
        ACA_CHAT_APP_SCRIPT.onError = onError;
      }
      _debugX(`loadAcaChatAppButtonScript -> lpHead.appendChild -> before`, { lpHead, ACA_CHAT_APP_SCRIPT });
      lpHead.appendChild(ACA_CHAT_APP_SCRIPT);
      _debugX(`loadAcaChatAppButtonScript -> lpHead.appendChild -> after`, { lpHead, ACA_CHAT_APP_SCRIPT });
    }

    function loadAcaChatAppButtonEl() {
      const WBC_CHAT_APP_BUTTON_EL_ID = 'aca-wbc-chat-app-button';
      const WBC_CHAT_APP_EL_TAG = 'aca-wbc-chat-app-button';
      const WBC_CHAT_APP_EL_OLD = lpBody.querySelector(`#${WBC_CHAT_APP_BUTTON_EL_ID}`);
      _debugX('loadAcaChatAppButtonEl', { WBC_CHAT_APP_EL_OLD });
      if (
        WBC_CHAT_APP_EL_OLD
      ) {
        lpBody.removeChild(WBC_CHAT_APP_EL_OLD);
      }
      const WBC_CHAT_APP_EL = document.createElement(WBC_CHAT_APP_EL_TAG);
      WBC_CHAT_APP_EL.id = WBC_CHAT_APP_BUTTON_EL_ID;
      WBC_CHAT_APP_EL.dataset.aiap_lp_host = window.top.location.host;
      WBC_CHAT_APP_EL.dataset.aiap_lp_path = window.top.location.pathname;
      WBC_CHAT_APP_EL.wbcChatAppButtonOptions = { ...WBC_CHAT_APP_BUTTON_OPTIONS };

      _debugX(`loadAcaChatAppButtonEl -> lpBody.appendChild -> before`, { lpBody, WBC_CHAT_APP_EL });
      lpBody.appendChild(WBC_CHAT_APP_EL);
      _debugX(`loadAcaChatAppButtonEl -> lpBody.appendChild -> after`, { lpBody, WBC_CHAT_APP_EL });
    }

    const WBC_CHAT_APP_BUTTON_PATH = '/wbc-chat-app-button';
    const WBC_CHAT_APP_BUTTON_BASE_URL = WBC_CHAT_APP_BUTTON_OPTIONS?.chatAppHost;
    const WBC_CHAT_APP_BUTTON_URL = WBC_CHAT_APP_BUTTON_BASE_URL + WBC_CHAT_APP_BUTTON_PATH;
    _debugX('initialize', { WBC_CHAT_APP_BUTTON_URL });
    if (WBC_CHAT_APP_BUTTON_BASE_URL) {
      loadAcaChatAppButtonScript(WBC_CHAT_APP_BUTTON_URL, loadAcaChatAppButtonEl, undefined);
    } else {
      _errorX('initialize -> Missing wbcChatAppButtonOptions.chatAppHost parameter!', { WBC_CHAT_APP_BUTTON_BASE_URL });
    }
  }

  if (!window?.aiap) {
    window.aiap = {};
  }
  window.aiap.broadcastChatAppOpenEvent = function () {
    const EVENT = {
      type: 'aiapChatAppOpen',
    };
    _debugX('[AIAP] broadcastChatAppOpenEvent', { EVENT });
    setTimeout(() => {
      window['postMessage'](EVENT, '*')
    }, 0);
  }
  window.aiap.setUserConsentToLocalStorage = (type, value) => {
    let user = JSON.parse(window.localStorage.getItem('aiap-user'));
    if (!user) {
      user = {};
    }
    const CONSENT = {};
    CONSENT[type] = value;
    user.consent = CONSENT;
    window.localStorage.setItem('aiap-user', JSON.stringify(user));
  }
  window.aiap.getUserConsentFromLocalStorage = () => {
    return JSON.parse(window.localStorage.getItem('aiap-user'));
  }
  const WBC_CHAT_APP_BUTTON_OPTIONS = loadWbcChatAppButtonOptions();
  let CHAT_APP_URL = WBC_CHAT_APP_BUTTON_OPTIONS?.chatAppHost;
  let time = 0;
  const INTERVAL_ID = setInterval(function () {
    time = time + 2000;
    CHAT_APP_URL = WBC_CHAT_APP_BUTTON_OPTIONS?.chatAppHost;
    if (CHAT_APP_URL) {
      clearInterval(INTERVAL_ID);
      setTimeout(initialize, 500);
    }
    if (time >= 10000) {
      clearInterval(INTERVAL_ID);
      _errorX('initialise -> Missing wbcChatAppButtonOptions.chatAppHost parameter!', { CHAT_APP_URL });
    }
  }, 1000)
})();
