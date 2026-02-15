import type { ReadChatConversationsQuery, ReadChatMessagesQuery } from '@/data/graphql/types/graphql';

export type ChatConversation = ReadChatConversationsQuery['readChatConversations'][number];
export type ChatMessageConnection = ReadChatMessagesQuery['readChatMessages'];
export type ChatMessage = ChatMessageConnection['messages'][number];
