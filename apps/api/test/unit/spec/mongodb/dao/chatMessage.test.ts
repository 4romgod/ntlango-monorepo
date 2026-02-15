import { GraphQLError } from 'graphql';
import { ChatMessageDAO } from '@/mongodb/dao';
import { ChatMessage as ChatMessageModel } from '@/mongodb/models';

jest.mock('@/mongodb/models', () => ({
  ChatMessage: {
    create: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    findOne: jest.fn(),
    aggregate: jest.fn(),
    updateMany: jest.fn(),
  },
}));

const createExecQuery = <T>(result: T) => ({
  exec: jest.fn().mockResolvedValue(result),
});

const createFindQuery = <T>(result: T) => ({
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(result),
});

const createFindOneQuery = <T>(result: T) => ({
  sort: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(result),
});

describe('ChatMessageDAO', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('buildConversationKey sorts and trims ids deterministically', () => {
    expect(ChatMessageDAO.buildConversationKey('  user-b  ', 'user-a')).toBe('user-a:user-b');
    expect(ChatMessageDAO.buildConversationKey('user-a', 'user-b')).toBe('user-a:user-b');
  });

  it('create persists conversationKey and marks self-message as read', async () => {
    const createdAt = new Date('2026-02-15T12:00:00.000Z');
    (ChatMessageModel.create as jest.Mock).mockResolvedValue({
      toObject: () => ({
        chatMessageId: 'msg-1',
        senderUserId: 'user-1',
        recipientUserId: 'user-1',
        message: 'hello',
        isRead: true,
        createdAt,
      }),
    });

    const result = await ChatMessageDAO.create({
      senderUserId: 'user-1',
      recipientUserId: 'user-1',
      message: 'hello',
    });

    expect(ChatMessageModel.create).toHaveBeenCalledWith({
      senderUserId: 'user-1',
      recipientUserId: 'user-1',
      conversationKey: 'user-1:user-1',
      message: 'hello',
      isRead: true,
    });
    expect(result.chatMessageId).toBe('msg-1');
    expect(result.isRead).toBe(true);
  });

  it('readConversation applies cursor + pagination and computes nextCursor', async () => {
    const m1Date = new Date('2026-02-15T11:59:00.000Z');
    const m2Date = new Date('2026-02-15T11:58:00.000Z');
    const m3Date = new Date('2026-02-15T11:57:00.000Z');

    const docs = [
      { toObject: () => ({ chatMessageId: 'm1', isRead: false }), createdAt: m1Date },
      { toObject: () => ({ chatMessageId: 'm2', isRead: false }), createdAt: m2Date },
      { toObject: () => ({ chatMessageId: 'm3', isRead: false }), createdAt: m3Date },
    ];

    const findQuery = createFindQuery(docs);
    (ChatMessageModel.find as jest.Mock).mockReturnValue(findQuery);

    const result = await ChatMessageDAO.readConversation('user-1', 'user-2', {
      limit: 2,
      cursor: '2026-02-15T12:00:00.000Z',
    });

    expect(ChatMessageModel.find).toHaveBeenCalledWith({
      conversationKey: 'user-1:user-2',
      createdAt: { $lt: new Date('2026-02-15T12:00:00.000Z') },
    });
    expect(findQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(findQuery.limit).toHaveBeenCalledWith(3);

    expect(result.messages).toHaveLength(2);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBe(m2Date.toISOString());
    expect(result.count).toBe(2);
  });

  it('readConversations maps aggregation rows to chat conversations', async () => {
    const updatedAt = new Date('2026-02-15T11:59:00.000Z');
    (ChatMessageModel.aggregate as jest.Mock).mockReturnValue(
      createExecQuery([
        {
          _id: 'user-2',
          unreadCount: 4,
          updatedAt,
          lastMessage: {
            chatMessageId: 'm1',
            senderUserId: 'user-2',
            recipientUserId: 'user-1',
            message: 'hello',
            isRead: false,
            createdAt: updatedAt,
          },
        },
      ]),
    );

    const result = await ChatMessageDAO.readConversations('user-1', 10);

    expect(ChatMessageModel.aggregate).toHaveBeenCalled();
    expect(result).toEqual([
      {
        conversationWithUserId: 'user-2',
        unreadCount: 4,
        updatedAt,
        lastMessage: {
          chatMessageId: 'm1',
          senderUserId: 'user-2',
          recipientUserId: 'user-1',
          message: 'hello',
          isRead: false,
          createdAt: updatedAt,
        },
      },
    ]);
  });

  it('markConversationRead updates unread incoming messages and returns modified count', async () => {
    (ChatMessageModel.updateMany as jest.Mock).mockReturnValue(createExecQuery({ modifiedCount: 5 }));

    const result = await ChatMessageDAO.markConversationRead('user-1', 'user-2');

    expect(ChatMessageModel.updateMany).toHaveBeenCalledWith(
      {
        senderUserId: 'user-2',
        recipientUserId: 'user-1',
        isRead: { $ne: true },
      },
      {
        $set: {
          isRead: true,
          readAt: expect.any(Date),
        },
      },
    );
    expect(result).toBe(5);
  });

  it('readLatestInConversation returns null when no message exists', async () => {
    (ChatMessageModel.findOne as jest.Mock).mockReturnValue(createFindOneQuery(null));

    const result = await ChatMessageDAO.readLatestInConversation('user-1', 'user-2');

    expect(result).toBeNull();
  });

  it('wraps unknown readConversation failures with KnownCommonError', async () => {
    const findQuery = {
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(new Error('db failed')),
    };
    (ChatMessageModel.find as jest.Mock).mockReturnValue(findQuery);

    await expect(ChatMessageDAO.readConversation('user-1', 'user-2')).rejects.toBeInstanceOf(GraphQLError);
  });
});
