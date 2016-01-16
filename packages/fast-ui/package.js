Package.describe({
  name: 'jamielob:fast-ui',
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
  api.versionsFrom('1.2.1');
  api.use(['templating', 'session', 'jquery'], ['client']);
  api.use('kadira:flow-router@2.3.0', ['client', 'server']);
  api.use('arillo:flow-router-helpers@0.4.6', ['client', 'server']);

  api.addFiles('fast-ui.css', ['client']);
  api.addFiles('fast-ui.js', ['client']);

  api.addFiles('fast-ui-helpers.html', ['client']);
  api.addFiles('fast-ui-helpers.js', ['client']);

  api.addFiles('fast-ui-elements.html', ['client']);
  api.addFiles('fast-ui-elements.css', ['client']);
  api.addFiles('fast-ui-elements.js', ['client']);

  api.export("fui");
});

