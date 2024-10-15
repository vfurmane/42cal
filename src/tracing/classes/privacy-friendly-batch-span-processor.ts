import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';

export class PrivacyFriendlyBatchSpanProcessor extends BatchSpanProcessor {
  private readonly filteredOutKeys = ['net.host.ip', 'net.peer.ip', 'http.client_ip'];

  anonymizeIpAddress(ip: string) {
    const lastPointIndex = ip.lastIndexOf('.');
    const lastColonIndex = ip.lastIndexOf(':');
    const isPossiblyIpV4 = lastPointIndex >= 0;
    const isPossiblyIpV6 = lastColonIndex >= 0;

    if (isPossiblyIpV4 && isPossiblyIpV6) {
      const base = ip.slice(0, lastPointIndex + 1);
      return base + '###';
    } else if (isPossiblyIpV4) {
      const base = ip.slice(0, lastPointIndex + 1);
      return base + '###';
    } else if (isPossiblyIpV6) {
      const base = ip.slice(0, lastColonIndex + 1);
      return base + '####';
    }
  }

  onEnd(span: any) {
    const filteredOutSpan = span;
    filteredOutSpan.attributes = Object.fromEntries(
      Object.entries(span.attributes).map(([key, value]) => [
        key,
        this.filteredOutKeys.includes(key) && typeof value === 'string' ? this.anonymizeIpAddress(value) : value,
      ]),
    );
    super.onEnd(filteredOutSpan);
  }
}
