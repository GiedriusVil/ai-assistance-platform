var acaJqueryPlugin = {
  openNewTab: (url) => {
    event.stopPropagation();
    let params = {
      url,
    };
    window.acaJqueryPluginReference.ngZone.run(() => {
      window.acaJqueryPluginReference.openNewTab(params);
    });
  }
}; 
