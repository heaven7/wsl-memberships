Package.describe({
  name: 'heaven7:wsl-memberships',
  version: '0.0.1',
  summary: 'Memberships package',
  git: 'https://github.com/heaven7/wsl-memberships.git',
  documentation: 'README.md'
});

both = ['client','server'];
packages = [
    'heaven7:wsl-core@0.0.2',
    'heaven7:wsl-i18n@0.0.2'
];

Package.onUse(function(api) {
    api.use(packages, both);

    api.imply(packages);

    api.addFiles([
        'lib/both/memberships.js',
        'lib/both/schemas.js',
        'lib/both/router.js'
    ], both);

    api.addFiles([
        'lib/server/email/templates/send-request.handlebars',
        'lib/server/allow.js',
        'lib/server/methods.js',
        'lib/server/publish.js',
        'lib/server/utils.js'
    ], 'server');

    api.addFiles([
        'lib/client/hooks.js',
        'lib/client/templates.html',
        'lib/client/templates.js',
        'lib/client/helpers.js'
    ], 'client');

    api.export([
        'Memberships',
        'membershipsByDoc'
    ], both);
});
