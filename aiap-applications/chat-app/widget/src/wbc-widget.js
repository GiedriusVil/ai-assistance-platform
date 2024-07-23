'use strict';
(function () {
  function _debugX(message, data) {
    console.log(`[AIAP_WIDGET_WBC] [DEBUG] ${message}`, data);
  }
  function _errorX(message, data) {
    console.log(`[AIAP_WIDGET_WBC] [ERROR] ${message}`, data);
  }

  async function getChatAppVersion() {
    const WINDOW_ACA_WIDGET_OPTIONS = window.acaWidgetOptions;
    const ASSISTANT_ID = WINDOW_ACA_WIDGET_OPTIONS.assistantId;
    const ENGAGEMENT_ID = WINDOW_ACA_WIDGET_OPTIONS.engagementId;
    const TENANT_ID = WINDOW_ACA_WIDGET_OPTIONS.tenantId;
 
    let retVal = '0.2.0';
    try {
      const URL = `${WINDOW_ACA_WIDGET_OPTIONS.chatAppHost}/chat-app-version?tenantId=${TENANT_ID}&assistantId=${ASSISTANT_ID}&engagementId=${ENGAGEMENT_ID}`;
      const RESPONSE = await fetch(URL);
      const BODY = await RESPONSE.json();
      retVal = BODY.version;
    } catch (error) {
      _errorX('version')
    }

    return retVal;
  }

  async function initialise() {
    var lpHead = document.head || document.getElementsByTagName('head')[0];
    var lpBody = document.body || document.getElementsByTagName('body')[0];
    _debugX('wbc-widget.js', { lpHead });
    _debugX('wbc-widget.js', { lpBody });
    // Add IBM Fonts
    var link = document.createElement('link');
    link.type = 'text/css';
    link.href = 'https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,400';
    link.rel = 'stylesheet';
    link.media = 'all';
    lpHead.appendChild(link);


    const WINDOW_ACA_WIDGET_OPTIONS = window.acaWidgetOptions;
    _debugX('initialise', { WINDOW_ACA_WIDGET_OPTIONS });

    const CHAT_APP_VERSION = await getChatAppVersion();

    function loadAcaChatAppWBCScript(url, onLoad, onError) {
      _debugX('loadAcaChatAppWBCScript', { url, onLoad, onError });
      
      let chatAppScriptId;
      switch (CHAT_APP_VERSION) {
        case '0.2.0': chatAppScriptId = 'aca-chat-app-v2-script'; break;
        case '0.3.0': chatAppScriptId = 'aiap-chat-app-v3-script'; break;
      }

      const WINDOW_ACA_WIDGET_OPTIONS_AS_STR = JSON.stringify(WINDOW_ACA_WIDGET_OPTIONS);
      _debugX('loadAcaChatAppWBCScript', { WINDOW_ACA_WIDGET_OPTIONS_AS_STR });
      localStorage.setItem('aiap-widget-options-default', WINDOW_ACA_WIDGET_OPTIONS_AS_STR);
      const CHAT_APP_SCRIPT_OLD = lpHead.querySelector(`#${chatAppScriptId}`);
      _debugX('loadAcaChatAppWBCScript', { CHAT_APP_SCRIPT_OLD });
      if (
        CHAT_APP_SCRIPT_OLD
      ) {
        lpHead.removeChild(CHAT_APP_SCRIPT_OLD);
      }
      const CHAT_APP_SCRIPT = document.createElement('script');
      CHAT_APP_SCRIPT.id = chatAppScriptId;
      CHAT_APP_SCRIPT.src = url + '/en-US/main.js';
      if (
        onLoad
      ) {
        CHAT_APP_SCRIPT.onload = () => {
          _debugX(`loadAcaChatAppWBCScript -> onLoad`, { lpHead, CHAT_APP_SCRIPT });
          onLoad();
        };
      }
      if (
        onError
      ) {
        CHAT_APP_SCRIPT.onError = onError;
      }
      _debugX(`loadAcaChatAppWBCScript -> lpHead.appendChild -> before`, { lpHead, CHAT_APP_SCRIPT });
      lpHead.appendChild(CHAT_APP_SCRIPT);
      _debugX(`loadAcaChatAppWBCScript -> lpHead.appendChild -> after`, { lpHead, CHAT_APP_SCRIPT });
    }

    function loadAcaChatAppWBCEl() {

      let chatAppElementId;
      let chatAppElementTag;
      switch (CHAT_APP_VERSION) {
        case '0.2.0': chatAppElementId = 'aca-chat-app-v2'; chatAppElementTag = 'aca-chat-app'; break;
        case '0.3.0': chatAppElementId = 'aiap-chat-app-v3'; chatAppElementTag = 'chat-app-v3'; break;
      }
      
      const ACA_CHAT_APP_EL_OLD = lpBody.querySelector(`#${chatAppElementId}`);
      _debugX('loadAcaChatAppWBCEl', { ACA_CHAT_APP_EL_OLD });
      if (
        ACA_CHAT_APP_EL_OLD
      ) {
        lpBody.removeChild(ACA_CHAT_APP_EL_OLD);
      }
      const ACA_CHAT_APP_EL = document.createElement(chatAppElementTag);
      ACA_CHAT_APP_EL.id = chatAppElementId;
      ACA_CHAT_APP_EL.acaWidgetOptions = { ...WINDOW_ACA_WIDGET_OPTIONS };
      _debugX(`loadAcaChatAppWBCEl -> lpBody.appendChild -> before`, { lpBody, ACA_CHAT_APP_EL });
      lpBody.appendChild(ACA_CHAT_APP_EL);
      _debugX(`loadAcaChatAppWBCEl -> lpBody.appendChild -> after`, { lpBody, ACA_CHAT_APP_EL });
    }

    let chatAppWBCPath;
    switch (CHAT_APP_VERSION) {
      case '0.2.0': chatAppWBCPath = '/wbc-chat-app'; break;
      case '0.3.0': chatAppWBCPath = '/wbc-chat-app-v3'; break;
    }

    const ACA_CHAT_APP_WBC_BASE_URL = window?.acaWidgetOptions?.chatAppHost;
    const ACA_CHAT_APP_WBC_URL = ACA_CHAT_APP_WBC_BASE_URL + chatAppWBCPath;
    _debugX('initialise', { ACA_CHAT_APP_WBC_URL });
    if (ACA_CHAT_APP_WBC_BASE_URL) {
      loadAcaChatAppWBCScript(ACA_CHAT_APP_WBC_URL, loadAcaChatAppWBCEl, undefined);
    } else {
      _errorX('initialise -> Missing window.acaWidgetOptions.chatAppHost parameter!', { WINDOW_ACA_WIDGET_OPTIONS });
    }
  }

  const WINDOW_ACA_WIDGET_OPTIONS = window.acaWidgetOptions;
  let CHAT_APP_URL = window?.acaWidgetOptions?.chatAppHost;
  let time = 0;
  const INTERVAL_ID = setInterval(function(){
    time = time + 1000;
    CHAT_APP_URL = window?.acaWidgetOptions?.chatAppHost;
    if (CHAT_APP_URL) {
      clearInterval(INTERVAL_ID);
      setTimeout(initialise, 500);
    }
    if (time >= 10000) {
      clearInterval(INTERVAL_ID);
      _errorX('initialise -> Missing window.acaWidgetOptions.chatAppHost parameter!', { WINDOW_ACA_WIDGET_OPTIONS });
    }
  }, 1000)
})();
