import "server-only";

export function register() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Azure Monitor OTEL disabled in development mode.");
    return;
  }

  console.log(">>> Starting Azure Monitor OTEL (production)...");

  // Dynamic import to avoid bundling issues
  const { useAzureMonitor } = require("@azure/monitor-opentelemetry");
  
  useAzureMonitor({
    connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING!,
    samplingRatio: 1,
  });
}