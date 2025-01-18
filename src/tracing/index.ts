import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { PrivacyFriendlyBatchSpanProcessor } from './classes/privacy-friendly-batch-span-processor.js';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import * as process from 'node:process';

const config = {
  serviceName: '42cal-api',
  collectorHost: process.env['TRACING_JAEGER_HTTP_COLLECTOR_HOST'],
  collectorBasicAuth: process.env['TRACING_JAEGER_HTTP_COLLECTOR_BASIC_AUTH'],
};

if (config.collectorHost === undefined) {
  throw new Error('unset `TRACING_JAEGER_HTTP_COLLECTOR_HOST` env variable');
}
if (config.collectorBasicAuth === undefined) {
  throw new Error('unset `TRACING_JAEGER_HTTP_COLLECTOR_BASIC_AUTH` env variable');
}

const jaegerCollectorOptions: ConstructorParameters<typeof OTLPTraceExporter>[0] = {
  url: `https://${config.collectorHost}/v1/traces`,
  headers: {
    'Proxy-Authorization': `Basic ${config.collectorBasicAuth}`,
  },
};
const jaegerExporter = new OTLPTraceExporter(jaegerCollectorOptions);
export const otelSDK = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: config.serviceName,
  }),
  spanProcessors: [
    new PrivacyFriendlyBatchSpanProcessor(jaegerExporter, {
      maxQueueSize: 100,
      maxExportBatchSize: 10,
      scheduledDelayMillis: 500,
      exportTimeoutMillis: 30000,
    }),
  ],
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation(), new NestInstrumentation()],
});
