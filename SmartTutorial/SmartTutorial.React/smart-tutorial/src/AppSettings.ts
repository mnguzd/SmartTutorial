const server =
  process.env.REACT_APP_ENV === "production"
    ? "httlps://backend.com"
    : process.env.REACT_APP_ENV === "staging"
    ? "https://staging-backend.com"
    : "https://localhost:44314";
    
export const webAPIUrl = `${server}/api`;
