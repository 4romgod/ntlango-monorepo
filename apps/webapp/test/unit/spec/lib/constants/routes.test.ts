import { ROUTES } from '@/lib/constants/routes';

describe('ROUTES constants', () => {
  it('builds account message path with username segment', () => {
    expect(ROUTES.ACCOUNT.MESSAGE_WITH_USERNAME('jayz')).toBe('/account/messages/jayz');
  });

  it('URL-encodes username in account message path', () => {
    expect(ROUTES.ACCOUNT.MESSAGE_WITH_USERNAME('john doe')).toBe('/account/messages/john%20doe');
  });

  it('does not use legacy query-string format for message route', () => {
    expect(ROUTES.ACCOUNT.MESSAGE_WITH_USERNAME('jayz')).not.toContain('?username=');
  });

  it('encodes reserved path characters in username segment', () => {
    expect(ROUTES.ACCOUNT.MESSAGE_WITH_USERNAME('john/doe?x=1')).toBe('/account/messages/john%2Fdoe%3Fx%3D1');
  });

  it('keeps account messages root route unchanged', () => {
    expect(ROUTES.ACCOUNT.MESSAGES).toBe('/account/messages');
  });
});
