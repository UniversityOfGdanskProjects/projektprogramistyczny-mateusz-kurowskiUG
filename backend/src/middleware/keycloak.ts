// file: middlewares/keycloak.js

import Keycloak from "keycloak-connect";
const config = {
  realm: process.env.KEYCLOAK_REALM,
  "auth-server-url": `${process.env.KEYCLOAK_URL}`,
  "ssl-required": "external",
  resource: process.env.KEYCLOAK_CLIENT,
  "bearer-only": true,
};
const keyCloak = new Keycloak({}, config);
export default keyCloak;
