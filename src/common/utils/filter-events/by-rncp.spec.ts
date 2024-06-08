import { byRncp } from './by-rncp.js';

describe.each<{
  event: Parameters<ReturnType<typeof byRncp>>[0];
  eventIsRncp: boolean;
}>([
  {
    event: {
      kind: 'conference',
    },
    eventIsRncp: true,
  },
  {
    event: {
      kind: 'extern',
    },
    eventIsRncp: false,
  },
  {
    event: {
      kind: 'association',
    },
    eventIsRncp: false,
  },
  {
    event: {
      kind: 'external',
    },
    eventIsRncp: true,
  },
  {
    event: {
      kind: 'foo',
    },
    eventIsRncp: true,
  },
  {
    event: {
      kind: 'bar123',
    },
    eventIsRncp: true,
  },
])('byRncp (%o)', ({ event, eventIsRncp }) => {
  describe('when we want all events (rncp === undefined)', () => {
    const rncp = undefined;

    it(`should return true`, () => {
      expect(byRncp(rncp)(event)).toBe(true);
    });
  });

  describe('when we want only RNCP events', () => {
    const rncp = true;

    it(`should return ${eventIsRncp}`, () => {
      expect(byRncp(rncp)(event)).toBe(eventIsRncp);
    });
  });

  describe("when we don't want any RNCP events", () => {
    const rncp = false;

    it(`should return ${!eventIsRncp}`, () => {
      expect(byRncp(rncp)(event)).toBe(!eventIsRncp);
    });
  });
});
