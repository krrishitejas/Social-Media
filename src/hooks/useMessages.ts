import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { messageService, SendMessageRequest, CreateConversationRequest } from '@services/messageService';
import { Message, Conversation, User } from '@types';

export const useMessages = () => {
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const queryClient = useQueryClient();

  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations,
  } = useQuery<{ conversations: Conversation[]; nextCursor?: string; hasMore: boolean }>(
    ['conversations', cursor],
    () => messageService.getConversations(cursor),
    {
      keepPreviousData: true,
    }
  );

  const sendMessageMutation = useMutation(
    (messageData: SendMessageRequest) => messageService.sendMessage(messageData),
    {
      onSuccess: (newMessage, variables) => {
        // Optimistically update the conversation
        queryClient.setQueryData(['conversations'], (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            conversations: oldData.conversations.map((conv: Conversation) => {
              if (conv.id === variables.conversationId) {
                return {
                  ...conv,
                  lastMessage: newMessage,
                  updatedAt: newMessage.createdAt,
                };
              }
              return conv;
            }),
          };
        });

        // Update messages for the specific conversation
        queryClient.setQueryData(['messages', variables.conversationId], (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            messages: [newMessage, ...oldData.messages],
          };
        });
      },
    }
  );

  const createConversationMutation = useMutation(
    (conversationData: CreateConversationRequest) => messageService.createConversation(conversationData),
    {
      onSuccess: (newConversation) => {
        // Add new conversation to the list
        queryClient.setQueryData(['conversations'], (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            conversations: [newConversation, ...oldData.conversations],
          };
        });
      },
    }
  );

  const markAsReadMutation = useMutation(
    ({ conversationId, messageId }: { conversationId: string; messageId: string }) =>
      messageService.markAsRead(conversationId, messageId),
    {
      onSuccess: (_, { conversationId }) => {
        // Update conversation read status
        queryClient.setQueryData(['conversations'], (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            conversations: oldData.conversations.map((conv: Conversation) => {
              if (conv.id === conversationId) {
                return {
                  ...conv,
                  unreadCount: 0,
                };
              }
              return conv;
            }),
          };
        });
      },
    }
  );

  const deleteMessageMutation = useMutation(
    (messageId: string) => messageService.deleteMessage(messageId),
    {
      onSuccess: (_, messageId) => {
        // Remove message from all conversations
        queryClient.setQueryData(['conversations'], (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            conversations: oldData.conversations.map((conv: Conversation) => {
              if (conv.lastMessage?.id === messageId) {
                return {
                  ...conv,
                  lastMessage: null,
                };
              }
              return conv;
            }),
          };
        });
      },
    }
  );

  const loadMoreConversations = useCallback(() => {
    if (conversationsData?.nextCursor && hasMore && !conversationsLoading) {
      setCursor(conversationsData.nextCursor);
    }
  }, [conversationsData?.nextCursor, hasMore, conversationsLoading]);

  const refresh = useCallback(() => {
    setCursor(undefined);
    setHasMore(true);
    refetchConversations();
  }, [refetchConversations]);

  const sendMessage = useCallback((messageData: SendMessageRequest) => {
    sendMessageMutation.mutate(messageData);
  }, [sendMessageMutation]);

  const createConversation = useCallback((conversationData: CreateConversationRequest) => {
    createConversationMutation.mutate(conversationData);
  }, [createConversationMutation]);

  const markAsRead = useCallback((conversationId: string, messageId: string) => {
    markAsReadMutation.mutate({ conversationId, messageId });
  }, [markAsReadMutation]);

  const deleteMessage = useCallback((messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  }, [deleteMessageMutation]);

  useEffect(() => {
    if (conversationsData) {
      setHasMore(conversationsData.hasMore);
    }
  }, [conversationsData]);

  return {
    // Conversations data
    conversations: conversationsData?.conversations || [],
    
    // Loading states
    conversationsLoading,
    
    // Error states
    conversationsError,
    
    // Actions
    loadMoreConversations,
    refresh,
    sendMessage,
    createConversation,
    markAsRead,
    deleteMessage,
    
    // Pagination
    hasMore,
    nextCursor: conversationsData?.nextCursor,
    
    // Mutations
    sendMessageMutation,
    createConversationMutation,
    markAsReadMutation,
    deleteMessageMutation,
  };
};

export const useConversationMessages = (conversationId: string) => {
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const queryClient = useQueryClient();

  const {
    data: messagesData,
    isLoading,
    error,
    refetch,
  } = useQuery<{ messages: Message[]; nextCursor?: string; hasMore: boolean }>(
    ['messages', conversationId, cursor],
    () => messageService.getMessages(conversationId, cursor),
    {
      enabled: !!conversationId,
      keepPreviousData: true,
    }
  );

  const sendMessageMutation = useMutation(
    (messageData: SendMessageRequest) => messageService.sendMessage(messageData),
    {
      onSuccess: (newMessage) => {
        // Add new message to the conversation
        queryClient.setQueryData(['messages', conversationId], (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            messages: [newMessage, ...oldData.messages],
          };
        });
      },
    }
  );

  const markAsReadMutation = useMutation(
    (messageId: string) => messageService.markAsRead(conversationId, messageId),
  );

  const deleteMessageMutation = useMutation(
    (messageId: string) => messageService.deleteMessage(messageId),
    {
      onSuccess: (_, messageId) => {
        // Remove message from conversation
        queryClient.setQueryData(['messages', conversationId], (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            messages: oldData.messages.filter((msg: Message) => msg.id !== messageId),
          };
        });
      },
    }
  );

  const loadMoreMessages = useCallback(() => {
    if (messagesData?.nextCursor && hasMore && !isLoading) {
      setCursor(messagesData.nextCursor);
    }
  }, [messagesData?.nextCursor, hasMore, isLoading]);

  const refresh = useCallback(() => {
    setCursor(undefined);
    setHasMore(true);
    refetch();
  }, [refetch]);

  const sendMessage = useCallback((content: string, type: 'text' | 'image' | 'video' | 'audio' | 'file' = 'text', mediaUrl?: string) => {
    sendMessageMutation.mutate({
      conversationId,
      content,
      type,
      mediaUrl,
    });
  }, [sendMessageMutation, conversationId]);

  const markAsRead = useCallback((messageId: string) => {
    markAsReadMutation.mutate(messageId);
  }, [markAsReadMutation]);

  const deleteMessage = useCallback((messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  }, [deleteMessageMutation]);

  useEffect(() => {
    if (messagesData) {
      setHasMore(messagesData.hasMore);
    }
  }, [messagesData]);

  return {
    // Messages data
    messages: messagesData?.messages || [],
    
    // Loading states
    isLoading,
    
    // Error states
    error,
    
    // Actions
    loadMoreMessages,
    refresh,
    sendMessage,
    markAsRead,
    deleteMessage,
    
    // Pagination
    hasMore,
    nextCursor: messagesData?.nextCursor,
    
    // Mutations
    sendMessageMutation,
    markAsReadMutation,
    deleteMessageMutation,
  };
};
