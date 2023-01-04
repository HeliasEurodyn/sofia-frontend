export const environment = {
  production: true,
  serverUrl: window['backend_url'] || 'http://localhost:15602/api',
  serverOnProxyPath: window['backend_on_proxy_path'] || '',
  frontendUrl: 'https://onenet-ngsi-ld.eurodyn.com'
};
