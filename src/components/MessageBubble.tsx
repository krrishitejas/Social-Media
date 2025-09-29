import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@components/ThemeProvider';
import { Message } from '@types';

const { width } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = width * 0.75;

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  onReply?: () => void;
  onDelete?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  onPress,
  onLongPress,
  onReply,
  onDelete,
}) => {
  const { colors, typography, spacing } = useTheme();

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
            {message.content}
          </Text>
        );
      
      case 'image':
        return (
          <Image
            source={{ uri: message.mediaUrl }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        );
      
      case 'video':
        return (
          <View style={styles.videoContainer}>
            <Image
              source={{ uri: message.mediaUrl }}
              style={styles.messageVideo}
              resizeMode="cover"
            />
            <View style={styles.playButton}>
              <Icon name="play-arrow" size={24} color="#FFFFFF" />
            </View>
          </View>
        );
      
      case 'audio':
        return (
          <View style={styles.audioContainer}>
            <Icon name="audiotrack" size={20} color={isOwn ? '#FFFFFF' : colors.text.primary} />
            <Text style={[styles.audioText, isOwn && styles.ownMessageText]}>
              Audio message
            </Text>
          </View>
        );
      
      case 'file':
        return (
          <View style={styles.fileContainer}>
            <Icon name="attach-file" size={20} color={isOwn ? '#FFFFFF' : colors.text.primary} />
            <Text style={[styles.fileText, isOwn && styles.ownMessageText]}>
              {message.content}
            </Text>
          </View>
        );
      
      default:
        return (
          <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
            {message.content}
          </Text>
        );
    }
  };

  const renderReply = () => {
    if (!message.replyToMessage) return null;

    return (
      <View style={[styles.replyContainer, isOwn && styles.ownReplyContainer]}>
        <Text style={[styles.replyText, isOwn && styles.ownReplyText]}>
          {message.replyToMessage.content}
        </Text>
      </View>
    );
  };

  const renderTime = () => (
    <Text style={[styles.timeText, isOwn && styles.ownTimeText]}>
      {new Date(message.createdAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}
    </Text>
  );

  const renderStatus = () => {
    if (!isOwn) return null;

    return (
      <View style={styles.statusContainer}>
        {message.isRead ? (
          <Icon name="done-all" size={16} color={colors.primary} />
        ) : message.isDelivered ? (
          <Icon name="done-all" size={16} color={colors.text.secondary} />
        ) : (
          <Icon name="done" size={16} color={colors.text.secondary} />
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: isOwn ? 'flex-end' : 'flex-start',
      marginVertical: spacing.xs,
      paddingHorizontal: spacing.md,
    },
    bubble: {
      maxWidth: MAX_BUBBLE_WIDTH,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      backgroundColor: isOwn ? colors.primary : colors.gray[100],
    },
    ownBubble: {
      backgroundColor: colors.primary,
    },
    messageText: {
      ...typography.textStyles.body,
      color: colors.text.primary,
    },
    ownMessageText: {
      color: '#FFFFFF',
    },
    messageImage: {
      width: 200,
      height: 200,
      borderRadius: 12,
    },
    videoContainer: {
      position: 'relative',
    },
    messageVideo: {
      width: 200,
      height: 150,
      borderRadius: 12,
    },
    playButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -12 }, { translateY: -12 }],
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 24,
      padding: 8,
    },
    audioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    audioText: {
      ...typography.textStyles.body,
      marginLeft: spacing.sm,
    },
    fileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    fileText: {
      ...typography.textStyles.body,
      marginLeft: spacing.sm,
    },
    replyContainer: {
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      paddingLeft: spacing.sm,
      marginBottom: spacing.xs,
    },
    ownReplyContainer: {
      borderLeftColor: '#FFFFFF',
    },
    replyText: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
    ownReplyText: {
      color: 'rgba(255,255,255,0.8)',
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: isOwn ? 'flex-end' : 'flex-start',
      marginTop: spacing.xs,
    },
    timeText: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
    ownTimeText: {
      color: colors.text.secondary,
    },
    statusContainer: {
      marginLeft: spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.bubble, isOwn && styles.ownBubble]}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.8}
      >
        {renderReply()}
        {renderContent()}
      </TouchableOpacity>
      
      <View style={styles.footer}>
        {renderTime()}
        {renderStatus()}
      </View>
    </View>
  );
};
