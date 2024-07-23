window.acaWidgetAuthenticator = {
  __refreshToken: function() {
    if (window.acaWidget && typeof window.acaWidget.__iframeInitialize === 'function') {
      window.acaWidget.__iframeInitialize([]);
    }
  }
};
