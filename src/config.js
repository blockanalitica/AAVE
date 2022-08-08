const apiEndpoint =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_ENDPOINT
    : "localhost:8000";

const hostApi =
  process.env.NODE_ENV === "production"
    ? "https://" + apiEndpoint
    : "http://" + apiEndpoint;

const baseURLApi = hostApi;

const sentryDSN = process.env.REACT_APP_SENTRY_DSN || null;

const environment = process.env.REACT_APP_ENVIRONMENT || "js";

const obj = { baseURLApi, apiEndpoint, sentryDSN, environment };

export default obj;
