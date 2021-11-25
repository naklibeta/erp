export const environment = {
  production: true,
  localApiUrl: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/assets/apis',
  //apiUrl: 'http://localhost/naklibeta-api/public/api',
  apiUrl: 'https://naklibeta.com/api/api',
  //apiUrl: 'https://jobbanko.com/api/api',
  localImageUrl: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/assets/img',
};