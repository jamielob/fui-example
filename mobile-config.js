App.info({
  id: 'com.fuiExample.app',
  name: 'Fast UI Example',
  description: 'Demo app for fast ui',
  version: '0.0.1'
});

//Remove splash screen spinner
App.setPreference('ShowSplashScreenSpinner', 'false');


//Status bar
App.setPreference('StatusBarOverlaysWebView', 'true');
App.setPreference('StatusBarStyle', 'lightcontent');
