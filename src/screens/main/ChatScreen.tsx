import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@components/ThemeProvider';
import { useConversationMessages } from '@hooks/useMessages';
import { MessageBubble } from '@components/MessageBubble';
import { Message, User } from '@types';

interface ChatScreenProps {
  route: {
    params: {
      conversationId: string;
      participants: User[];
    };
  };
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { colors, typography, spacing } = useTheme();
  const { conversationId, participants } = route.params;
  
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  
  const flatListRef = useRef<FlatList>(null);
  
  const {
    messages,
    isLoading,
    error,
    loadMoreMessages,
    refresh,
    sendMessage,
    markAsRead,
    deleteMessage,
    hasMore,
  } = useConversationMessages(conversationId);

  const currentUser = { id: 'current-user' }; // This should come from auth context

  useEffect(() => {
    // Mark messages as read when screen is focused
    if (messages.length > 0) {
      const lastMessage = messages[0];
      if (lastMessage && !lastMessage.isRead && lastMessage.userId !== currentUser.id) {
        markAsRead(lastMessage.id);
      }
    }
  }, [messages, markAsRead, currentUser.id]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendMessage(messageText.trim());
      setMessageText('');
      setReplyToMessage(null);
    }
  };

  const handleSendMedia = (type: 'image' | 'video' | 'audio' | 'file') => {
    // TODO: Implement media picker
    Alert.alert('Media Selection', `${type} picker will be implemented here`);
    setShowAttachmentMenu(false);
  };

  const handleMessageLongPress = (message: Message) => {
    Alert.alert(
      'Message Options',
      'Choose an action',
      [
        { text: 'Reply', onPress: () => setReplyToMessage(message) },
        { text: 'Delete', onPress: () => handleDeleteMessage(message.id), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteMessage(messageId), style: 'destructive' },
      ]
    );
  };

  const handleCancelReply = () => {
    setReplyToMessage(null);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble
      message={item}
      isOwn={item.userId === currentUser.id}
      onLongPress={() => handleMessageLongPress(item)}
    />
  );

  const renderHeader = () => {
    const otherParticipant = participants.find(p => p.id !== currentUser.id);
    
    return (
      <View style={styles.header}>
        <View style={styles.participantInfo}>
          <Image
            source={{ uri: otherParticipant?.avatar }}
            style={styles.avatar}
          />
          <View style={styles.participantDetails}>
            <Text style={styles.participantName}>
              {otherParticipant?.username || 'Unknown User'}
            </Text>
            <Text style={styles.participantStatus}>
              {otherParticipant?.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="videocam" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="call" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderReplyPreview = () => {
    if (!replyToMessage) return null;

    return (
      <View style={styles.replyPreview}>
        <View style={styles.replyInfo}>
          <Text style={styles.replyLabel}>Replying to {replyToMessage.user?.username}</Text>
          <Text style={styles.replyText} numberOfLines={1}>
            {replyToMessage.content}
          </Text>
        </View>
        <TouchableOpacity onPress={handleCancelReply}>
          <Icon name="close" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderInput = () => (
    <View style={styles.inputContainer}>
      {renderReplyPreview()}
      
      <View style={styles.inputRow}>
        <TouchableOpacity
          style={styles.attachmentButton}
          onPress={() => setShowAttachmentMenu(!showAttachmentMenu)}
        >
          <Icon name="add" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          placeholderTextColor={colors.text.disabled}
          multiline
          maxLength={1000}
        />
        
        <TouchableOpacity
          style={styles.emojiButton}
          onPress={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Icon name="emoji-emotions" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.sendButton, messageText.trim() && styles.sendButtonActive]}
          onPress={handleSendMessage}
          disabled={!messageText.trim()}
        >
          <Icon 
            name="send" 
            size={20} 
            color={messageText.trim() ? '#FFFFFF' : colors.text.disabled} 
          />
        </TouchableOpacity>
      </View>
      
      {showAttachmentMenu && (
        <View style={styles.attachmentMenu}>
          <TouchableOpacity
            style={styles.attachmentOption}
            onPress={() => handleSendMedia('image')}
          >
            <Icon name="photo-camera" size={24} color={colors.primary} />
            <Text style={styles.attachmentText}>Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.attachmentOption}
            onPress={() => handleSendMedia('video')}
          >
            <Icon name="videocam" size={24} color={colors.primary} />
            <Text style={styles.attachmentText}>Video</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.attachmentOption}
            onPress={() => handleSendMedia('audio')}
          >
            <Icon name="mic" size={24} color={colors.primary} />
            <Text style={styles.attachmentText}>Audio</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.attachmentOption}
            onPress={() => handleSendMedia('file')}
          >
            <Icon name="attach-file" size={24} color={colors.primary} />
            <Text style={styles.attachmentText}>File</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    participantInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: spacing.sm,
    },
    participantDetails: {
      flex: 1,
    },
    participantName: {
      ...typography.textStyles.button,
      color: colors.text.primary,
    },
    participantStatus: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
    headerActions: {
      flexDirection: 'row',
    },
    headerButton: {
      padding: spacing.sm,
      marginLeft: spacing.sm,
    },
    messagesContainer: {
      flex: 1,
    },
    replyPreview: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.gray[100],
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
    },
    replyInfo: {
      flex: 1,
    },
    replyLabel: {
      ...typography.textStyles.caption,
      color: colors.primary,
      marginBottom: spacing.xs,
    },
    replyText: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
    },
    inputContainer: {
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    attachmentButton: {
      padding: spacing.sm,
      marginRight: spacing.sm,
    },
    textInput: {
      flex: 1,
      ...typography.textStyles.body,
      color: colors.text.primary,
      maxHeight: 100,
      paddingVertical: spacing.sm,
    },
    emojiButton: {
      padding: spacing.sm,
      marginLeft: spacing.sm,
    },
    sendButton: {
      backgroundColor: colors.gray[300],
      borderRadius: 20,
      padding: spacing.sm,
      marginLeft: spacing.sm,
    },
    sendButtonActive: {
      backgroundColor: colors.primary,
    },
    attachmentMenu: {
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.gray[50],
    },
    attachmentOption: {
      alignItems: 'center',
      marginRight: spacing.lg,
    },
    attachmentText: {
      ...typography.textStyles.caption,
      color: colors.text.primary,
      marginTop: spacing.xs,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    emptyText: {
      ...typography.textStyles.h4,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    emptySubtext: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
      textAlign: 'center',
    },
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {renderHeader()}
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesContainer}
        inverted
        onEndReached={loadMoreMessages}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="chat" size={64} color={colors.text.disabled} />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>
              Start a conversation by sending a message
            </Text>
          </View>
        )}
      />
      
      {renderInput()}
    </KeyboardAvoidingView>
  );
};