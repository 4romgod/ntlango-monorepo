import * as Models from '@/mongodb/models';

describe('Models Index Exports', () => {
  it('should export Event model', () => {
    expect(Models.Event).toBeDefined();
  });

  it('should export User model', () => {
    expect(Models.User).toBeDefined();
  });

  it('should export EventCategory model', () => {
    expect(Models.EventCategory).toBeDefined();
  });

  it('should export EventParticipant model', () => {
    expect(Models.EventParticipant).toBeDefined();
  });

  it('should export ChatMessage model', () => {
    expect(Models.ChatMessage).toBeDefined();
  });

  it('should export WebSocketConnection model', () => {
    expect(Models.WebSocketConnection).toBeDefined();
  });
});
