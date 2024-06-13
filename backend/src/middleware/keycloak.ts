// file: middlewares/keycloak.js

import Keycloak from "keycloak-connect";
import session from "express-session";
const memoryStore = new session.MemoryStore();

const config = {
  realm: process.env.KEYCLOAK_REALM,
  "auth-server-url": `${process.env.KEYCLOAK_URL}`,
  "ssl-required": "external",
  resource: process.env.KEYCLOAK_CLIENT,
  "bearer-only": true,
};
const keyCloak = new Keycloak({ store: memoryStore }, config);
export default keyCloak;
