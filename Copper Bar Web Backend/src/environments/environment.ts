// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDY-DxUrz5aQ4tEfEiV0-g9O64VizjHtIU",
    authDomain: "guestlist-3fe81.firebaseapp.com",
    databaseURL: "https://guestlist-3fe81.firebaseio.com",
    projectId: "guestlist-3fe81",
    storageBucket: "guestlist-3fe81.appspot.com",
    messagingSenderId: "416472647983"
  }
}