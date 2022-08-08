import React from "react";
import ErrorFallback from "./components/errorFallback/ErrorFallback.js";
import * as Sentry from "@sentry/react";

export function withErrorBoundary(Component, errorBoundaryProps) {
  const Wrapped = (props) => {
    const fallback = <ErrorFallback />;
    return (
      <Sentry.ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </Sentry.ErrorBoundary>
    );
  };
  // Format for display in DevTools
  const name = Component.displayName || Component.name || "Unknown";
  Wrapped.displayName = `withErrorBoundary(${name})`;
  return Wrapped;
}
