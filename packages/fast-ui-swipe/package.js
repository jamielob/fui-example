Package.describe({
  name: 'jamielob:fast-ui-swipe',
  version: '1.0.0',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');
  api.use('ecmascript');
  api.use(['templating'], 'client');
  api.use('aldeed:template-extension@3.4.3');
  api.use('jamielob:draggabilly@1.0.0');
  api.addFiles('fast-ui-swipe.css', 'client');
  api.addFiles('fast-ui-swipe.js', 'client');
});

