import 'reflect-metadata';
import { ChatResolver } from '@/graphql/resolvers/chat';
import { ChatMessageDAO } from '@/mongodb/dao';
import { getAuthenticatedUser } from '@/utils';

jest.mock('@/mongodb/dao', () => ({
  ChatMessageDAO: {
    markConversationRead: jest.fn(),
    readConversation: jest.fn(),
    readConversations: jest.fn(),
    countUnreadTotal: jest.fn(),
  },
}));

jest.mock('@/utils', () => ({
  getAuthenticatedUser: jest.fn(),
}));

describe('ChatResolver', () => {
  let resolver: ChatResolver;

  const mockContext = {
    loaders: {
      user: {
        load: jest.fn(async (id: string) => ({ userId: id }) as any),
      },
    },
  };

  beforeEach(() => {
    resolver = new ChatResolver();
    jest.clearAllMocks();
    (getAuthenticatedUser as jest.Mock).mockReturnValue({ userId: 'user-1' });
  });

  it('resolves sender/recipient/conversationWithUser through user loader', async () => {
    await resolver.sender({ senderUserId: 'sender-1' } as any, mockContext as any);
    await resolver.recipient({ recipientUserId: 'recipient-1' } as any, mockContext as any);
    await resolver.conversationWithUser({ conversationWithUserId: 'other-1' } as any, mockContext as any);

    const load = (mockContext.loaders as any).user.load as jest.Mock;
    expect(load).toHaveBeenCalledWith('sender-1');
    expect(load).toHaveBeenCalledWith('recipient-1');
    expect(load).toHaveBeenCalledWith('other-1');
  });

  it('readChatMessages marks conversation read when markAsRead is true', async () => {
    const connection = { messages: [], hasMore: false, count: 0 };
    (ChatMessageDAO.markConversationRead as jest.Mock).mockResolvedValue(2);
    (ChatMessageDAO.readConversation as jest.Mock).mockResolvedValue(connection);

    const result = await resolver.readChatMessages('user-2', mockContext as any, 25, 'cursor-1', true);

    expect(ChatMessageDAO.markConversationRead).toHaveBeenCalledWith('user-1', 'user-2');
    expect(ChatMessageDAO.readConversation).toHaveBeenCalledWith('user-1', 'user-2', {
      limit: 25,
      cursor: 'cursor-1',
    });
    expect(result).toBe(connection);
  });

  it('readChatMessages skips markConversationRead when markAsRead is false', async () => {
    const connection = { messages: [], hasMore: false, count: 0 };
    (ChatMessageDAO.readConversation as jest.Mock).mockResolvedValue(connection);

    await resolver.readChatMessages('user-2', mockContext as any, 10, undefined, false);

    expect(ChatMessageDAO.markConversationRead).not.toHaveBeenCalled();
    expect(ChatMessageDAO.readConversation).toHaveBeenCalledWith('user-1', 'user-2', {
      limit: 10,
      cursor: undefined,
    });
  });

  it('readChatConversations delegates to DAO with authenticated user', async () => {
    const conversations = [{ conversationWithUserId: 'user-2' }];
    (ChatMessageDAO.readConversations as jest.Mock).mockResolvedValue(conversations);

    const result = await resolver.readChatConversations(mockContext as any, 15);

    expect(ChatMessageDAO.readConversations).toHaveBeenCalledWith('user-1', 15);
    expect(result).toBe(conversations);
  });

  it('unreadChatCount delegates to DAO with authenticated user', async () => {
    (ChatMessageDAO.countUnreadTotal as jest.Mock).mockResolvedValue(6);

    const result = await resolver.unreadChatCount(mockContext as any);

    expect(ChatMessageDAO.countUnreadTotal).toHaveBeenCalledWith('user-1');
    expect(result).toBe(6);
  });

  it('markChatConversationRead delegates to DAO with authenticated user', async () => {
    (ChatMessageDAO.markConversationRead as jest.Mock).mockResolvedValue(3);

    const result = await resolver.markChatConversationRead('user-2', mockContext as any);

    expect(ChatMessageDAO.markConversationRead).toHaveBeenCalledWith('user-1', 'user-2');
    expect(result).toBe(3);
  });
});
