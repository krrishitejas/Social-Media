import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { useTheme } from '@components/ThemeProvider';
import { useFeed } from '@hooks/useFeed';
import { ReelsPlayer } from '@components/ReelsPlayer';
import { Post } from '@types';

const { height } = Dimensions.get('window');

export const ReelsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const {
    posts,
    isLoading,
    error,
    handleLike,
    handleBookmark,
    handleShare,
  } = useFeed('algorithmic');

  // Filter posts to only show videos
  const videoPosts = posts.filter(post => 
    post.media.some(media => media.type === 'video')
  );

  const handleNext = () => {
    if (currentIndex < videoPosts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleClose = () => {
    // TODO: Navigate back
    console.log('Close reels');
  };

  const renderItem = ({ item, index }: { item: Post; index: number }) => {
    if (index !== currentIndex) return null;

    return (
      <ReelsPlayer
        posts={videoPosts}
        initialIndex={currentIndex}
        onClose={handleClose}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
  });

  if (isLoading || videoPosts.length === 0) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videoPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / height);
          setCurrentIndex(index);
        }}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
      />
    </View>
  );
};
