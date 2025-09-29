import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@components/ThemeProvider';
import { useAuth } from '@hooks/useAuth';
import { LiveStream, LiveComment } from '@types';

const { width, height } = Dimensions.get('window');

interface LiveScreenProps {
  route: {
    params: {
      streamId: string;
      isHost?: boolean;
    };
  };
}

export const LiveScreen: React.FC<LiveScreenProps> = ({ route }) => {
  const { colors, typography, spacing } = useTheme();
  const { user } = useAuth();
  const { streamId, isHost = false } = route.params;
  
  const [stream, setStream] = useState<LiveStream | null>(null);
  const [comments, setComments] = useState<LiveComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(true);
  const [showViewers, setShowViewers] = useState(false);

  const commentListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadStreamData();
    // Mock real-time updates
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1);
      setLikesCount(prev => prev + Math.floor(Math.random() * 2));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const loadStreamData = async () => {
    try {
      // TODO: Implement actual API call
      const mockStream: LiveStream = {
        id: streamId,
        title: 'Live Stream Title',
        description: 'Live stream description',
        host: {
          id: 'host1',
          username: 'hostuser',
          avatar: 'https://example.com/avatar.jpg',
        },
        viewerCount: 150,
        likesCount: 25,
        isLive: true,
        startedAt: new Date().toISOString(),
        category: 'Gaming',
        tags: ['gaming', 'live'],
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        hlsUrl: 'https://example.com/stream.m3u8',
        rtmpUrl: 'rtmp://example.com/live',
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setStream(mockStream);
      setViewerCount(mockStream.viewerCount);
      setLikesCount(mockStream.likesCount);
    } catch (error) {
      console.error('Error loading stream data:', error);
    }
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      const newComment: LiveComment = {
        id: Date.now().toString(),
        content: commentText.trim(),
        user: user!,
        streamId,
        createdAt: new Date().toISOString(),
        isPinned: false,
      };
      
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      
      // Auto-scroll to bottom
      setTimeout(() => {
        commentListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    Alert.alert('Share Live Stream', 'Choose sharing platform', [
      { text: 'Twitter', onPress: () => console.log('Share to Twitter') },
      { text: 'Facebook', onPress: () => console.log('Share to Facebook') },
      { text: 'Copy Link', onPress: () => console.log('Copy link') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleReport = () => {
    Alert.alert('Report Live Stream', 'Why are you reporting this stream?', [
      { text: 'Inappropriate Content', onPress: () => console.log('Report: Inappropriate') },
      { text: 'Spam', onPress: () => console.log('Report: Spam') },
      { text: 'Harassment', onPress: () => console.log('Report: Harassment') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleStartStream = () => {
    setIsStreaming(true);
    // TODO: Implement actual streaming start
  };

  const handleEndStream = () => {
    Alert.alert('End Stream', 'Are you sure you want to end this live stream?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End Stream', onPress: () => setIsStreaming(false), style: 'destructive' },
    ]);
  };

  const renderVideoPlayer = () => (
    <View style={styles.videoContainer}>
      {/* Mock video player - in real app, use react-native-video */}
      <View style={styles.videoPlaceholder}>
        <Icon name="live-tv" size={64} color={colors.text.secondary} />
        <Text style={styles.videoText}>Live Stream</Text>
      </View>
      
      {/* Stream overlay */}
      <View style={styles.streamOverlay}>
        <View style={styles.streamInfo}>
          <Text style={styles.streamTitle}>{stream?.title}</Text>
          <Text style={styles.streamDescription}>{stream?.description}</Text>
        </View>
        
        <View style={styles.streamStats}>
          <View style={styles.statItem}>
            <Icon name="visibility" size={16} color="#FFFFFF" />
            <Text style={styles.statText}>{viewerCount}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="favorite" size={16} color="#FFFFFF" />
            <Text style={styles.statText}>{likesCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderComments = () => (
    <View style={styles.commentsContainer}>
      <View style={styles.commentsHeader}>
        <Text style={styles.commentsTitle}>Live Comments</Text>
        <TouchableOpacity onPress={() => setShowComments(!showComments)}>
          <Icon 
            name={showComments ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} 
            size={24} 
            color={colors.text.primary} 
          />
        </TouchableOpacity>
      </View>
      
      {showComments && (
        <FlatList
          ref={commentListRef}
          data={comments}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <Image source={{ uri: item.user.avatar }} style={styles.commentAvatar} />
              <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>{item.user.username}</Text>
                <Text style={styles.commentText}>{item.content}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          style={styles.commentsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );

  const renderInput = () => (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.inputContainer}
    >
      <View style={styles.inputRow}>
        <TextInput
          style={styles.commentInput}
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Add a comment..."
          placeholderTextColor={colors.text.disabled}
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={[styles.sendButton, commentText.trim() && styles.sendButtonActive]}
          onPress={handleSendComment}
          disabled={!commentText.trim()}
        >
          <Icon 
            name="send" 
            size={20} 
            color={commentText.trim() ? '#FFFFFF' : colors.text.disabled} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  const renderControls = () => (
    <View style={styles.controlsContainer}>
      <TouchableOpacity style={styles.controlButton} onPress={handleLike}>
        <Icon 
          name={isLiked ? 'favorite' : 'favorite-border'} 
          size={24} 
          color={isLiked ? colors.error : '#FFFFFF'} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.controlButton} onPress={() => setShowViewers(!showViewers)}>
        <Icon name="people" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.controlButton} onPress={handleShare}>
        <Icon name="share" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.controlButton} onPress={handleReport}>
        <Icon name="report" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      {isHost && (
        <TouchableOpacity 
          style={[styles.controlButton, styles.endStreamButton]} 
          onPress={handleEndStream}
        >
          <Icon name="stop" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    videoContainer: {
      flex: 1,
      position: 'relative',
    },
    videoPlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.gray[900],
    },
    videoText: {
      ...typography.textStyles.h4,
      color: colors.text.secondary,
      marginTop: spacing.sm,
    },
    streamOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: spacing.md,
    },
    streamInfo: {
      marginBottom: spacing.sm,
    },
    streamTitle: {
      ...typography.textStyles.h5,
      color: '#FFFFFF',
      marginBottom: spacing.xs,
    },
    streamDescription: {
      ...typography.textStyles.body,
      color: 'rgba(255,255,255,0.8)',
    },
    streamStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    statText: {
      ...typography.textStyles.caption,
      color: '#FFFFFF',
      marginLeft: spacing.xs,
    },
    commentsContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      maxHeight: height * 0.4,
    },
    commentsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.2)',
    },
    commentsTitle: {
      ...typography.textStyles.button,
      color: '#FFFFFF',
    },
    commentsList: {
      maxHeight: height * 0.25,
    },
    commentItem: {
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    commentAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: spacing.sm,
    },
    commentContent: {
      flex: 1,
    },
    commentUsername: {
      ...typography.textStyles.caption,
      color: colors.primary,
      marginBottom: spacing.xs,
    },
    commentText: {
      ...typography.textStyles.body,
      color: '#FFFFFF',
    },
    inputContainer: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.2)',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    commentInput: {
      flex: 1,
      ...typography.textStyles.body,
      color: '#FFFFFF',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 20,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginRight: spacing.sm,
      maxHeight: 80,
    },
    sendButton: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 20,
      padding: spacing.sm,
    },
    sendButtonActive: {
      backgroundColor: colors.primary,
    },
    controlsContainer: {
      position: 'absolute',
      right: spacing.md,
      bottom: height * 0.4 + spacing.md,
      alignItems: 'center',
    },
    controlButton: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 25,
      padding: spacing.sm,
      marginBottom: spacing.sm,
    },
    endStreamButton: {
      backgroundColor: colors.error,
    },
  });

  return (
    <View style={styles.container}>
      {renderVideoPlayer()}
      {renderComments()}
      {renderInput()}
      {renderControls()}
    </View>
  );
};