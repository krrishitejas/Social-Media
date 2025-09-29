import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@hooks/useAuth';

const { width, height } = Dimensions.get('window');

interface StoryCreatorProps {
  onClose: () => void;
  onSave: (story: any) => void;
}

export const StoryCreator: React.FC<StoryCreatorProps> = ({ onClose, onSave }) => {
  const { colors, typography, spacing } = useTheme();
  const { user } = useAuth();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textPosition, setTextPosition] = useState({ x: width / 2, y: height / 2 });
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [showStickers, setShowStickers] = useState(false);

  const textColors = ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  const stickers = [
    '😀', '😂', '😍', '🤔', '😎', '🥳', '❤️', '👍', '👏', '🔥',
    '💯', '✨', '🎉', '🎊', '🌟', '💫', '🌈', '🦄', '🎈', '🎁'
  ];

  const handleImageSelect = () => {
    // TODO: Implement image picker
    console.log('Select image');
  };

  const handleTextAdd = () => {
    setShowTextInput(true);
  };

  const handleStickerAdd = () => {
    setShowStickers(true);
  };

  const handleSave = () => {
    const story = {
      id: Date.now().toString(),
      userId: user?.id,
      media: {
        type: 'image',
        url: selectedImage,
      },
      text,
      textColor,
      textPosition,
      sticker: selectedSticker,
      createdAt: new Date().toISOString(),
    };
    
    onSave(story);
  };

  const renderTextInput = () => {
    if (!showTextInput) return null;

    return (
      <View style={styles.textInputContainer}>
        <TextInput
          style={[styles.textInput, { color: textColor }]}
          value={text}
          onChangeText={setText}
          placeholder="Add text to your story"
          placeholderTextColor="rgba(255,255,255,0.5)"
          multiline
        />
        
        <View style={styles.textControls}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {textColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorButton, { backgroundColor: color }]}
                onPress={() => setTextColor(color)}
              />
            ))}
          </ScrollView>
          
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setShowTextInput(false)}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderStickers = () => {
    if (!showStickers) return null;

    return (
      <View style={styles.stickersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {stickers.map((sticker, index) => (
            <TouchableOpacity
              key={index}
              style={styles.stickerButton}
              onPress={() => {
                setSelectedSticker(sticker);
                setShowStickers(false);
              }}
            >
              <Text style={styles.stickerText}>{sticker}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
    },
    headerButton: {
      padding: spacing.sm,
    },
    headerButtonText: {
      ...typography.textStyles.button,
      color: '#FFFFFF',
    },
    saveButton: {
      ...typography.textStyles.button,
      color: colors.primary,
    },
    content: {
      flex: 1,
      position: 'relative',
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderImage: {
      width: width * 0.8,
      height: height * 0.6,
      backgroundColor: colors.gray[800],
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    storyImage: {
      width: '100%',
      height: '100%',
    },
    textOverlay: {
      position: 'absolute',
      top: textPosition.y,
      left: textPosition.x,
      transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    storyText: {
      ...typography.textStyles.h3,
      color: textColor,
      textAlign: 'center',
    },
    stickerOverlay: {
      position: 'absolute',
      top: height / 2,
      left: width / 2,
      transform: [{ translateX: -25 }, { translateY: -25 }],
    },
    stickerText: {
      fontSize: 48,
    },
    controls: {
      position: 'absolute',
      bottom: spacing.xl,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: spacing.xl,
    },
    controlButton: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 25,
      padding: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    controlButtonText: {
      ...typography.textStyles.caption,
      color: '#FFFFFF',
      marginTop: spacing.xs,
    },
    textInputContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
    },
    textInput: {
      ...typography.textStyles.h2,
      textAlign: 'center',
      marginBottom: spacing.xl,
      minHeight: 100,
    },
    textControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    colorButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginHorizontal: spacing.sm,
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    doneButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      marginLeft: spacing.lg,
    },
    doneButtonText: {
      ...typography.textStyles.button,
      color: '#FFFFFF',
    },
    stickersContainer: {
      position: 'absolute',
      bottom: 100,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      paddingVertical: spacing.md,
    },
    stickerButton: {
      padding: spacing.sm,
      marginHorizontal: spacing.xs,
    },
    stickerText: {
      fontSize: 32,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={onClose}>
          <Text style={styles.headerButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerButtonText}>New Story</Text>
        
        <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
          <Text style={styles.saveButton}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.storyImage} />
        ) : (
          <View style={styles.imageContainer}>
            <TouchableOpacity style={styles.placeholderImage} onPress={handleImageSelect}>
              <Icon name="add-photo-alternate" size={48} color={colors.text.secondary} />
              <Text style={styles.placeholderText}>Tap to add photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {text && (
          <View style={styles.textOverlay}>
            <Text style={styles.storyText}>{text}</Text>
          </View>
        )}

        {selectedSticker && (
          <View style={styles.stickerOverlay}>
            <Text style={styles.stickerText}>{selectedSticker}</Text>
          </View>
        )}

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleImageSelect}>
            <Icon name="add-photo-alternate" size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={handleTextAdd}>
            <Icon name="text-fields" size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Text</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={handleStickerAdd}>
            <Icon name="emoji-emotions" size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Sticker</Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderTextInput()}
      {renderStickers()}
    </View>
  );
};
