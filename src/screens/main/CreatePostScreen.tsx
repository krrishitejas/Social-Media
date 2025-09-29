import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@components/ThemeProvider';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/Button';
import { Post } from '@types';

const { width } = Dimensions.get('window');

export const CreatePostScreen: React.FC = () => {
  const { colors, typography, spacing } = useTheme();
  const { user } = useAuth();
  
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleMediaSelect = () => {
    // TODO: Implement media picker
    Alert.alert('Media Selection', 'Media picker will be implemented here');
  };

  const handleLocationSelect = () => {
    // TODO: Implement location picker
    Alert.alert('Location Selection', 'Location picker will be implemented here');
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags(prev => [...prev, tag]);
    }
  };

  const handleMentionAdd = (mention: string) => {
    if (mention && !mentions.includes(mention)) {
      setMentions(prev => [...prev, mention]);
    }
  };

  const handlePost = async () => {
    if (selectedMedia.length === 0) {
      Alert.alert('Error', 'Please select at least one media item');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement post creation API
      console.log('Creating post:', {
        media: selectedMedia,
        caption,
        location,
        tags,
        mentions,
      });
      
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMediaPreview = () => (
    <View style={styles.mediaContainer}>
      {selectedMedia.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedMedia.map((uri, index) => (
            <View key={index} style={styles.mediaItem}>
              <Image source={{ uri }} style={styles.mediaImage} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setSelectedMedia(prev => prev.filter((_, i) => i !== index))}
              >
                <Icon name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <TouchableOpacity style={styles.addMediaButton} onPress={handleMediaSelect}>
          <Icon name="add-photo-alternate" size={48} color={colors.text.secondary} />
          <Text style={styles.addMediaText}>Add Photos or Videos</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCaptionInput = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Caption</Text>
      <TextInput
        style={styles.captionInput}
        value={caption}
        onChangeText={setCaption}
        placeholder="Write a caption..."
        placeholderTextColor={colors.text.disabled}
        multiline
        maxLength={2200}
      />
      <Text style={styles.characterCount}>{caption.length}/2200</Text>
    </View>
  );

  const renderLocationInput = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Location</Text>
      <TouchableOpacity style={styles.locationButton} onPress={handleLocationSelect}>
        <Icon name="location-on" size={20} color={colors.primary} />
        <Text style={styles.locationText}>
          {location || 'Add location'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTagsInput = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tags</Text>
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
            <TouchableOpacity
              onPress={() => setTags(prev => prev.filter((_, i) => i !== index))}
            >
              <Icon name="close" size={16} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
        ))}
        <TextInput
          style={styles.tagInput}
          placeholder="Add tags..."
          placeholderTextColor={colors.text.disabled}
          onSubmitEditing={(e) => {
            handleTagAdd(e.nativeEvent.text);
            e.nativeEvent.text = '';
          }}
        />
      </View>
    </View>
  );

  const renderMentionsInput = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Mentions</Text>
      <View style={styles.mentionsContainer}>
        {mentions.map((mention, index) => (
          <View key={index} style={styles.mention}>
            <Text style={styles.mentionText}>@{mention}</Text>
            <TouchableOpacity
              onPress={() => setMentions(prev => prev.filter((_, i) => i !== index))}
            >
              <Icon name="close" size={16} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
        ))}
        <TextInput
          style={styles.mentionInput}
          placeholder="Add mentions..."
          placeholderTextColor={colors.text.disabled}
          onSubmitEditing={(e) => {
            handleMentionAdd(e.nativeEvent.text);
            e.nativeEvent.text = '';
          }}
        />
      </View>
    </View>
  );

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View
          key={step}
          style={[
            styles.step,
            currentStep >= step && styles.activeStep,
          ]}
        />
      ))}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    headerButton: {
      padding: spacing.sm,
    },
    headerButtonText: {
      ...typography.textStyles.button,
      color: colors.primary,
    },
    headerTitle: {
      ...typography.textStyles.h4,
      color: colors.text.primary,
    },
    content: {
      flex: 1,
    },
    stepIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: spacing.md,
    },
    step: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.gray[300],
      marginHorizontal: 4,
    },
    activeStep: {
      backgroundColor: colors.primary,
    },
    mediaContainer: {
      padding: spacing.md,
    },
    mediaItem: {
      position: 'relative',
      marginRight: spacing.sm,
    },
    mediaImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    removeButton: {
      position: 'absolute',
      top: 4,
      right: 4,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 10,
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addMediaButton: {
      height: 100,
      backgroundColor: colors.gray[100],
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addMediaText: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
      marginTop: spacing.sm,
    },
    section: {
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    sectionTitle: {
      ...typography.textStyles.h5,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    captionInput: {
      ...typography.textStyles.body,
      color: colors.text.primary,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    characterCount: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
      textAlign: 'right',
      marginTop: spacing.xs,
    },
    locationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    locationText: {
      ...typography.textStyles.body,
      color: location ? colors.text.primary : colors.text.disabled,
      marginLeft: spacing.sm,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.gray[100],
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 16,
      marginRight: spacing.sm,
      marginBottom: spacing.sm,
    },
    tagText: {
      ...typography.textStyles.caption,
      color: colors.primary,
      marginRight: spacing.xs,
    },
    tagInput: {
      ...typography.textStyles.body,
      color: colors.text.primary,
      minWidth: 100,
    },
    mentionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    mention: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.gray[100],
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 16,
      marginRight: spacing.sm,
      marginBottom: spacing.sm,
    },
    mentionText: {
      ...typography.textStyles.caption,
      color: colors.primary,
      marginRight: spacing.xs,
    },
    mentionInput: {
      ...typography.textStyles.body,
      color: colors.text.primary,
      minWidth: 100,
    },
    footer: {
      padding: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>New Post</Text>
        
        <TouchableOpacity style={styles.headerButton} onPress={handlePost}>
          <Text style={styles.headerButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderStepIndicator()}
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderMediaPreview()}
          {renderCaptionInput()}
          {renderLocationInput()}
          {renderTagsInput()}
          {renderMentionsInput()}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button
          title="Share Post"
          onPress={handlePost}
          loading={isLoading}
          disabled={selectedMedia.length === 0}
        />
      </View>
    </View>
  );
};
