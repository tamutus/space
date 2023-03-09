import { H3Event } from "h3";
import * as jose from "jose";

const runtimeConfig = useRuntimeConfig().public;

export const reqHasScope = async function (event: H3Event, scope: string) {
  const jwt: string | undefined = event.node.req.headers.authorization;
  if (jwt && jwt.slice(0, 7) === "Bearer ") {
    const JWKS = jose.createRemoteJWKSet(
      new URL(`https://${runtimeConfig.authDomain}/.well-known/jwks.json`)
    );
    const { payload, protectedHeader } = await jose.jwtVerify(
      jwt.slice(7),
      JWKS,
      {
        audience: runtimeConfig.authApiIdentifier,
        issuer: `https://${runtimeConfig.authDomain}/`,
      }
    );
    if (typeof payload.scope === "string" && payload.scope.includes(scope)) {
      return true;
    } else return false;
  }
  return false;
};
