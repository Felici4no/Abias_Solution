const DEVELOPMENT_TOKEN = "dev-token";

export function authorizeRequest(request) {
  const expectedToken = process.env.API_AUTH_TOKEN ?? DEVELOPMENT_TOKEN;
  const authorization = request.headers.authorization ?? "";
  const [scheme, token] = authorization.split(" ");

  return scheme === "Bearer" && token === expectedToken;
}

export function getAuthInstructions() {
  return {
    scheme: "Bearer",
    developmentToken: DEVELOPMENT_TOKEN,
    header: `Authorization: Bearer ${DEVELOPMENT_TOKEN}`
  };
}
