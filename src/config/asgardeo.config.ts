export const asgardeoConfig = {
  signInRedirectURL: "http://localhost:8080",
  signOutRedirectURL: "http://localhost:8080",
  clientID: "PboRLJXwnrfYcrmw92mnWjH9RnUa", // Replace with your Asgardeo app client ID
  baseUrl: "https://api.asgardeo.io/t/vihanga3",
  scope: ["openid", "profile", "email", "phone", "internal_login"],
  storage: "sessionStorage", // or "localStorage" for persistent sessions across browser restarts
  enablePKCE: true,
  disableTrySignInSilently: false,
};
