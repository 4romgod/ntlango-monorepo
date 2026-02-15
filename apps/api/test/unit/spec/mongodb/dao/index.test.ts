import * as DAO from '@/mongodb/dao';
import { ChatMessageDAO, EventCategoryDAO, EventDAO, UserDAO, WebSocketConnectionDAO } from '@/mongodb/dao';

describe('Index Exports', () => {
  it('should export EventDAO', () => {
    expect(DAO.EventDAO).toBeDefined();
    expect(new DAO.EventDAO()).toBeInstanceOf(EventDAO);
  });

  it('should export UserDAO', () => {
    expect(DAO.UserDAO).toBeDefined();
    expect(new DAO.UserDAO()).toBeInstanceOf(UserDAO);
  });

  it('should export EventCategoryDAO', () => {
    expect(DAO.EventCategoryDAO).toBeDefined();
    expect(new DAO.EventCategoryDAO()).toBeInstanceOf(EventCategoryDAO);
  });

  it('should export ChatMessageDAO', () => {
    expect(DAO.ChatMessageDAO).toBeDefined();
    expect(new DAO.ChatMessageDAO()).toBeInstanceOf(ChatMessageDAO);
  });

  it('should export WebSocketConnectionDAO', () => {
    expect(DAO.WebSocketConnectionDAO).toBeDefined();
    expect(new DAO.WebSocketConnectionDAO()).toBeInstanceOf(WebSocketConnectionDAO);
  });
});
