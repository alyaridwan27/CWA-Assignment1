// This file is NOT bundled by Next.js
module.exports = function setupAzureMonitor(connectionString) {
  const { useAzureMonitor } = require("@azure/monitor-opentelemetry");
  useAzureMonitor({
    connectionString,
    samplingRatio: 1,
  });
};
