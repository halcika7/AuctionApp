// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "http://localhost:4000/api",
  socketUrl: "http://localhost:4000",
  MESSAGE_INVALID_TOKEN: "Invalid token",
  MESSAGE_NO_TOKEN: "Token not provided",
  PRODUCT_NOT_FOUND: "Product not found !",
  LOGIN_TO_BID: "Please login in order to place bid!",
  NO_BID_OWN_PRODUCT: "You can't place bid on your own product",
  ACTIVATION_TOKEN_EXPIRED: "Activation token expired, please resend activation link.",
  VALID_FORM: "VALID",
  DEFAULT_SORTING: "Default Sorting"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
