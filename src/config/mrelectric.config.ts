export const asgardeoConfig = {
  signInRedirectURL: "http://localhost:8081",
  signOutRedirectURL: "http://localhost:8081",
  clientID: "LEZQsBkm00ZdGrAscGyOosp3zfQa", // Replace with your Asgardeo app client ID
  baseUrl: "https://api.asgardeo.io/t/vihanga3",
  scope: ["openid", "profile", "email", "phone", "internal_login"],
  storage: "sessionStorage", // or "localStorage" for persistent sessions across browser restarts
  enablePKCE: true,
  disableTrySignInSilently: false, // Enable silent SSO check on page load
};
