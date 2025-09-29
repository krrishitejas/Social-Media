import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@components/ThemeProvider';
import { HomeScreen } from '@screens/main/HomeScreen';
import { SearchScreen } from '@screens/main/SearchScreen';
import { CameraScreen } from '@screens/main/CameraScreen';
import { NotificationsScreen } from '@screens/main/NotificationsScreen';
import { ProfileScreen } from '@screens/main/ProfileScreen';
import { PostScreen } from '@screens/main/PostScreen';
import { ChatScreen } from '@screens/main/ChatScreen';
import { EditProfileScreen } from '@screens/main/EditProfileScreen';
import { SettingsScreen } from '@screens/main/SettingsScreen';
import { ExploreScreen } from '@screens/main/ExploreScreen';
import { LiveScreen } from '@screens/main/LiveScreen';
import { ShopScreen } from '@screens/main/ShopScreen';
import { MainTabParamList, RootStackParamList } from '@types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const MainTabs: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Camera':
              iconName = 'add-circle-outline';
              break;
            case 'Notifications':
              iconName = 'notifications';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'home';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopColor: colors.border.light,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
          borderBottomColor: colors.border.light,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Post"
        component={PostScreen}
        options={{ title: 'Post' }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: 'Chat' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ title: 'Explore' }}
      />
      <Stack.Screen
        name="Live"
        component={LiveScreen}
        options={{ title: 'Live' }}
      />
      <Stack.Screen
        name="Shop"
        component={ShopScreen}
        options={{ title: 'Shop' }}
      />
    </Stack.Navigator>
  );
};
