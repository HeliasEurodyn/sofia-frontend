// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  serverUrl: 'http://139.144.29.47:15502/api',
  serverOnProxyPath: '',
  keycloakLogin :  window['keycloak_login']
};
