import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Slider,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@components/ThemeProvider';

const { width, height } = Dimensions.get('window');

interface PhotoEditorProps {
  imageUri: string;
  onSave: (editedImage: string) => void;
  onCancel: () => void;
}

export const PhotoEditor: React.FC<PhotoEditorProps> = ({
  imageUri,
  onSave,
  onCancel,
}) => {
  const { colors, typography, spacing } = useTheme();
  
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(1);
  const [saturation, setSaturation] = useState(1);
  const [warmth, setWarmth] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);

  const filters = [
    { name: 'None', value: null },
    { name: 'Normal', value: 'normal' },
    { name: 'Vintage', value: 'vintage' },
    { name: 'Black & White', value: 'bw' },
    { name: 'Sepia', value: 'sepia' },
    { name: 'Cool', value: 'cool' },
    { name: 'Warm', value: 'warm' },
    { name: 'Dramatic', value: 'dramatic' },
  ];

  const handleSave = () => {
    // TODO: Apply all edits and save
    onSave(imageUri);
  };

  const handleReset = () => {
    setBrightness(0);
    setContrast(1);
    setSaturation(1);
    setWarmth(0);
    setSelectedFilter(null);
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerButton} onPress={onCancel}>
        <Text style={styles.headerButtonText}>Cancel</Text>
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Edit Photo</Text>
      
      <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
        <Text style={styles.headerButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );

  const renderImage = () => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: imageUri }}
        style={[
          styles.image,
          {
            transform: [
              { rotate: `${rotation}deg` },
              { scaleX: flipHorizontal ? -1 : 1 },
              { scaleY: flipVertical ? -1 : 1 },
            ],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );

  const renderFilters = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Filters</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.name}
            style={[
              styles.filterButton,
              selectedFilter === filter.value && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter.value)}
          >
            <View style={styles.filterPreview}>
              <Image
                source={{ uri: imageUri }}
                style={styles.filterImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.filterText}>{filter.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderAdjustments = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Adjustments</Text>
      
      <View style={styles.adjustmentItem}>
        <Text style={styles.adjustmentLabel}>Brightness</Text>
        <Slider
          style={styles.slider}
          minimumValue={-1}
          maximumValue={1}
          value={brightness}
          onValueChange={setBrightness}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.gray[300]}
          thumbStyle={styles.thumb}
        />
        <Text style={styles.adjustmentValue}>{Math.round(brightness * 100)}</Text>
      </View>

      <View style={styles.adjustmentItem}>
        <Text style={styles.adjustmentLabel}>Contrast</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={2}
          value={contrast}
          onValueChange={setContrast}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.gray[300]}
          thumbStyle={styles.thumb}
        />
        <Text style={styles.adjustmentValue}>{Math.round(contrast * 100)}</Text>
      </View>

      <View style={styles.adjustmentItem}>
        <Text style={styles.adjustmentLabel}>Saturation</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={2}
          value={saturation}
          onValueChange={setSaturation}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.gray[300]}
          thumbStyle={styles.thumb}
        />
        <Text style={styles.adjustmentValue}>{Math.round(saturation * 100)}</Text>
      </View>

      <View style={styles.adjustmentItem}>
        <Text style={styles.adjustmentLabel}>Warmth</Text>
        <Slider
          style={styles.slider}
          minimumValue={-1}
          maximumValue={1}
          value={warmth}
          onValueChange={setWarmth}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.gray[300]}
          thumbStyle={styles.thumb}
        />
        <Text style={styles.adjustmentValue}>{Math.round(warmth * 100)}</Text>
      </View>
    </View>
  );

  const renderTransform = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Transform</Text>
      
      <View style={styles.transformButtons}>
        <TouchableOpacity
          style={styles.transformButton}
          onPress={() => setRotation(prev => prev + 90)}
        >
          <Icon name="rotate-right" size={24} color={colors.text.primary} />
          <Text style={styles.transformButtonText}>Rotate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.transformButton}
          onPress={() => setFlipHorizontal(prev => !prev)}
        >
          <Icon name="flip" size={24} color={colors.text.primary} />
          <Text style={styles.transformButtonText}>Flip H</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.transformButton}
          onPress={() => setFlipVertical(prev => !prev)}
        >
          <Icon name="flip" size={24} color={colors.text.primary} />
          <Text style={styles.transformButtonText}>Flip V</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.transformButton}
          onPress={handleReset}
        >
          <Icon name="refresh" size={24} color={colors.text.primary} />
          <Text style={styles.transformButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
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
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.gray[900],
    },
    image: {
      width: width * 0.9,
      height: height * 0.4,
    },
    section: {
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    sectionTitle: {
      ...typography.textStyles.h5,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    filterButton: {
      alignItems: 'center',
      marginRight: spacing.md,
    },
    activeFilterButton: {
      opacity: 0.7,
    },
    filterPreview: {
      width: 60,
      height: 60,
      borderRadius: 30,
      overflow: 'hidden',
      marginBottom: spacing.xs,
    },
    filterImage: {
      width: '100%',
      height: '100%',
    },
    filterText: {
      ...typography.textStyles.caption,
      color: colors.text.primary,
    },
    adjustmentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    adjustmentLabel: {
      ...typography.textStyles.body,
      color: colors.text.primary,
      width: 80,
    },
    slider: {
      flex: 1,
      marginHorizontal: spacing.md,
    },
    thumb: {
      backgroundColor: colors.primary,
    },
    adjustmentValue: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
      width: 40,
      textAlign: 'right',
    },
    transformButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    transformButton: {
      alignItems: 'center',
      padding: spacing.sm,
    },
    transformButtonText: {
      ...typography.textStyles.caption,
      color: colors.text.primary,
      marginTop: spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderImage()}
      {renderFilters()}
      {renderAdjustments()}
      {renderTransform()}
    </View>
  );
};
