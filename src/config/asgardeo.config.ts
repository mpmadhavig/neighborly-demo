export const asgardeoConfig = {
  signInRedirectURL: window.location.origin,
  signOutRedirectURL: window.location.origin,
  clientID: "YOUR_CLIENT_ID", // Replace with your Asgardeo app client ID
  baseUrl: "https://api.asgardeo.io/t/vihanga3",
  scope: ["openid", "profile", "email"],
};
