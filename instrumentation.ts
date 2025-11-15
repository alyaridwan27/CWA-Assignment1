import "server-only";
import { registerOTel } from "@vercel/otel";

export function register() {
  console.log(">>> instrumentation.ts: Starting Vercel OpenTelemetry...");
  registerOTel();
}
