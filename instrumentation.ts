/* eslint-disable no-console */
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';

import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';

if (process.env.NEXT_RUNTIME === 'nodejs') {
  console.log("Instrumentation file loading...");

  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'cwa-assignment',
    }),

    /** 
     * 🔥 CRITICAL FIX:
     * This disables ALL OpenTelemetry exporters so
     * @grpc/* packages NEVER load.
     */
    traceExporter: undefined,
    metricReader: undefined,
    // @ts-expect-error - force disable logs exporter to avoid gRPC
    logRecordExporter: undefined,

    spanProcessor: new SimpleSpanProcessor(new ConsoleSpanExporter()),

    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
    ],

    /** 
     * 🔥 VERY IMPORTANT:
     * Prevent auto-detection of environment-based exporters.
     * Without this, SDK loads OTLP gRPC automatically.
     */
    autoDetectResources: false,
  });

  sdk.start();
  console.log("Instrumentation started successfully.");
}
