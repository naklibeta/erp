// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  localApiUrl: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/assets/apis',
  //apiUrl: 'http://localhost/naklibeta-api/public/api',
  //apiUrl: 'http://34.84.233.160/api/api',
  apiUrl: 'https://jobbanko.com/api/api',
  localImageUrl: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/assets/img',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
