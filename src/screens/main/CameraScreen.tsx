import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useTheme } from '@components/ThemeProvider';

export const CameraScreen: React.FC = () => {
  const { colors, typography, spacing } = useTheme();
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const cameraRef = useRef<RNCamera>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);
        console.log('Picture taken:', data.uri);
        // TODO: Navigate to post creation screen
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const recordVideo = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.recordAsync();
        console.log('Video recorded:', data.uri);
        // TODO: Navigate to post creation screen
      } catch (error) {
        console.error('Error recording video:', error);
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    camera: {
      flex: 1,
    },
    controls: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.md,
    },
    topControls: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.xl,
      paddingHorizontal: spacing.md,
    },
    controlButton: {
      padding: spacing.md,
    },
    captureButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    captureButtonInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
    },
    controlText: {
      ...typography.textStyles.button,
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        flashMode={flashMode}
        captureAudio={true}
      />
      
      <View style={styles.topControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setCameraType(cameraType === 'back' ? 'front' : 'back')}
        >
          <Text style={styles.controlText}>Flip</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setFlashMode(flashMode === 'off' ? 'on' : 'off')}
        >
          <Text style={styles.controlText}>Flash</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
