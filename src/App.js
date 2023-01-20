import React, { useEffect } from "react";
import { Routes, Route } from "react-router";

import { QueryClient, QueryClientProvider, setLogger } from "react-query";
import * as Sentry from "@sentry/react";
import { Integrations as TracingIntegrations } from "@sentry/tracing";
import useRoutingInstrumentation from "react-router-v6-instrumentation";
import { Settings as DTSettings } from "luxon";

import config from "./config";
import Layout from "./components/Layout/Layout.js";
import ErrorFallbackPage from "./components/errorFallback/ErrorFallbackPage.js";
import "./styles/theme.scss";

// Set default timezone to UTC
DTSettings.defaultZone = "utc";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
});

// Sentry logger for react query
setLogger({
  error: (error) => {
    Sentry.captureException(error);
  },
});

function App() {
  const routingInstrumentation = useRoutingInstrumentation();

  useEffect(() => {
    const browserTracing = new TracingIntegrations.BrowserTracing({
      routingInstrumentation,
    });
    Sentry.init({
      dsn: config.sentryDSN,
      environment: config.environment,
      integrations: [browserTracing],
      tracesSampleRate: 0.01,
      ignoreErrors: [/^Request failed with status code 404$/],
    });
  }, [routingInstrumentation]);

  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallbackPage />}>
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <Routes>
          <Route path="/*" element={<Layout />} />
        </Routes>
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  );
}

export default App;
