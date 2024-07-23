var acaJqueryPlugin = {
  sendTextMessage: (text) => {
    let message = {
      type: 'user',
      text: text
    };
    window.acaJqueryPluginReference.ngZone.run(() => {
      window.acaJqueryPluginReference.sendMessage(message);
    });
  },
  openNewTab: (url) => {
    let params = {
      url,
    };
    window.acaJqueryPluginReference.ngZone.run(() => {
      window.acaJqueryPluginReference.openNewTab(params);
    });
  }
}; 
